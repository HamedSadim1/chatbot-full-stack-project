import { useEffect, useRef, useState } from "react";

interface UseTypingEffectOptions {
  speed?: number;
  enabled?: boolean;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useTypingEffect = (
  text: string,
  { speed = 20, enabled = true }: UseTypingEffectOptions = {}
) => {
  const shouldAnimate = enabled && !prefersReducedMotion();
  const [displayedText, setDisplayedText] = useState(shouldAnimate ? "" : text);
  const indexRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!enabled || completedRef.current || indexRef.current >= text.length) {
      return;
    }

    const intervalId = setInterval(() => {
      indexRef.current += 1;
      setDisplayedText(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        completedRef.current = true;
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return displayedText;
};
