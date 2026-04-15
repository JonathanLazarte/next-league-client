import { useRef, useEffect } from 'react'

export default function useHoverIntent({
            initialDelay = 500,
            fastDelay = 0,
            resetAfter = 800 }) {

        const timeoutRef = useRef(null);
        const lastShownRef = useRef(0);
        const timeoutEndRef = useRef(null);

        const start = (cb) => {
            const now = Date.now();
            const timeSinceLast = now - lastShownRef.current;

            const delay =
                timeSinceLast < resetAfter
                    ? fastDelay
                    : initialDelay;

            clearTimeout(timeoutRef.current);
            clearTimeout(timeoutEndRef.current)

            timeoutRef.current = setTimeout(() => {
                lastShownRef.current = Date.now();
                cb();
            }, delay);
        };

        const cancel = () => {
            clearTimeout(timeoutRef.current);
        };

        const end = (cb) => {
            const now = Date.now();
            const timeSinceLast = now - lastShownRef.current;

            const delay =
                timeSinceLast < resetAfter
                    ? 0
                    : 50;

            timeoutEndRef.current = setTimeout(() => {
                cb()
            }, delay)
        }

        useEffect(() => {
            return () => clearTimeout(timeoutRef.current);
        }, []);

        return { start, cancel, end };
}