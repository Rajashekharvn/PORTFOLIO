import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

// Define page order for navigation direction (matching navbar order)
const pageOrder = {
    '/': 0,
    '/about': 1,
    '/project': 2,
    '/resume': 3,
    '/Certificates': 4,
    '/contact': 5
};

function PageTransition({ children }) {
    const location = useLocation();
    const [direction, setDirection] = useState('right');
    const prevPathRef = useRef('/');

    useEffect(() => {
        const currentIndex = pageOrder[location.pathname] ?? 0;
        const prevIndex = pageOrder[prevPathRef.current] ?? 0;

        // Determine slide direction based on page order
        if (currentIndex > prevIndex) {
            setDirection('right'); // Moving forward - slide from right
        } else if (currentIndex < prevIndex) {
            setDirection('left'); // Moving backward - slide from left
        }

        prevPathRef.current = location.pathname;
    }, [location.pathname]);

    return (
        <div key={location.pathname} className={`page-transition slide-from-${direction}`}>
            {children}
        </div>
    );
}

export default PageTransition;
