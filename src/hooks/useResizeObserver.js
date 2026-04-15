'use client';
import { useEffect } from 'react';

export function useResizeObserver(ref, cb) {
  useEffect(() => {
    // La comprobación se hace DENTRO del efecto
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      // Usamos requestAnimationFrame para evitar el error: 
      // "ResizeObserver loop limit exceeded"
      window.requestAnimationFrame(() => {
        if (!entries.length) return;
        cb(entries[0].contentRect.width);
      });

    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, cb]); // Añadimos dependencias para que sea robusto
}