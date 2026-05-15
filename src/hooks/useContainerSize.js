import { useState, useEffect } from 'react';

export function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      // requestAnimationFrame evita el error "loop limit exceeded"
      window.requestAnimationFrame(() => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });
    });

    observer.observe(element);

    // Medida inicial (por si el observer tarda)
    const { width, height } = element.getBoundingClientRect();
    setSize({ width, height });

    return () => observer.disconnect();
  }, [ref]); // ← importante: ref es estable, pero es buena práctica

  return size;
}