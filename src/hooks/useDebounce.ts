import { useState, useEffect } from 'react';

export function useDebounce(value: number, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancels the timeout if the value changes before delay finishes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
