import { useEffect } from 'react';

/**
 * Custom hook for scroll reveal animations using IntersectionObserver
 * @param {string} selector - CSS selector for elements to observe (default: '.fade-up')
 * @param {number} threshold - Intersection threshold (default: 0.1)
 */
const useScrollReveal = (selector = '.fade-up', threshold = 0.1) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    }
                });
            },
            { threshold }
        );

        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => observer.observe(el));

        return () => elements.forEach((el) => observer.unobserve(el));
    }, [selector, threshold]);
};

export default useScrollReveal;
