import { useRef, useEffect, useState } from "react";

export default function useHoverIntent({
  initialDelay = 400,
  fastDelay = 0,
  resetAfter = 500,
} = {}) {
  const timeoutRef = useRef(null);
  const timeoutEndRef = useRef(null);
  const lastShownRef = useRef(0);
  const lastMouseLeaveRef = useRef(0)
  const [currentDelayType, setCurrentDelayType] = useState("initial");

  const start = ({ cb, isTooltipOpened }) => {
    const now = Date.now();
    const timeSinceLast = now - lastMouseLeaveRef.current;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    clearTimeout(timeoutEndRef.current);
    timeoutEndRef.current = null;

    const delay =
      timeSinceLast < resetAfter
        ? fastDelay
          : initialDelay;

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
    lastMouseLeaveRef.current = now
    const timeSinceLast = now - lastShownRef.current;

    clearTimeout(timeoutRef.current);

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
