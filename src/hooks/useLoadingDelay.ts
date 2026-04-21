import { useState, useEffect, useRef } from "react";

export default function useLoadingDelay(loading: boolean, options = {}) {
  const {
    delay = 200, // ms antes de mostrar
    minDisplayTime = 500, // ms mínimo una vez mostrado
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (loading) {
      // Empezamos el retardo
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      // El fetch terminó
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isVisible) {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, minDisplayTime - elapsed);

        // Esperamos el tiempo restante para cumplir el mínimo
        setTimeout(() => {
          setIsVisible(false);
        }, remaining);
      } else {
        setIsVisible(false);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading, delay, minDisplayTime, isVisible]);

  return isVisible;
}
