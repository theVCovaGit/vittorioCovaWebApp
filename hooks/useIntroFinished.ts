"use client";

import { useEffect, useState } from "react";

export const INTRO_FINISHED_EVENT = "intro-finished";

/** False while the signature intro is on screen, true once it is gone. */
export function useIntroFinished() {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const introIsRunning = () =>
      document.querySelector('[data-intro-animation="true"]') !== null;

    if (!introIsRunning()) {
      setFinished(true);
      return;
    }

    const handleFinished = () => setFinished(true);
    window.addEventListener(INTRO_FINISHED_EVENT, handleFinished);

    // Fallback in case the event fires before this component mounts
    const observer = new MutationObserver(() => {
      if (!introIsRunning()) setFinished(true);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener(INTRO_FINISHED_EVENT, handleFinished);
      observer.disconnect();
    };
  }, []);

  return finished;
}
