import { useEffect, useState } from 'react';

/**
 * Custom hook for animated counter effect
 * @param {number} end - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 * @param {boolean} isVisible - Whether to start animation
 * @returns {number} - Current count value
 */
export const useCountUp = (end, duration = 2000, isVisible = true) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        let animationFrame;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = progress * (2 - progress);
            setCount(Math.floor(easeOutQuad * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [end, duration, isVisible]);

    return count;
};

export default useCountUp;
