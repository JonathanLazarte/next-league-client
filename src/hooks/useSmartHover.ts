import { useEffect, useRef } from "react";

interface UseSmartHoverProps {
  ref: React.RefObject<HTMLDivElement>,
  onEnter: () => void,
  onLeave: () => void,
  enabled: boolean
}

export function useSmartHover({ ref, onEnter, onLeave, enabled = true }: UseSmartHoverProps) {
  const hoveredRef = useRef<boolean>(false);
  const mouseRef = useRef<Record<string, number>>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const onEnterRef = useRef<() => void>(onEnter);
  const onLeaveRef = useRef<() => void>(onLeave);

  // Mantener las funciones actualizadas sin causar re-renders
  useEffect(() => {
    onEnterRef.current = onEnter;
    onLeaveRef.current = onLeave;
  }, [onEnter, onLeave]);

  // Track mouse globally
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
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
