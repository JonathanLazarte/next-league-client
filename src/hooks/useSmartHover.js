import { useEffect, useRef } from "react";

export function useSmartHover({ ref, onEnter, onLeave, enabled = true }) {
  const hoveredRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);

  // Mantener las funciones actualizadas sin causar re-renders
  useEffect(() => {
    onEnterRef.current = onEnter;
    onLeaveRef.current = onLeave;
  }, [onEnter, onLeave]);

  // Track mouse globally
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  // Frame loop - SIN onEnter/onLeave en dependencias
  useEffect(() => {
    if (!enabled) return;

    const loop = () => {
      if (!ref.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const { x, y } = mouseRef.current;

      const inside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (inside && !hoveredRef.current) {
        hoveredRef.current = true;
        onEnterRef.current?.();
      }

      if (!inside && hoveredRef.current) {
        hoveredRef.current = false;
        onLeaveRef.current?.();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, ref]); // Solo enabled y ref - NO onEnter/onLeave
}
