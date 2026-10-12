import { useEffect, useRef } from "react";
import type { DevelopmentStage } from "../../data/developmentFlow";

type Props = {
  stage: DevelopmentStage;
  onClose: () => void;
  onPrevious: (() => void) | undefined;
  onNext: (() => void) | undefined;
};

export default function DevelopmentFlowOverlay({ stage, onClose, onPrevious, onNext }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [stage.id]);

  return (
    <aside className="development-flow__overlay" aria-labelledby="development-stage-title"
      onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); onClose(); } }}>
      <div className="development-flow__overlay-top">
        <span>STEP {stage.eyebrow}</span>
        <button type="button" onClick={onClose} aria-label="Close stage details">Close ×</button>
      </div>
      <h3 ref={heading} tabIndex={-1} id="development-stage-title">{stage.name}</h3>
      <p className="development-flow__description">{stage.description}</p>
      <section><h4>Actions</h4><ul className="development-flow__actions">
        {stage.actions.map(action => <li key={action}>{action}</li>)}
      </ul></section>
      {stage.technologies.length > 0 && <section><h4>Technologies</h4>
        <ul className="development-flow__tags">{stage.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
      </section>}
      <section><h4>Tools</h4><ul className="development-flow__tags">
        {stage.primaryTools.map(tool => <li key={tool}>{tool}</li>)}
      </ul></section>
      <section className="development-flow__output"><h4>Output</h4><p>{stage.output}</p></section>
      <section><h4>Tagline</h4><p className="development-flow__tagline">{stage.tagline}</p></section>
      <div className="development-flow__overlay-nav">
        <button type="button" disabled={!onPrevious} onClick={onPrevious}>← Previous</button>
        <button type="button" disabled={!onNext} onClick={onNext}>Next →</button>
      </div>
    </aside>
  );
}
