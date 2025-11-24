import { useEffect, useState } from 'react';

/**
 * Custom hook for parallax scrolling effect
 * @param {number} speed - Parallax speed multiplier (default: 0.5)
 * @returns {number} - Current scroll offset adjusted by speed
 */
export const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset * speed);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return offset;
};

export default useParallax;
