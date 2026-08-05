import { useState, useEffect, useRef } from "react";

interface loadingDelayOptions {
  delay?: number,
  minDisplayTime?: number
}

export default function useLoadingDelay(loading: boolean, options: loadingDelayOptions = {}) {
  const {
    delay = 300, // ms antes de mostrar
    minDisplayTime = 1500, // ms mínimo una vez mostrado
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
