import { useRef, useEffect, useState } from "react";

export default function useHoverIntent({
  initialDelay = 400,
  fastDelay = 0,
  resetAfter = 500,
} = {}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastShownRef = useRef<number>(0);
  const lastMouseLeaveRef = useRef<number>(0)
  const [currentDelayType, setCurrentDelayType] = useState<"initial" | "fast">("initial");

  const start = ({ cb, isTooltipOpened }: { cb: () => void, isTooltipOpened:boolean }) => {
    const now = Date.now();
    const timeSinceLast = now - lastMouseLeaveRef.current;

    if(timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    if(timeoutEndRef.current !== null) clearTimeout(timeoutEndRef.current);
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
    if(timeoutRef.current !== null) clearTimeout(timeoutRef.current);
  };

  const end = (cb: () => void ) => {
    const now = Date.now();
    lastMouseLeaveRef.current = now
    const timeSinceLast = now - lastShownRef.current;

    if(timeoutRef.current !== null) clearTimeout(timeoutRef.current);

    const delay = timeSinceLast < resetAfter ? 100 : 0;

    timeoutEndRef.current = setTimeout(() => {
      cb();
    }, delay);
  };

  useEffect(() => {
    return () => { if(timeoutRef.current !== null) clearTimeout(timeoutRef.current); }
  }, []);

  return { start, cancel, end, currentDelayType };
}
