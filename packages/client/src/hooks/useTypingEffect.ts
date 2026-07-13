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
  { speed = 12, enabled = true }: UseTypingEffectOptions = {}
) => {
  const shouldAnimate = enabled && !prefersReducedMotion();
  const [displayedText, setDisplayedText] = useState(shouldAnimate ? "" : text);
  const indexRef = useRef(0);
  const textRef = useRef(text);

  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    if (textRef.current !== text) {
      textRef.current = text;
      indexRef.current = 0;
    }

    if (indexRef.current >= text.length) {
      return;
    }

    const intervalId = setInterval(() => {
      indexRef.current += 1;
      setDisplayedText(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, shouldAnimate]);

  return displayedText;
};
