import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { DevelopmentStage } from "../../data/developmentFlow";

export type CameraView = "overview" | "top";
export type DevelopmentMode = "assembled" | "stations" | "order";
export type StageState = "upcoming" | "active" | "completed";
export type ArtifactState = "idle" | "moving" | "completed";
export type DevelopmentScene = {
  setMode: (mode: DevelopmentMode) => void;
  select: (index: number) => void;
  overview: (view?: CameraView) => void;
  play: () => void;
  advanceOrder: () => void;
  dispose: () => void;
};
type SceneOptions = {
  compact: boolean;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
  onProgress: (index: number, complete: boolean) => void;
  onPlayingChange: (playing: boolean) => void;
  onFailure: () => void;
};
type Station = {
  id: string;
  group: THREE.Group;
  position: THREE.Vector3;
  label: THREE.Sprite | undefined;
  signal: THREE.MeshStandardMaterial;
  housing: THREE.MeshStandardMaterial;
  rotor: THREE.Group;
};

/** Scene-owned GPU resources and listeners never escape this lifecycle boundary. */
export function createDevelopmentScene(host: HTMLDivElement, stages: readonly DevelopmentStage[], options: SceneOptions): DevelopmentScene {
  const scene = new THREE.Scene();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const cleanup: Array<() => void> = [];
  let renderer: THREE.WebGLRenderer | undefined;
  let controls: OrbitControls | undefined;
  let frame = 0;
  let reducedTimer: number | undefined;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    cleanup.forEach(remove => remove());
    controls?.dispose();
    if (reducedTimer) window.clearTimeout(reducedTimer);
    scene.traverse(object => {
      if (object instanceof THREE.InstancedMesh) object.dispose();
      if (object instanceof THREE.DirectionalLight) object.shadow.dispose();
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    textures.forEach(texture => texture.dispose());
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
    scene.clear();
  };

  try {
    const compact = options.compact;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let visible = true;
    let contextLost = false;
    let mode: DevelopmentMode = "assembled";
    let artifactState: ArtifactState = "idle";
    let playing = false;
    let selected: number | null = null;
    let hovered: number | null = null;
    let active = -1;
    let progress = 0;
    let journeyTime = 0;
    let orderStep = 0;
    let returning = false;
    let completed = false;
    let elapsed = 0;
    let previousTime = 0;
    let cameraMoving = false;
    let view: CameraView = "overview";
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    const surface = renderer;
    surface.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.35 : 1.75));
    surface.outputColorSpace = THREE.SRGBColorSpace;
    surface.toneMapping = THREE.ACESFilmicToneMapping;
    surface.toneMappingExposure = 1.05;
    surface.setClearColor(0x000000, 0);
    surface.shadowMap.enabled = !compact;
    surface.shadowMap.type = THREE.PCFSoftShadowMap;
    surface.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(surface.domElement);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 150);
    controls = new OrbitControls(camera, surface.domElement);
    const orbit = controls;
    orbit.enablePan = false;
    orbit.enableZoom = true;
    orbit.enableRotate = !compact;
    orbit.enableDamping = !reduced;
    orbit.dampingFactor = 0.09;
    orbit.minDistance = 7;
    orbit.maxDistance = 70;
    // Lock vertical orbit: the portfolio can rotate around the machine,
    // but the viewer never flips above/below the assembly.
    orbit.minPolarAngle = Math.PI * 0.38;
    orbit.maxPolarAngle = Math.PI * 0.38;
    // No azimuth limits: horizontal drag can travel through a full 360°.
    orbit.autoRotateSpeed = 0.22;
    const cameraGoal = new THREE.Vector3();
    const targetGoal = new THREE.Vector3(0, 0.7, 0);
    const geometryCache = new Map<string, THREE.BufferGeometry>();
    const geometry = <T extends THREE.BufferGeometry>(value: T): T => { geometries.add(value); return value; };
    const material = (color: number, metalness = 0.4, roughness = 0.48) => {
      const value = new THREE.MeshStandardMaterial({ color, metalness, roughness });
      materials.add(value);
      return value;
    };
    const charcoal = material(0x151a1f, 0.55, 0.4);
    const black = material(0x101315, 0.3, 0.62);
    const steel = material(0x69747a, 0.65, 0.34);
    const ivory = material(0xe9dfc9, 0.22, 0.54);
    const orange = material(0xe8763d, 0.35, 0.36);
    const screen = material(0x142023, 0.1, 0.54);
    const glow = material(0xffa465, 0.2, 0.45);
    glow.emissive.set(0xf57632); glow.emissiveIntensity = 0.7;
    const box = (parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], finish: THREE.Material, rounded = true) => {
      const key = `${size.join(":")}:${rounded}`;
      let shape = geometryCache.get(key);
      if (!shape) {
        shape = geometry(rounded ? new RoundedBoxGeometry(...size, 1, Math.min(0.09, ...size.map(value => value / 4))) : new THREE.BoxGeometry(...size));
        geometryCache.set(key, shape);
      }
      const mesh = new THREE.Mesh(shape, finish);
      mesh.position.set(...position); mesh.castShadow = !compact; mesh.receiveShadow = !compact;
      parent.add(mesh); return mesh;
    };
    const cylinderShape = geometry(new THREE.CylinderGeometry(1, 1, 1, 12));
    const cylinder = (parent: THREE.Object3D, radius: number, height: number, position: [number, number, number], finish: THREE.Material) => {
      const mesh = new THREE.Mesh(cylinderShape, finish);
      mesh.scale.set(radius, height, radius); mesh.position.set(...position);
      mesh.castShadow = !compact; parent.add(mesh); return mesh;
    };
    const label = (parent: THREE.Object3D, text: string, position: [number, number, number], width = 3.6) => {
      const canvas = document.createElement("canvas"); canvas.width = 384; canvas.height = 88;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = "rgba(17,20,21,0.9)"; context.fillRect(0, 0, 384, 88);
      context.fillStyle = "#ee8c57"; context.fillRect(0, 0, 4, 88);
      context.font = "500 32px Poppins, sans-serif";
      context.textAlign = "center"; context.textBaseline = "middle";
      context.fillStyle = "#eee5d5"; context.fillText(text, 196, 46, 360);
      const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.add(texture);
      const finish = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true }); materials.add(finish);
      const sprite = new THREE.Sprite(finish); sprite.position.set(...position); sprite.scale.set(width, width * 88 / 384, 1); parent.add(sprite); return sprite;
    };
    const screw = (parent: THREE.Object3D, x: number, y: number, z: number) => {
      cylinder(parent, 0.095, 0.045, [x, y, z], steel);
      box(parent, [0.11, 0.012, 0.02], [x, y + 0.025, z], black, false);
    };
    const board = (parent: THREE.Object3D, x = 0, y = 1.6, z = -0.1, width = 2.1, height = 1.3) => {
      box(parent, [width + 0.17, height + 0.17, 0.16], [x, y, z], steel);
      box(parent, [width, height, 0.04], [x, y, z + 0.1], screen);
      return { x, y, z: z + 0.14, width, height };
    };
    // Distinct mechanisms; all words/content come exclusively from the supplied stage records.
    const mechanisms: Record<string, (group: THREE.Group) => void> = {
      idea(group) {
        box(group, [1.6, 0.16, 1.1], [0, 0.87, 0.15], ivory);
        for (let row = 0; row < 3; row++) box(group, [0.75 - row * 0.14, 0.015, 0.03], [-0.12, 0.97, row * 0.2], steel, false);
        cylinder(group, 0.43, 0.1, [0, 1.25, -0.32], steel);
        const core = new THREE.Mesh(geometry(new THREE.IcosahedronGeometry(0.31, 0)), glow); core.position.set(0, 1.8, -0.32); group.add(core);
        box(group, [0.06, 0.65, 0.06], [-0.75, 1.4, -0.32], orange);
        box(group, [1.1, 0.06, 0.06], [-0.22, 1.73, -0.32], orange);
      },
      planning(group) {
        const panel = board(group);
        for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++)
          box(group, [0.34, 0.18, 0.04], [-0.7 + col * 0.7, 1.2 + row * 0.36, panel.z], row === 1 ? orange : steel);
        box(group, [1.45, 0.025, 0.025], [0, 1.6, panel.z + 0.03], ivory, false);
        box(group, [0.025, 0.86, 0.025], [0, 1.6, panel.z + 0.03], ivory, false);
      },
      design(group) {
        for (let layer = 0; layer < 3; layer++) {
          const panel = board(group, (layer - 1) * 0.35, 1.45 + layer * 0.14, -0.5 + layer * 0.25, 1.55, 1.2);
          if (layer === 2) {
            box(group, [1.22, 0.26, 0.03], [panel.x, panel.y + 0.25, panel.z], ivory);
            box(group, [0.51, 0.35, 0.03], [panel.x - 0.34, panel.y - 0.24, panel.z], orange);
            box(group, [0.51, 0.35, 0.03], [panel.x + 0.34, panel.y - 0.24, panel.z], steel);
          }
        }
      },
      frontend(group) {
        const panel = board(group, 0, 1.75, -0.25, 2.3, 1.4);
        box(group, [2.15, 0.11, 0.03], [0, 2.32, panel.z], ivory);
        box(group, [0.42, 0.96, 0.03], [-0.82, 1.65, panel.z], orange);
        box(group, [1.4, 0.35, 0.03], [0.25, 1.94, panel.z], ivory);
        for (let col = 0; col < 3; col++) box(group, [0.4, 0.4, 0.03], [-0.25 + col * 0.48, 1.47, panel.z], steel);
        box(group, [0.2, 0.43, 0.22], [0, 0.94, -0.25], steel);
        box(group, [1.6, 0.08, 0.5], [0, 0.79, 0.35], charcoal);
      },
      backend(group) {
        for (let row = 0; row < 3; row++) {
          box(group, [1.55, 0.39, 1], [-0.25, 0.97 + row * 0.47, -0.2], charcoal);
          box(group, [0.95, 0.045, 0.035], [-0.4, 1 + row * 0.47, 0.32], steel);
          box(group, [0.12, 0.1, 0.035], [0.32, 1 + row * 0.47, 0.32], glow);
        }
        for (let row = 0; row < 3; row++) cylinder(group, 0.32, 0.28, [0.96, 0.95 + row * 0.31, 0], row === 2 ? orange : steel);
      },
      testing(group) {
        box(group, [2.4, 0.14, 0.22], [0, 2.12, 0.25], steel);
        for (const x of [-1.1, 1.1]) box(group, [0.13, 1.35, 0.22], [x, 1.46, 0.25], steel);
        box(group, [1.85, 0.04, 0.06], [0, 1.83, 0.25], glow);
        for (let col = 0; col < 3; col++) for (let row = 0; row < 2; row++)
          box(group, [0.29, 0.04, 0.24], [-0.5 + col * 0.5, 0.82, row * 0.45 - 0.3], col === 2 ? orange : steel);
        const panel = board(group, 0, 1.43, -0.45, 1.2, 0.65);
        const tick = box(group, [0.11, 0.27, 0.04], [-0.1, 1.4, panel.z], glow); tick.rotation.z = 0.65;
        const check = box(group, [0.11, 0.5, 0.04], [0.13, 1.49, panel.z], glow); check.rotation.z = -0.55;
      },
      deployment(group) {
        cylinder(group, 0.94, 0.18, [0, 0.92, 0], steel);
        cylinder(group, 0.74, 0.1, [0, 1.07, 0], orange);
        box(group, [1, 1.1, 0.82], [0, 1.65, 0], charcoal);
        for (let row = 0; row < 3; row++) box(group, [0.65, 0.05, 0.03], [0, 1.35 + row * 0.24, 0.43], ivory);
        box(group, [0.12, 0.42, 0.12], [0, 2.42, 0], glow);
        const arrow = new THREE.Mesh(geometry(new THREE.ConeGeometry(0.23, 0.32, 4)), glow); arrow.position.set(0, 2.77, 0); group.add(arrow);
      },
    };

    scene.add(new THREE.HemisphereLight(0xdfe8ef, 0x101218, 1.65));
    const key = new THREE.DirectionalLight(0xffe5c4, 3.2); key.position.set(-9, 18, 12); key.castShadow = !compact;
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -16; key.shadow.camera.right = 16; key.shadow.camera.top = 16; key.shadow.camera.bottom = -16;
    key.shadow.normalBias = 0.045; scene.add(key);
    const rim = new THREE.DirectionalLight(0xc1d8e8, 2); rim.position.set(10, 8, -12); scene.add(rim);
    const platform = new THREE.Group(); scene.add(platform);
    const baseWidth = compact ? 12 : 23;
    const baseDepth = compact ? 19.5 : 12.8;
    box(platform, [baseWidth, 0.44, baseDepth], [0, 0, 0], charcoal);
    box(platform, [baseWidth - 0.25, 0.08, baseDepth - 0.25], [0, 0.26, 0], steel);
    box(platform, [baseWidth - 0.35, 0.08, baseDepth - 0.35], [0, 0.31, 0], black);
    for (const x of [-baseWidth / 2 + 0.45, baseWidth / 2 - 0.45]) for (const z of [-baseDepth / 2 + 0.45, baseDepth / 2 - 0.45]) screw(platform, x, 0.39, z);
    for (let x = -baseWidth / 2 + 1; x < baseWidth / 2 - 0.5; x += 1) box(platform, [0.012, 0.008, baseDepth - 0.7], [x, 0.365, 0], charcoal, false);
    for (let z = -baseDepth / 2 + 1; z < baseDepth / 2 - 0.5; z += 1) box(platform, [baseWidth - 0.7, 0.008, 0.012], [0, 0.365, z], charcoal, false);
    // Alternating rows keep physical travel and numbering in the same sequence.
    const stagePosition = (index: number) => {
      const columns = compact ? 2 : 4;
      const row = Math.floor(index / columns);
      const col = row % 2 === 0 ? index % columns : columns - 1 - index % columns;
      return new THREE.Vector3((col - (columns - 1) / 2) * (compact ? 4.2 : 4.4) + (compact ? 0.55 : 0), 0, (row - (compact ? 1.5 : 0.5)) * (compact ? 4.1 : 5.1));
    };
    const stations: Station[] = stages.map((stage, index) => {
      const group = new THREE.Group(); group.userData.stageIndex = index; group.userData.stageId = stage.id;
      const position = stagePosition(index); group.position.copy(position); platform.add(group);
      const housing = material(index === 3 ? 0x44352a : 0x252d32);
      const signal = material(0xf48948); signal.emissive.set(0xe77832); signal.emissiveIntensity = 0.18;
      box(group, [3.25, 0.25, 2.8], [0, 0.54, 0], housing);
      box(group, [2.9, 0.04, 0.065], [0, 0.69, 1.24], signal);
      screw(group, -1.4, 0.7, -1.16); screw(group, 1.4, 0.7, -1.16);
      (mechanisms[stage.id] ?? mechanisms.planning)(group);
      const rotor = new THREE.Group(); rotor.position.set(1.24, 0.91, -0.95); group.add(rotor);
      cylinder(rotor, 0.19, 0.08, [0, 0, 0], steel);
      for (let tooth = 0; tooth < 6; tooth++) {
        const angle = tooth * Math.PI / 3;
        const cog = box(rotor, [0.1, 0.07, 0.1], [Math.sin(angle) * 0.2, 0, Math.cos(angle) * 0.2], steel, false); cog.rotation.y = angle;
      }
      const stationLabel = label(group, `${stage.eyebrow}  ${stage.name}`, [0, 3.2, -0.15], 3.05);
      return { label: stationLabel, id: stage.id, group, position, signal, housing, rotor };
    });
    const finishPosition = stagePosition(stages.length);
    const finish = new THREE.Group(); finish.position.copy(finishPosition); platform.add(finish);
    box(finish, [3.3, 0.25, 2.8], [0, 0.53, 0], steel);
    const finishSignal = material(0x32261e); finishSignal.emissive.set(0xffa267);
    box(finish, [2.9, 0.06, 2.4], [0, 0.72, 0], finishSignal);
    // The output dock receives the same product that entered the line.
    const dockRing = new THREE.Mesh(geometry(new THREE.TorusGeometry(1.04, 0.035, 8, 48)), finishSignal);
    dockRing.rotation.x = Math.PI / 2; dockRing.position.y = 0.81; finish.add(dockRing);
    const finishLabel = label(finish, stages[stages.length - 1].output, [0, 3.25, -0.15], 3.05);
    const liveGreen = material(0x39b47b, 0.18, 0.3); liveGreen.emissive.set(0x25bb73);
    liveGreen.emissiveIntensity = 0.7;
    const liveProduct = new THREE.Group(); finish.add(liveProduct);
    const productModule = new THREE.Group(); productModule.position.set(0, 0.84, 0); liveProduct.add(productModule);
    box(productModule, [1.8, 1.22, 0.14], [0, 1.42, 0], black);
    box(productModule, [1.58, 0.96, 0.035], [0, 1.43, 0.09], screen);
    box(productModule, [1.42, 0.13, 0.025], [0, 1.77, 0.12], orange, false);
    box(productModule, [0.2, 0.56, 0.025], [-0.56, 1.36, 0.12], ivory, false);
    box(productModule, [0.86, 0.22, 0.025], [0.12, 1.58, 0.12], ivory, false);
    for (let column = 0; column < 2; column++) box(productModule, [0.36, 0.3, 0.025], [-0.1 + column * 0.45, 1.22, 0.12], column ? steel : orange, false);
    box(productModule, [0.4, 0.18, 0.2], [0, 0.82, 0], steel);
    box(productModule, [1.02, 0.15, 0.58], [0, 0.67, 0], black);
    cylinder(productModule, 0.1, 0.055, [0.75, 1.0, 0.04], liveGreen);
    box(finish, [2.0, 0.13, 0.045], [0, 0.8, 1.03], charcoal, false);
    const shippedPlaque = label(finish, "PRODUCT SHIPPED", [0, 1.1, 1.08], 2.55);
    const liveBadge = label(liveProduct, "●  LIVE  /  DEPLOYED", [0, 3.1, 0.02], 3.1);
    if (liveBadge) liveBadge.material.opacity = 0;
    // One continuous closed-loop rail for ASSEMBLED/STATIONS and one open
    // journey curve that shares the same physical stations and ends at LIVE PRODUCT.
    // Desktop keeps the original smooth spline. Compact (mobile) uses a clean
    // orthogonal route with rounded corners that travels through side lanes, so
    // the rail never cuts across a station or doubles back over itself.
    const RAIL_Y = 0.83;
    let stationFractions: number[] | null = null;
    const buildRoute = (waypoints: Array<[number, number, number]>, closed: boolean) => {
      const vec = (x: number, z: number) => new THREE.Vector3(x, RAIL_Y, z);
      const nodes = waypoints.map(([x, z, radius], index) => {
        const point = vec(x, z);
        const hasNeighbours = closed || (index > 0 && index < waypoints.length - 1);
        if (!radius || !hasNeighbours) return { point, entry: point, exit: point, round: false };
        const before = waypoints[(index - 1 + waypoints.length) % waypoints.length];
        const after = waypoints[(index + 1) % waypoints.length];
        const toBefore = vec(before[0], before[1]).sub(point); const toAfter = vec(after[0], after[1]).sub(point);
        const reach = Math.min(radius, toBefore.length() / 2, toAfter.length() / 2);
        return { point, entry: point.clone().addScaledVector(toBefore.normalize(), reach), exit: point.clone().addScaledVector(toAfter.normalize(), reach), round: true };
      });
      const dense: THREE.Vector3[] = [];
      const push = (value: THREE.Vector3) => { const last = dense[dense.length - 1]; if (!last || last.distanceToSquared(value) > 1e-4) dense.push(value.clone()); };
      nodes.forEach((node, index) => {
        if (node.round) {
          const arc = new THREE.QuadraticBezierCurve3(node.entry, node.point, node.exit);
          for (let step = 0; step <= 14; step++) push(arc.getPoint(step / 14));
        } else push(node.point);
        const next = nodes[index + 1] ?? (closed ? nodes[0] : undefined);
        if (!next) return;
        const from = node.exit; const to = next.entry; const gap = from.distanceTo(to);
        for (let step = 1; step < Math.floor(gap / 0.2); step++) push(from.clone().lerp(to, step / Math.floor(gap / 0.2)));
      });
      if (closed && dense.length > 1 && dense[0].distanceToSquared(dense[dense.length - 1]) < 1e-4) dense.pop();
      const curve = new THREE.CatmullRomCurve3(dense, closed, "centripetal", 0.5);
      curve.arcLengthDivisions = 4000;
      return { curve, dense };
    };
    let orderCurve: THREE.CatmullRomCurve3;
    let loopCurve: THREE.CatmullRomCurve3;
    if (compact) {
      const colLeft = stagePosition(0).x; const colRight = stagePosition(1).x;
      const laneRight = 4.95; const laneLeft = -3.85; const laneReturn = -4.95; const corner = 1.1;
      const rowZ = [0, 2, 4, 6].map(index => stagePosition(index).z + 1.65);
      const dockZ = stagePosition(stages.length).z + 0.4;
      const shared: Array<[number, number, number]> = [
        [colLeft, rowZ[0], 0],
        [laneRight, rowZ[0], corner], [laneRight, rowZ[1], corner],
        [laneLeft, rowZ[1], corner], [laneLeft, rowZ[2], corner],
        [laneRight, rowZ[2], corner], [laneRight, rowZ[3], corner],
      ];
      const loopRoute = buildRoute([...shared, [laneReturn, rowZ[3], corner], [laneReturn, rowZ[0], corner]], true);
      const orderRoute = buildRoute([...shared, [colLeft, rowZ[3], 0.6], [colLeft, dockZ, 0]], false);
      loopCurve = loopRoute.curve; orderCurve = orderRoute.curve;
      // Map "stage k" to the real arc position of station k so the artifact, the
      // camera and the active-step readout stay in sync on the longer mobile route.
      const dense = orderRoute.dense; const cumulative = [0];
      for (let i = 1; i < dense.length; i++) cumulative.push(cumulative[i - 1] + dense[i].distanceTo(dense[i - 1]));
      const total = cumulative[cumulative.length - 1];
      stationFractions = [...stations.map(station => {
        const target = new THREE.Vector3(station.position.x, RAIL_Y, station.position.z + 1.65);
        let best = 0; let bestDistance = Infinity;
        dense.forEach((point, i) => { const d = point.distanceToSquared(target); if (d < bestDistance) { bestDistance = d; best = i; } });
        return cumulative[best] / total;
      }), 1];
    } else {
      const routePoints = [...stations.map(station => station.position), finishPosition].map(
        (position, index) => new THREE.Vector3(position.x, RAIL_Y, position.z + (index === stages.length ? 0.4 : 1.65))
      );
      orderCurve = new THREE.CatmullRomCurve3(routePoints, false, "centripetal", 0.55);
      loopCurve = new THREE.CatmullRomCurve3(routePoints, true, "centripetal", 0.55);
    }
    const loopLength = loopCurve.getLength();
    // Keep ambient carriers and the signal pulse at the same visual speed on the longer mobile loop.
    const travelScale = compact ? 36.3 / loopLength : 1;
    const orderFraction = (value: number) => {
      const stage = THREE.MathUtils.clamp(value, 0, stages.length);
      if (!stationFractions) return stage / stages.length;
      const index = Math.min(stages.length - 1, Math.floor(stage));
      return THREE.MathUtils.lerp(stationFractions[index], stationFractions[index + 1], stage - index);
    };

    // Physical rail is ONE closed loop. Rollers and rails are generated from
    // the same curve so there are no visible breaks between stages.
    const samples = Math.ceil(loopLength / 0.22);
    const rollers = new THREE.InstancedMesh(cylinderShape, steel, samples + 1);
    platform.add(rollers);
    const rollerTransform = new THREE.Object3D();
    for (let n = 0; n <= samples; n++) {
      const t = n / samples;
      const point = loopCurve.getPointAt(t);
      const tangent = loopCurve.getTangentAt(t).normalize();
      rollerTransform.position.copy(point);
      rollerTransform.scale.set(0.052, 0.78, 0.052);
      rollerTransform.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      );
      rollerTransform.updateMatrix();
      rollers.setMatrixAt(n, rollerTransform.matrix);
    }
    rollers.instanceMatrix.needsUpdate = true;

    for (const side of [-1, 1]) {
      const railSteps = compact ? Math.ceil(loopLength / 0.25) : 120;
      const railPoints = Array.from({ length: railSteps + 1 }, (_, n) => {
        const t = n / railSteps;
        const point = loopCurve.getPointAt(t);
        const tangent = loopCurve.getTangentAt(t).normalize();
        return point.clone().add(
          new THREE.Vector3(-tangent.z * side * 0.43, 0.045, tangent.x * side * 0.43)
        );
      });
      const railCurve = new THREE.CatmullRomCurve3(railPoints, true, "centripetal", 0.55);
      platform.add(
        new THREE.Mesh(
          geometry(new THREE.TubeGeometry(railCurve, compact ? railSteps * 2 : 180, 0.045, 6, true)),
          charcoal
        )
      );
    }

    const signal = material(0xa56c43);
    signal.emissive.set(0xf78239);
    signal.emissiveIntensity = 0.15;
    platform.add(
      new THREE.Mesh(
        geometry(new THREE.TubeGeometry(loopCurve, compact ? Math.ceil(loopLength / 0.12) : 220, 0.038, 5, true)),
        signal
      )
    );

    // Subtle directional chevrons repeat around the complete loop.
    const arrowGeometry = geometry(new THREE.ConeGeometry(0.12, 0.32, 3));
    const chevrons = compact ? Math.round(loopLength / 4.4) : 14;
    for (let i = 0; i < chevrons; i++) {
      const t = i / chevrons;
      const point = loopCurve.getPointAt(t);
      const tangent = loopCurve.getTangentAt(t).normalize();
      const arrow = new THREE.Mesh(arrowGeometry, orange);
      arrow.position.copy(point);
      arrow.position.y += 0.2;
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      platform.add(arrow);
    }

    const artifact = new THREE.Group(); platform.add(artifact);
    box(artifact, [0.82, 0.11, 0.75], [0, -0.25, 0], glow);
    box(artifact, [0.68, 0.92, 0.1], [0, 0.23, 0], ivory);
    box(artifact, [0.52, 0.12, 0.025], [0, 0.51, 0.064], orange);
    const buildLayers = new THREE.Group(); artifact.add(buildLayers);
    for (let row = 0; row < 3; row++) box(buildLayers, [0.48, 0.055, 0.02], [0, 0.31 - row * 0.14, 0.066], steel, false);
    // The original concept document becomes a working interface on the same carrier.
    const interfaceLayers = new THREE.Group(); artifact.add(interfaceLayers);
    box(interfaceLayers, [0.12, 0.43, 0.02], [-0.18, 0.19, 0.066], orange, false);
    box(interfaceLayers, [0.31, 0.19, 0.02], [0.08, 0.31, 0.066], screen, false);
    for (let column = 0; column < 2; column++) box(interfaceLayers, [0.135, 0.17, 0.02], [column * 0.17, 0.08, 0.066], steel, false);
    const pulse = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.085, 10, 8)), glow); platform.add(pulse);
    // Ambient mode uses several small transport trays; the guided order reserves
    // the single product artifact above as its only moving product.
    const carrierGeometry = geometry(new THREE.BoxGeometry(0.72, 0.14, 0.54));
    const ambientCarriers = Array.from({ length: 4 }, (_, index) => {
      const carrier = new THREE.Group(); platform.add(carrier);
      const tray = new THREE.Mesh(carrierGeometry, index % 2 ? steel : charcoal); carrier.add(tray);
      box(carrier, [0.42, 0.5, 0.055], [0, 0.32, 0], ivory);
      box(carrier, [0.3, 0.075, 0.025], [0, 0.45, 0.04], orange, false);
      carrier.userData.routeOffset = index / 4;
      return carrier;
    });
    liveProduct.visible = true;
    productModule.visible = true;
    artifact.visible = false;
    // The alpha canvas reveals the dark glass surface beneath the whole line.

    function schedule() {
      if (!disposed && !contextLost && visible && !document.hidden && !frame) frame = requestAnimationFrame(render);
    }
    function syncControls() {
      orbit.enableRotate = mode !== "order" && !compact;
      orbit.enableZoom = mode !== "order";
      orbit.autoRotate = mode === "assembled" && view === "overview" && selected === null && !compact;
      orbit.autoRotateSpeed = 0.22;
      const polar = view === "top" ? Math.PI * 0.12 : Math.PI * 0.38;
      orbit.minPolarAngle = polar;
      orbit.maxPolarAngle = polar;
    }

    function cameraDestination() {
      if (mode === "order" && !returning) {
        targetGoal.copy(artifact.position).add(new THREE.Vector3(0, 1.0, 0));
        const tangent = orderCurve.getTangentAt(Math.min(0.999, Math.max(0, orderFraction(progress)))).normalize();
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        cameraGoal
          .copy(targetGoal)
          .addScaledVector(tangent, -7.2)
          .addScaledVector(side, compact ? 1.2 : 2.4)
          .add(new THREE.Vector3(0, compact ? 5.8 : 4.0, 0));
      } else if (selected !== null) {
        targetGoal.copy(stations[selected].position).add(new THREE.Vector3(0, 1.3, 0.2));
        cameraGoal.copy(targetGoal).add(new THREE.Vector3(compact ? 3.2 : 5.4, compact ? 7.8 : 6.2, compact ? 9.8 : 8.4));
      } else {
        targetGoal.set(0, 0.7, compact ? 0.6 : 0.3);
        const distance = Math.max(compact ? 35.5 : 24, (compact ? 12.3 : 23) / Math.max(camera.aspect, 0.3) + 5);
        const direction = view === "top"
          ? new THREE.Vector3(0, 1, 0.02)
          : new THREE.Vector3(compact ? 0 : 0.15, 0.88, 1.08).normalize();
        cameraGoal.copy(targetGoal).addScaledVector(direction, distance);
      }
      syncControls();
      orbit.enableDamping = false;
      orbit.update();
      orbit.enableDamping = !reduced;
      cameraMoving = !(mode === "assembled" && selected === null && view === "overview");
      if (reduced) {
        camera.position.copy(cameraGoal);
        orbit.target.copy(targetGoal);
        cameraMoving = false;
      }
      schedule();
    }

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height; camera.updateProjectionMatrix();
      surface.setSize(width, height, false); cameraDestination();
    };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); cleanup.push(() => resizeObserver.disconnect());
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; } else schedule();
    }, { rootMargin: "120px" });
    visibilityObserver.observe(host); cleanup.push(() => visibilityObserver.disconnect());
    const visibilityChange = () => { previousTime = 0; if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule(); };
    document.addEventListener("visibilitychange", visibilityChange); cleanup.push(() => document.removeEventListener("visibilitychange", visibilityChange));
    const motionChange = () => {
      reduced = media.matches; orbit.enableDamping = !reduced;
      if (reduced && mode === "order") { playing = false; artifactState = "idle"; options.onPlayingChange(false); }
      cameraDestination(); schedule();
    };
    media.addEventListener("change", motionChange); cleanup.push(() => media.removeEventListener("change", motionChange));
    const contextFailure = (event: Event) => {
      event.preventDefault(); contextLost = true; playing = false; artifactState = "idle"; cancelAnimationFrame(frame); frame = 0;
      options.onPlayingChange(false); options.onFailure();
    };
    surface.domElement.addEventListener("webglcontextlost", contextFailure);
    cleanup.push(() => surface.domElement.removeEventListener("webglcontextlost", contextFailure));
    orbit.addEventListener("change", schedule);
    cleanup.push(() => orbit.removeEventListener("change", schedule));
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const down = new THREE.Vector2();
    let pressed = false;
    const pick = (event: PointerEvent) => {
      const bounds = surface.domElement.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(stations.map(station => station.group), true)[0];
      let candidate: THREE.Object3D | null = hit?.object ?? null;
      while (candidate) {
        const index: unknown = candidate.userData.stageIndex;
        if (typeof index === "number") return index;
        candidate = candidate.parent;
      }
      return null;
    };
    const hover = (index: number | null) => {
      if (mode !== "stations") index = null;
      if (index === hovered) return;
      hovered = index; surface.domElement.style.cursor = index !== null ? "pointer" : compact ? "default" : "grab";
      options.onHover(index); schedule();
    };
    const pointerMove = (event: PointerEvent) => { if (!pressed && event.pointerType !== "touch") hover(pick(event)); };
    const pointerLeave = () => { hover(null); pressed = false; };
    const pointerDown = (event: PointerEvent) => { down.set(event.clientX, event.clientY); pressed = true; hover(null); };
    const pointerUp = (event: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      if (down.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 7) return;
      const index = pick(event); if (index !== null && mode !== "order") options.onSelect(index);
    };
    surface.domElement.addEventListener("pointermove", pointerMove);
    surface.domElement.addEventListener("pointerleave", pointerLeave);
    surface.domElement.addEventListener("pointerdown", pointerDown);
    surface.domElement.addEventListener("pointerup", pointerUp);
    surface.domElement.addEventListener("pointercancel", pointerLeave);
    cleanup.push(() => {
      surface.domElement.removeEventListener("pointermove", pointerMove);
      surface.domElement.removeEventListener("pointerleave", pointerLeave);
      surface.domElement.removeEventListener("pointerdown", pointerDown);
      surface.domElement.removeEventListener("pointerup", pointerUp);
      surface.domElement.removeEventListener("pointercancel", pointerLeave);
    });

    const journeyDuration = 24;
    const returnDuration = 2.8;

    function render(time: number) {
      frame = 0;
      if (disposed || contextLost || !visible || document.hidden) return;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.045) : 0;
      previousTime = time;
      elapsed += delta * (reduced ? 0.12 : 1);

      if (mode === "order" && playing && !reduced) {
        artifactState = "moving";
        journeyTime += delta;

        const journeyProgress = THREE.MathUtils.clamp(journeyTime / journeyDuration, 0, 1);
        progress = journeyProgress * stages.length;

        const nextActive = Math.min(stages.length - 1, Math.floor(Math.min(progress, stages.length - 0.001)));
        if (active !== nextActive) {
          active = nextActive;
          options.onProgress(active, false);
        }

        const orderT = orderFraction(progress);
        const point = orderCurve.getPointAt(orderT);
        const tangent = orderCurve.getTangentAt(Math.min(0.999, Math.max(0, orderT))).normalize();

        artifact.position.copy(point);
        artifact.position.y += 0.48 + Math.sin(elapsed * 2.0) * 0.035;
        artifact.rotation.y = Math.atan2(tangent.x, tangent.z);

        targetGoal.copy(artifact.position).add(new THREE.Vector3(0, compact ? 0.75 : 1.0, 0));
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        cameraGoal
          .copy(targetGoal)
          .addScaledVector(tangent, compact ? -5.6 : -7.2)
          .addScaledVector(side, compact ? 0.8 : 2.4)
          .add(new THREE.Vector3(0, compact ? 5.6 : 4.0, 0));
        cameraMoving = true;

        if (journeyProgress >= 1 && !completed) {
          completed = true;
          artifactState = "completed";
          progress = stages.length;
          liveProduct.visible = true;
          options.onProgress(stages.length - 1, true);
        }

        if (completed && journeyTime >= journeyDuration + 1.4 && !returning) {
          returning = true;
          cameraMoving = true;
          targetGoal.set(0, 0.7, compact ? 0.6 : 0.3);
          cameraGoal.copy(targetGoal).add(
            (view === "top"
              ? new THREE.Vector3(0, compact ? 35.5 : 24, 0.02)
              : new THREE.Vector3(compact ? 0 : 0.15, 0.88, 1.08).normalize().multiplyScalar(Math.max(compact ? 35.5 : 24, (compact ? 12.3 : 23) / Math.max(camera.aspect, 0.3) + 5)))
          );
          syncControls();
        }

        if (returning && journeyTime >= journeyDuration + 1.4 + returnDuration) {
          playing = false;
          returning = false;
          artifactState = "completed";
          active = -1;
          options.onPlayingChange(false);
          cameraMoving = false;
        }
      }

      // Continuous ambient circuit: multiple carriers, the signal pulse, and
      // every station mechanism stay alive in ASSEMBLED and STATIONS.
      const ambientActive = mode === "assembled" || mode === "stations";
      const ambientTravel = (elapsed * 0.028 * travelScale) % 1;
      if (ambientActive) {
        ambientCarriers.forEach(carrier => {
          const t = (ambientTravel + carrier.userData.routeOffset) % 1;
          const point = loopCurve.getPointAt(t);
          const tangent = loopCurve.getTangentAt(t).normalize();
          carrier.position.copy(point);
          carrier.position.y += 0.12;
          carrier.rotation.y = Math.atan2(tangent.x, tangent.z);
        });
      }

      artifact.visible = mode === "order";
      ambientCarriers.forEach(carrier => { carrier.visible = ambientActive; });

      if (mode === "order") {
        const orderT = orderFraction(progress);
        const point = orderCurve.getPointAt(orderT);
        const tangent = orderCurve.getTangentAt(Math.min(0.999, Math.max(0, orderT))).normalize();
        artifact.position.copy(point);
        artifact.position.y += 0.48 + Math.sin(elapsed * 2.0) * 0.035;
        artifact.rotation.y = Math.atan2(tangent.x, tangent.z);

        if (!reduced && playing && !returning) {
          targetGoal.copy(artifact.position).add(new THREE.Vector3(0, compact ? 0.75 : 1.0, 0));
          const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
          cameraGoal.copy(targetGoal)
            .addScaledVector(tangent, compact ? -5.6 : -7.2)
            .addScaledVector(side, compact ? 0.8 : 2.4)
            .add(new THREE.Vector3(0, compact ? 5.6 : 4.0, 0));
          cameraMoving = true;
        }

        buildLayers.scale.y = 0.25 + Math.min(1, progress / (stages.length - 1)) * 0.75;
        buildLayers.visible = progress < 2.8;
        interfaceLayers.visible = !buildLayers.visible;

        const revealStart = journeyDuration;
        const reveal = completed
          ? THREE.MathUtils.smoothstep((journeyTime - revealStart) / 1.2, 0, 1)
          : 0;
        if (completed) {
          liveProduct.visible = true;
          liveProduct.position.y = reveal * 0.5;
          liveProduct.scale.setScalar(0.86 + reveal * 0.16);
          if (liveBadge) liveBadge.material.opacity = reveal;
        } else {
          liveProduct.visible = false;
          liveProduct.position.y = 0;
          liveProduct.scale.setScalar(0.88);
          if (liveBadge) liveBadge.material.opacity = 0;
        }
      }

      // Station labels are only exposed in STATIONS, or for the active order step.
      stations.forEach((station, index) => {
        const stageState: StageState = mode === "order"
          ? completed || index < active ? "completed" : index === active ? "active" : "upcoming"
          : "upcoming";
        const focused = index === selected || (mode === "order" && index === active);
        const isHovered = mode === "stations" && index === hovered;

        station.group.userData.stageState = stageState;
        station.group.userData.mode = mode;
        station.group.userData.artifactState = mode === "order" ? artifactState : "idle";

        const ambientLight = ambientActive ? 0.22 + (Math.sin(elapsed * 2.2 + index * 1.7) + 1) * 0.17 : 0.035;
        station.signal.emissiveIntensity = mode === "order"
          ? stageState === "active" ? 1.2 : stageState === "completed" ? 0.55 : 0.045
          : isHovered ? 1.15 : ambientLight;
        station.housing.emissive.setHex(0xa34e22);
        station.housing.emissiveIntensity = focused ? 0.2 : isHovered ? 0.12 : 0;
        station.housing.color.setHex(
          mode === "stations" && hovered !== null && hovered !== index
            ? 0x15191d
            : index === 3 ? 0x44352a : 0x252d32
        );

        const scale = focused || isHovered ? 1.035 : 1;
        station.group.scale.lerp(new THREE.Vector3(scale, scale, scale), reduced ? 0.035 : 0.09);

        if (station.label) {
          station.label.material.opacity =
            mode === "stations"
              ? hovered !== null && hovered !== index ? 0.45 : 1
              : mode === "order" && index === active ? 0.82 : 0;
        }

        station.rotor.rotation.y += delta * (reduced ? 0.04 : 0.35 + index * 0.055);
      });

      const pulseT = (elapsed * 0.105 * travelScale) % 1;
      pulse.visible = mode !== "order" || playing;
      pulse.position.copy(loopCurve.getPointAt(pulseT));
      pulse.position.y += 0.18;

      finishSignal.emissiveIntensity = completed
        ? 1.55
        : ambientActive ? 0.4 + (Math.sin(elapsed * 2.8) + 1) * 0.12
        : 0.04;

      if (finishLabel) {
        finishLabel.material.opacity =
          mode === "stations" ? 1 : mode === "order" && (active === stages.length - 1 || completed) ? 0.85 : 0;
      }
      if (shippedPlaque) shippedPlaque.material.opacity = mode === "order" ? (completed ? 1 : 0.35) : 0.72;

      if (mode !== "order") {
        liveProduct.visible = true;
        liveProduct.position.y = Math.sin(elapsed * 1.8) * 0.025;
        liveProduct.scale.setScalar(0.9 + Math.sin(elapsed * 1.6) * 0.015);
        if (liveBadge) liveBadge.material.opacity = 0;
      }

      if (cameraMoving) {
        const amount = reduced ? 1 : 1 - Math.exp(-delta * 3.2);
        camera.position.lerp(cameraGoal, amount);
        orbit.target.lerp(targetGoal, amount);
        if (camera.position.distanceToSquared(cameraGoal) < 0.001 && orbit.target.distanceToSquared(targetGoal) < 0.001) {
          cameraMoving = false;
        }
      }

      syncControls();
      orbit.update();
      surface.render(scene, camera);
      if (!reduced || cameraMoving || mode === "order" || ambientActive) {
        schedule();
      } else if (!reducedTimer) {
        reducedTimer = window.setTimeout(() => { reducedTimer = 0; schedule(); }, 120);
      }
    }

    resize();
    syncControls();
    camera.position.copy(cameraGoal);
    orbit.target.copy(targetGoal);
    cameraMoving = false;
    orbit.update();
    schedule();
    const startOrder = () => {
      mode = "order";
      selected = null;
      view = "overview";
      hovered = null;
      playing = !reduced;
      completed = false;
      returning = false;
      artifactState = reduced ? "idle" : "moving";
      journeyTime = 0;
      orderStep = 0;
      progress = 0;
      active = 0;
      liveProduct.visible = false;
      liveProduct.position.y = 0;
      liveProduct.scale.setScalar(0.88);
      if (liveBadge) liveBadge.material.opacity = 0;
      options.onHover(null);
      options.onProgress(0, false);
      options.onPlayingChange(playing);
      artifact.position.copy(orderCurve.getPointAt(0));
      artifact.position.y += 0.48;
      artifact.visible = true;
      syncControls();
      cameraDestination();
      schedule();
    };

    return {
      setMode(nextMode) {
        if (nextMode === "order") {
          startOrder();
          return;
        }

        mode = nextMode;
        playing = false;
        returning = false;
        selected = null;
        hovered = null;
        active = -1;
        progress = 0;
        completed = false;
        artifactState = "idle";
        journeyTime = 0;
        artifact.visible = false;
        liveProduct.visible = true;
        liveProduct.position.y = 0;
        liveProduct.scale.setScalar(0.9);
        if (liveBadge) liveBadge.material.opacity = 0;
        options.onProgress(-1, false);
        options.onHover(null);
        options.onPlayingChange(false);
        syncControls();
        cameraDestination();
        schedule();
      },

      select(index) {
        if (index < 0 || index >= stages.length) return;
        mode = "stations";
        playing = false;
        artifactState = "idle";
        selected = index;
        active = index;
        progress = index;
        completed = false;
        returning = false;
        liveProduct.visible = true;
        options.onProgress(index, false);
        options.onPlayingChange(false);
        syncControls();
        cameraDestination();
      },

      overview(nextView = "overview") {
        if (mode === "order") return;
        active = -1;
        options.onProgress(-1, false);
        selected = null;
        view = nextView;
        hovered = null;
        options.onHover(null);
        syncControls();
        cameraDestination();
      },

      play() {
        startOrder();
      },

      advanceOrder() {
        if (mode !== "order" || !reduced) return;
        if (completed) {
          startOrder();
          return;
        }

        orderStep = Math.min(stages.length, orderStep + 1);
        progress = orderStep;
        active = Math.min(stages.length - 1, orderStep);
        const point = orderCurve.getPointAt(Math.min(1, orderFraction(orderStep)));
        artifact.position.copy(point);
        artifact.position.y += 0.48;
        artifact.visible = true;
        liveProduct.visible = orderStep === stages.length;

        if (orderStep === stages.length) {
          completed = true;
          artifactState = "completed";
          options.onProgress(stages.length - 1, true);
        } else {
          options.onProgress(active, false);
        }

        schedule();
      },
      dispose,
    };
  } catch (error) { dispose(); throw error; }

}
