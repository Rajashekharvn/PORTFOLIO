import React, { useEffect, useRef, useMemo, memo } from "react";
import "./Timeline.css";

import { getTimelineData } from "../../supabase/database";
import "./Timeline.css";

// const timelineData = [ ... ]; // Removed static data


const TimelineItem = memo(({ item, index }) => {
    const itemRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        const currentItemRef = itemRef.current;
        return () => {
            if (currentItemRef) {
                observer.unobserve(currentItemRef);
            }
        };
    }, []);

    return (
        <div
            ref={itemRef}
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"} ${item.type}`}
        >
            <div className="timeline-content">
                <div className="timeline-icon">
                    <i className={item.icon}></i>
                </div>
                <div className="timeline-card">
                    <span className="timeline-period">{item.period}</span>
                    <h3 className="timeline-title">{item.title}</h3>
                    <h4 className="timeline-organization">{item.organization}</h4>
                    <p className="timeline-description">{item.description}</p>
                </div>
            </div>
        </div>
    );
});

const Timeline = () => {
    const [items, setItems] = React.useState([]);

    // Memoize the sorted items
    const sortedItems = useMemo(() => {
        if (!items) return [];
        return [...items].sort((a, b) => {
            const getLatestYear = (period) => {
                if (!period) return 0;
                const p = period.toLowerCase();
                if (p.includes("present") || p.includes("current")) {
                    return new Date().getFullYear();
                }
                const years = period.match(/\d{4}/g);
                if (!years) return 0;
                return Math.max(...years.map(Number));
            };
            return getLatestYear(b.period) - getLatestYear(a.period);
        });
    }, [items]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTimelineData();
            if (data) setItems(data);
        };
        fetchData();
    }, []);

    return (
        <div className="timeline-section">
            <h2 className="timeline-heading">
                My <span className="purple">Journey</span>
            </h2>
            <p className="timeline-subheading">
                Education, Experience, and Achievements
            </p>
            <div className="timeline-container">
                <div className="timeline-line"></div>
                {sortedItems.map((item, index) => (
                    <TimelineItem key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default memo(Timeline);
