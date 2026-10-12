"use client";

import * as React from "react";

export interface CertificateWheelItem {
  title: string;
  image: string;
  href?: string;
}

export interface CertificatesWheelProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items: readonly CertificateWheelItem[];
  label?: string;
  description?: string;
  action?: string;
}

// The reference's single turn coordinate: 0 = ring, 1 = first card on the
// drum, each subsequent integer brings the next certificate to the front.
const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const CULL = 1.6;
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => deg * Math.PI / 180;
const bowAt = (deg: number, bow: number) => -bow * (1 - Math.cos(rad(deg)));

function place(ringDeg: number, drumDeg: number, ringR: number, drumR: number, bow: number, m: number) {
  return `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`;
}

export default function CertificatesWheel({ items, label = "Certificates", description = "A record of learning, one milestone at a time.", action = "Verify", className, ...props }: CertificatesWheelProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const pointer = React.useRef({ x: 50, y: 50, inside: false });
  const light = React.useRef({ time: 0, beam: 58, x: 50, y: 50, glow: 0 });
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const settling = React.useRef(0);
  const drag = React.useRef<{ y: number; startY: number; moved: boolean } | null>(null);
  const suppressClick = React.useRef(false);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState({ w: 0, h: 0 });
  const [reduced, setReduced] = React.useState(false);
  const id = React.useId();
  const count = items.length;
  const last = Math.max(count - 1, 0);
  const end = count ? last + 1 : 0;

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const compact = w < 700;
    // Keep a readable front face on narrow stages; only the resting ring's
    // radius is width-limited. Drum, bow and lens still scale with card height.
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * (compact ? 0.84 : CARD_MAX_W));
    const cardH = cardW / CARD_RATIO;
    const ringR = compact ? Math.min(cardH * RING_R, w * 0.31) : cardH * RING_R;
    return {
      cardW, cardH, ringR,
      ringScale: count ? clamp(((2 * Math.PI * ringR / count) * 0.82) / (cardW || 1), 0.16, 1) : 1,
      drumR: cardH * DRUM, bow: cardH * BOW, depth: cardH * LENS,
      title: Math.max(18, cardH * 0.124),
    };
  }, [stage, count]);

  React.useEffect(() => {
    target.current = clamp(target.current, 0, end);
    turn.current = clamp(turn.current, 0, end);
    setActive(prev => Math.min(prev, last));
    cardRefs.current.length = count;
  }, [count, end, last]);

  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;
    let previous = 0;
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      // The reference backdrop shares the wheel's frame loop. Its drift and
      // pointer easing are time-based, independent of certificate position.
      const dt = previous ? Math.min((now - previous) / 1000, 0.1) : 1 / 60;
      previous = now;
      const p = pointer.current;
      const l = light.current;
      if (!reduced) l.time += dt;
      const idle = 58 + 9 * (0.7 * Math.sin(l.time * 0.21) + 0.3 * Math.sin(l.time * 0.077 + 1.3));
      const approach = (from: number, to: number, k: number) => to + (from - to) * Math.pow(1 - k, dt * 60);
      l.beam = reduced ? 58 : approach(l.beam, p.inside ? (30 + 52 * p.x / 100) * 0.75 + idle * 0.25 : idle, 0.035);
      l.x = reduced ? 50 : approach(l.x, p.x, 0.16);
      l.y = reduced ? 50 : approach(l.y, p.y, 0.16);
      l.glow = reduced ? 0 : approach(l.glow, p.inside ? 1 : 0, 0.06);
      const backdrop = backdropRef.current;
      if (backdrop) {
        backdrop.style.setProperty("--cw-beam", `${l.beam}%`);
        backdrop.style.setProperty("--cw-px", `${l.x}%`);
        backdrop.style.setProperty("--cw-py", `${l.y}%`);
        backdrop.style.setProperty("--cw-glow", String(l.glow));
      }
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);
      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);
      if (wheelRef.current) wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const card = cardRefs.current[i];
        if (!card) continue;
        const culled = m > 0.5 && Math.abs(d) > CULL;
        card.style.transform = place(d * (360 / count), d * STEP, ringR, drumR, bow, m);
        card.style.opacity = culled ? "0" : "1";
        card.style.visibility = culled ? "hidden" : "visible";
        card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        const face = card.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }
      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(m);
        titleRef.current.inert = m < 0.5;
        titleRef.current.style.translate = `${(1 - m) * -12}px 0`;
      }
      const near = clamp(Math.round(pos), 0, last);
      setActive(prev => prev === near ? prev : near);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback((next: number) => {
    target.current = clamp(next, 0, end);
  }, [end]);
  const navigate = (next: number) => {
    window.clearTimeout(settling.current);
    to(next);
  };

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      // Preserve browser zoom; every ordinary wheel gesture inside this box
      // belongs to the certificates, even at either end or over a control.
      if (event.ctrlKey) return;
      event.preventDefault();
      if (!event.deltaY) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.h : 1);
      to(target.current + delta / WHEEL_UNITS);
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(() => to(Math.round(target.current)), SETTLE);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, stage.h]);

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    suppressClick.current = drag.current.moved;
    drag.current = null;
    to(Math.round(target.current));
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section ref={rootRef} className={["certificates-wheel", className].filter(Boolean).join(" ")} aria-label={label} {...props}
      onPointerMove={event => {
        const box = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: clamp((event.clientX - box.left) / (box.width || 1) * 100, 0, 100), y: clamp((event.clientY - box.top) / (box.height || 1) * 100, 0, 100), inside: true };
        props.onPointerMove?.(event);
      }}
      onPointerLeave={event => {
        pointer.current.inside = false;
        props.onPointerLeave?.(event);
      }}>
      <div ref={backdropRef} className="certificates-wheel-backdrop" aria-hidden="true">
        <div className="certificates-wheel-wash" />
        <div className="certificates-wheel-bands" />
        <div className="certificates-wheel-beam" />
        <div className="certificates-wheel-glow" />
        <div className="certificates-wheel-grain" />
      </div>
      <p id={`${id}-help`} className="certificates-wheel-help">Scroll or drag to explore · ↑ ↓ to navigate<span>Move outside this frame to scroll the page</span></p>
      <div
        ref={stageRef}
        className="certificates-wheel-stage"
        tabIndex={count ? 0 : -1}
        role="group"
        aria-label={label}
        aria-describedby={`${id}-help${description ? ` ${id}-description` : ""}`}
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          window.clearTimeout(settling.current);
          suppressClick.current = false;
          drag.current = { y: event.clientY, startY: event.clientY, moved: false };
        }}
        onPointerMove={event => {
          const current = drag.current;
          if (!current) return;
          if (!event.currentTarget.hasPointerCapture(event.pointerId) && Math.abs(event.clientY - current.startY) > 6) event.currentTarget.setPointerCapture(event.pointerId);
          const delta = current.y - event.clientY;
          if (Math.abs(event.clientY - current.startY) > 6) current.moved = true;
          const next = clamp(target.current + delta / DRAG_UNITS, 0, end);
          to(next);
          current.y = event.clientY;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onClickCapture={event => {
          if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
        }}
        onKeyDown={event => {
          let next: number;
          if (event.key === "ArrowDown") next = Math.round(target.current) + 1;
          else if (event.key === "ArrowUp") next = Math.round(target.current) - 1;
          else return;
          if (clamp(next, 0, end) === target.current) return;
          event.preventDefault();
          navigate(next);
        }}
      >
        <div ref={wheelRef} className="certificates-wheel-rotor">
          {items.map((item, i) => (
            <div key={`${item.title}-${i}`} id={`${id}-item-${i}`} role="group" aria-label={item.title} aria-current={i === active ? "true" : undefined}
              ref={node => { cardRefs.current[i] = node; }} className="certificates-wheel-card"
              style={{ width: metrics.cardW, height: metrics.cardH, marginLeft: -metrics.cardW / 2, marginTop: -metrics.cardH / 2 }}>
              <span className="certificates-wheel-face">
                <img src={item.image} alt={`${item.title} certificate`} draggable={false} decoding="async" />
                {item.href && <a className="certificates-wheel-card-link" href={item.href} target="_blank" rel="noopener noreferrer" draggable={false}
                  tabIndex={i === active ? 0 : -1} aria-label={`${action || "Verify"} ${item.title} certificate (opens in a new tab)`}>
                  {action && <span className="certificates-wheel-affordance">{action} <span aria-hidden="true">↗</span></span>}
                </a>}
              </span>
            </div>
          ))}
        </div>
      </div>
      {description && <p id={`${id}-description`} className="certificates-wheel-sr-only">{description}</p>}
      <div ref={labelRef} className="certificates-wheel-label" style={{ fontSize: metrics.title }} aria-hidden="true">
        <span>{label}</span>
        {description && <p className="certificates-wheel-description">{description}</p>}
      </div>
      <div ref={titleRef} className="certificates-wheel-title" style={{ fontSize: metrics.title }}>
        <span className="certificates-wheel-number">{count ? `${String(active + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}` : ""}</span>
        <span aria-live="polite" aria-atomic="true">{items[active]?.title}</span>
        {items[active]?.href && <a className="certificates-wheel-verify" href={items[active].href} target="_blank" rel="noopener noreferrer"
          aria-label={`${action || "Verify"} ${items[active].title} certificate (opens in a new tab)`}>{action || "Verify"} <span aria-hidden="true">↗</span></a>}
      </div>
      <ol className="certificates-wheel-index" aria-label="Choose a certificate">
        {items.map((item, i) => <li key={`${item.title}-${i}`}><button type="button" onClick={() => navigate(i + 1)} aria-current={i === active ? "true" : undefined}>
          <span className="certificates-wheel-index-number">{String(i + 1).padStart(2, "0")}</span><span>{item.title}</span>
        </button></li>)}
      </ol>
    </section>
  );
}
