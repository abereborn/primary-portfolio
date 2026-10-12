import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "../../data/site";
import { AppleHelloEnglishEffect } from "../ui/apple-hello-effect";

function Intro({ onExited }: { onExited: () => void }) {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();
  const finished = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    holdTimer.current = setTimeout(() => {
      document.body.classList.add("ready");
      setVisible(false);
    }, reducedMotion ? 100 : 1100);
  }, [reducedMotion]);

  useEffect(() => {
    document.body.classList.remove("ready");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const content = Array.from(document.querySelectorAll<HTMLElement>("#pre ~ *"));
    const previousInert = content.map(element => element.inert);
    content.forEach(element => { element.inert = true; });
    const fallback = setTimeout(finish, reducedMotion ? 150 : 6500);
    return () => {
      clearTimeout(fallback);
      clearTimeout(holdTimer.current);
      finished.current = false;
      document.body.style.overflow = previousOverflow;
      document.body.classList.add("ready");
      content.forEach((element, index) => { element.inert = previousInert[index]; });
    };
  }, [finish]);

  return <AnimatePresence onExitComplete={onExited}>
    {visible && <motion.div id="pre" role="status" aria-label="Welcome. Loading portfolio."
      initial={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>
      <div className="pre-ambient" aria-hidden="true" />
      <div className="pre-grid" aria-hidden="true" />
      <div className="pre-composition">
        <motion.p className="pre-welcome"
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.25, duration: reducedMotion ? 0 : 0.7 }}>
          <span aria-hidden="true" /> Welcome to my space
        </motion.p>
        <AppleHelloEnglishEffect className="pre-hello" speed={1} onAnimationComplete={finish} />
        <motion.div className="pre-signature"
          initial={reducedMotion ? false : { opacity: 0, y: 12, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: reducedMotion ? 0 : 2.65, duration: reducedMotion ? 0 : 0.8 }}>
          <p>I’m <strong>{site.name}.</strong></p>
          <span className="pre-role">{site.role}</span>
        </motion.div>
      </div>
    </motion.div>}
  </AnimatePresence>;
}

export default function Preloader() {
  const [exited, setExited] = useState(false);
  return exited ? null : <Intro onExited={() => setExited(true)} />;
}
