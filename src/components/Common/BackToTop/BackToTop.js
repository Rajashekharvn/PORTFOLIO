import React, { useState, useEffect } from "react";
import "./BackToTop.css";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const toggleVisibility = () => {
            // Calculate scroll progress
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            setScrollProgress(scrollPercent);

            // Show button when page is scrolled down 300px
            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className={`back-to-top ${isVisible ? "visible" : ""}`}>
            <button
                onClick={scrollToTop}
                className="back-to-top-button"
                aria-label="Back to top"
            >
                <svg className="progress-ring" width="60" height="60">
                    <circle
                        className="progress-ring-circle-bg"
                        stroke="rgba(199, 112, 240, 0.2)"
                        strokeWidth="3"
                        fill="transparent"
                        r="26"
                        cx="30"
                        cy="30"
                    />
                    <circle
                        className="progress-ring-circle"
                        stroke="#c770f0"
                        strokeWidth="3"
                        fill="transparent"
                        r="26"
                        cx="30"
                        cy="30"
                        style={{
                            strokeDasharray: `${2 * Math.PI * 26}`,
                            strokeDashoffset: `${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`,
                        }}
                    />
                </svg>
                <i className="fas fa-arrow-up back-to-top-icon"></i>
            </button>
        </div>
    );
};

export default BackToTop;
