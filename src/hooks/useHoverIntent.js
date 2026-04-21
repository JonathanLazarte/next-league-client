import { useRef, useEffect, useState } from "react";

export default function useHoverIntent({
  initialDelay = 500,
  fastDelay = 0,
  resetAfter = 700,
}) {
  const timeoutRef = useRef(null);
  const lastShownRef = useRef(0);
  const timeoutEndRef = useRef(null);
  const [currentDelayType, setCurrentDelayType] = useState("initial");

  const start = ({ cb, isTooltipOpened }) => {
    const now = Date.now();
    const timeSinceLast = now - lastShownRef.current;

    const delay =
      timeSinceLast < resetAfter
        ? fastDelay
        : isTooltipOpened
          ? fastDelay
          : initialDelay;

    clearTimeout(timeoutRef.current);
    clearTimeout(timeoutEndRef.current);

    timeoutRef.current = setTimeout(() => {
      lastShownRef.current = Date.now();
      cb();
    }, delay);

    const delayName =
      timeSinceLast < resetAfter
        ? "fast"
        : isTooltipOpened
          ? "fast"
          : "initial";
    setCurrentDelayType(delayName);
  };

  const cancel = () => {
    clearTimeout(timeoutRef.current);
  };

  const end = (cb) => {
    const now = Date.now();
    const timeSinceLast = now - lastShownRef.current;

    const delay = timeSinceLast < resetAfter ? 100 : 0;

    timeoutEndRef.current = setTimeout(() => {
      cb();
    }, 50 || delay);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { start, cancel, end, currentDelayType };
}
