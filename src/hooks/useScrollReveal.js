import useIntersectionObserver from './useIntersectionObserver';

/**
 * Custom hook for scroll reveal animations using IntersectionObserver
 * @param {string} selector - CSS selector for elements to observe (default: '.fade-up')
 * @param {number} threshold - Intersection threshold (default: 0.1)
 */
const useScrollReveal = (selector = '.fade-up', threshold = 0.1) => {
    useIntersectionObserver(selector, { threshold });
};

export default useScrollReveal;
