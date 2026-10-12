import { useCallback, useEffect, useRef, useState } from "react";
import { backdropPhrases, developmentFlow } from "../../data/developmentFlow";
import DevelopmentFlowBackdrop from "./DevelopmentFlowBackdrop";
import DevelopmentFlowOverlay from "./DevelopmentFlowOverlay";
import type { CameraView, DevelopmentMode, DevelopmentScene } from "./developmentScene";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

const modes: Array<{ id: DevelopmentMode; label: string; detail: string }> = [
  { id: "assembled", label: "Assembled", detail: "Machine running" },
  { id: "stations", label: "Stations", detail: "Explore the process" },
  { id: "order", label: "One Order", detail: "Follow one product" },
];

export default function DevelopmentFlow3D() {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<DevelopmentScene | null>(null);
  const stageButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const [mode, setMode] = useState<DevelopmentMode>("assembled");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [view, setView] = useState<CameraView>("overview");
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [retry, setRetry] = useState(0);
  const compact = useMediaQuery("(max-width: 620px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const selectStage = useCallback((index: number) => {
    setMode("stations");
    setSelectedIndex(index);
    setActiveIndex(index);
    setPlaying(false);
    setComplete(false);
    setHoveredIndex(null);
    scene.current?.select(index);
  }, []);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let cancelled = false;
    let instance: DevelopmentScene | null = null;
    setStatus("loading");
    setMode("assembled");
    setSelectedIndex(null);
    setHoveredIndex(null);
    setView("overview");
    setActiveIndex(-1);
    setComplete(false);
    setPlaying(false);
    // Three remains lazy-loaded; the other portfolio routes keep their current runtime.
    Promise.all([import("./developmentScene"), document.fonts.ready])
      .then(([module]) => {
        if (cancelled) return;
        instance = module.createDevelopmentScene(container, developmentFlow, {
          compact,
          onSelect: selectStage,
          onHover: setHoveredIndex,
          onProgress: (index, finished) => {
            setActiveIndex(index);
            setComplete(finished);
          },
          onPlayingChange: setPlaying,
          onFailure: () => setStatus("failed"),
        });
        scene.current = instance;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
      instance?.dispose();
      scene.current = null;
    };
  }, [compact, retry, selectStage]);

  const changeMode = (next: DevelopmentMode) => {
    setMode(next);
    setSelectedIndex(null);
    setHoveredIndex(null);
    setView("overview");
    setComplete(false);
    setPlaying(next === "order" && !reducedMotion);
    setActiveIndex(next === "order" ? 0 : -1);
    scene.current?.setMode(next);
  };
  const selectView = (next: CameraView) => {
    setSelectedIndex(null);
    setHoveredIndex(null);
    setView(next);
    scene.current?.overview(next);
  };
  const closeOverlay = () => {
    const previous = selectedIndex;
    setSelectedIndex(null);
    setActiveIndex(-1);
    setHoveredIndex(null);
    scene.current?.overview("overview");
    if (previous !== null) stageButtons.current[previous]?.focus({ preventScroll: true });
  };
  const runOrder = () => {
    if (reducedMotion && mode === "order") {
      if (complete) {
        scene.current?.play();
        setActiveIndex(0);
        setComplete(false);
      } else scene.current?.advanceOrder();
      return;
    }
    if (mode !== "order") changeMode("order");
    else scene.current?.play();
  };
  const selected = selectedIndex === null ? null : developmentFlow[selectedIndex];
  const modeCopy =
    mode === "order"
      ? complete
        ? "Product shipped · Live product"
        : activeIndex >= 0
          ? `${developmentFlow[activeIndex].eyebrow} / ${developmentFlow[activeIndex].name}`
          : "Follow one product through the line"
      : mode === "stations"
        ? "Select a station to explore how each stage works."
        : "All seven stations running · Continuous production";

  return (
    <section className="development-flow rv" data-mode={mode} aria-labelledby="development-flow-title">
      <header className="development-flow__heading">
        <div>
          <span className="development-flow__eyebrow">Process / {String(developmentFlow.length).padStart(2, "0")} stages</span>
          <h2 id="development-flow-title" className="disp">
            From Idea
            <br />
            <em>To Deployment.</em>
          </h2>
        </div>
        <p id="development-flow-hint">
          Follow the build. Explore a station.
          <br />
          See how the product comes together.
        </p>
      </header>

      <div className="development-flow__machine" data-status={status} data-mode={mode} data-focused={!!selected} data-playing={playing}>
        <div className="development-flow__toolbar" aria-label="Development flow controls">
          <nav className="development-flow__modes" aria-label="Machine mode">
            {modes.map((item) => (
              <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => changeMode(item.id)} title={item.detail}>
                {item.label}
              </button>
            ))}
          </nav>
          {mode !== "order" && (
            <div className="development-flow__views" aria-label="Camera view">
              <button type="button" aria-pressed={view === "overview" && !selected} onClick={() => selectView("overview")}>
                Overview
              </button>
              <button type="button" aria-pressed={view === "top" && !selected} onClick={() => selectView("top")}>
                Top view
              </button>
            </div>
          )}
          <button
            className="development-flow__play"
            type="button"
            disabled={status !== "ready"}
            onClick={runOrder}
            aria-label={reducedMotion && mode === "order" ? (complete ? "Replay One Order" : "Advance to next stage") : mode === "order" ? (complete ? "Replay One Order" : "Restart One Order") : "Run One Order"}
          >
            <span aria-hidden="true">{reducedMotion && mode === "order" && !complete ? "→" : "↗"}</span>
            {reducedMotion && mode === "order" ? (complete ? "Replay" : "Next stage") : mode === "order" ? (complete ? "Replay One Order" : "Restart One Order") : "Run One Order"}
          </button>
        </div>
        <div className="development-flow__viewport">
          <DevelopmentFlowBackdrop phrases={backdropPhrases} still={reducedMotion} />
          {!selected && status === "ready" && (
            <div className="development-flow__readout" aria-live="polite" data-live={complete}>
              <span>
                {complete ? "PRODUCT SHIPPED" : mode === "order" && activeIndex >= 0 ? `${developmentFlow[activeIndex].eyebrow} / ${developmentFlow[activeIndex].name}` : `PROCESS / ${String(developmentFlow.length).padStart(2, "0")} STAGES`}
              </span>
              <p>{complete ? developmentFlow[developmentFlow.length - 1].output : mode === "order" && activeIndex >= 0 ? developmentFlow[activeIndex].description : modeCopy}</p>
              <div className="development-flow__progress" aria-hidden="true">
                {developmentFlow.map((stage, i) => (
                  <i key={stage.id} data-lit={complete || i <= activeIndex} />
                ))}
              </div>
            </div>
          )}
          <div ref={host} className="development-flow__scene" role="img" aria-label="Interactive software development workflow from idea to deployment. Choose Assembled, Stations, or One Order." aria-describedby="development-flow-hint" />
          {status === "loading" && (
            <div className="development-flow__fallback" role="status">
              Preparing the development machine…
            </div>
          )}
          {status === "failed" && (
            <div className="development-flow__fallback" role="status">
              <p>The 3D preview is unavailable in this browser.</p>
              <p>Explore the complete workflow using the stage controls below.</p>
              <button type="button" onClick={() => setRetry((value) => value + 1)}>
                Retry 3D preview
              </button>
            </div>
          )}
          {selected && (
            <DevelopmentFlowOverlay
              stage={selected}
              onClose={closeOverlay}
              onPrevious={selectedIndex !== null && selectedIndex > 0 ? () => selectStage(selectedIndex - 1) : undefined}
              onNext={selectedIndex !== null && selectedIndex < developmentFlow.length - 1 ? () => selectStage(selectedIndex + 1) : undefined}
            />
          )}
          <div className="development-flow__caption" aria-hidden="true">
            <span>01 / INPUT</span>
            <span>{mode === "order" ? (reducedMotion ? "Advance with the journey control" : "One product · Guided journey") : compact ? "Tap a station to explore" : "Drag to rotate · Scroll to zoom"}</span>
            <span>07 / OUTPUT</span>
          </div>
        </div>
        <nav className="development-flow__steps" aria-label="Explore development stages">
          <ol>
            {developmentFlow.map((stage, index) => (
              <li key={stage.id}>
                <button
                  ref={(element) => {
                    stageButtons.current[index] = element;
                  }}
                  type="button"
                  aria-label={`Step ${stage.step}: ${stage.name}`}
                  aria-pressed={selectedIndex === index}
                  aria-current={activeIndex === index ? "step" : undefined}
                  data-completed={mode === "order" && (complete || activeIndex > index)}
                  onClick={() => selectStage(index)}
                >
                  <span>{stage.eyebrow}</span>
                  <strong>{stage.name}</strong>
                  <i aria-hidden="true">→</i>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="development-flow__status" role="status" aria-live="polite" aria-atomic="true">
          <span>
            <i aria-hidden="true" />
            {mode === "order"
              ? complete
                ? "Product shipped · Journey complete"
                : playing
                  ? `One Order · ${activeIndex >= 0 ? developmentFlow[activeIndex].name : "In progress"}`
                  : reducedMotion
                    ? "One Order · Advance one stage at a time"
                    : "One Order ready"
              : mode === "stations"
                ? selected
                  ? `Exploring · ${selected.name}`
                  : "Stations · Explore the process"
                : "Assembled · Machine running"}
          </span>
          <strong data-live={complete}>
            {complete ? developmentFlow[developmentFlow.length - 1].output : "7 STAGES / 1 SYSTEM"} <span aria-hidden="true">↗</span>
          </strong>
        </div>
      </div>
    </section>
  );
}
