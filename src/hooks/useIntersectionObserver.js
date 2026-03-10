import { useEffect } from 'react';

/**
 * Custom hook for Intersection Observer functionality
 * @param {string} selector - CSS selector for elements to observe
 * @param {Object} options - IntersectionObserver options
 * @param {Function} onIntersect - Optional callback function (entry, observer)
 * @param {boolean} staggered - Whether to include a staggered delay based on index
 */
const useIntersectionObserver = (selector, options = { threshold: 0.1 }, onIntersect = null, staggered = false) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    if (onIntersect) {
                        if (staggered) {
                            setTimeout(() => onIntersect(entry, observer), index * 100);
                        } else {
                            onIntersect(entry, observer);
                        }
                    } else {
                        // Default behavior: add 'show' or 'visible' class
                        entry.target.classList.add('show');
                        entry.target.classList.add('visible');
                    }

                    // Unobserve after showing (usually for reveals)
                    if (options.once !== false) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);

        elements.forEach(el => observer.observe(el));

        return () => {
            elements.forEach(el => observer.unobserve(el));
        };
    }, [selector, options, onIntersect, staggered]);
};

export default useIntersectionObserver;
