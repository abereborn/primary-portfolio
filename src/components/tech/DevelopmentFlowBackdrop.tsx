import { useEffect, useState } from "react";

type Props = {
  phrases: readonly string[];
  /** Reduced motion: show the first phrase without typing or cycling. */
  still: boolean;
};

const TYPE_MS = 62;
const ERASE_MS = 28;
const HOLD_MS = 2200;
const GAP_MS = 380;

/** Decorative typewriter text that sits behind the (transparent) 3D canvas. */
export default function DevelopmentFlowBackdrop({ phrases, still }: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typed, setTyped] = useState(still ? phrases[0].length : 0);

  useEffect(() => {
    if (still) { setPhraseIndex(0); setTyped(phrases[0].length); return; }
    let timer = 0;
    let index = 0;
    let count = 0;
    const type = () => {
      count += 1; setTyped(count);
      if (count < phrases[index].length) timer = window.setTimeout(type, TYPE_MS);
      else timer = window.setTimeout(erase, HOLD_MS);
    };
    const erase = () => {
      count -= 1; setTyped(count);
      if (count > 0) timer = window.setTimeout(erase, ERASE_MS);
      else {
        index = (index + 1) % phrases.length; setPhraseIndex(index);
        timer = window.setTimeout(type, GAP_MS);
      }
    };
    setPhraseIndex(0); setTyped(0);
    timer = window.setTimeout(type, 500);
    return () => window.clearTimeout(timer);
  }, [phrases, still]);

  const phrase = phrases[phraseIndex];
  return (
    <div className="development-flow__backdrop" aria-hidden="true" data-still={still}>
      <span className="development-flow__backdrop-tag">
        <i />prototype.log — {String(phraseIndex + 1).padStart(2, "0")}/{String(phrases.length).padStart(2, "0")}
      </span>
      <p className="development-flow__backdrop-text">
        <span>{phrase.slice(0, typed)}</span><b className="development-flow__backdrop-caret" />
      </p>
      <div className="development-flow__backdrop-grid" />
    </div>
  );
}
