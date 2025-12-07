import React, { useEffect, useRef } from "react";
import "./Timeline.css";

import { getTimelineData } from "../../supabase/database";
import "./Timeline.css";

// const timelineData = [ ... ]; // Removed static data


const TimelineItem = ({ item, index }) => {
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

        return () => {
            if (itemRef.current) {
                observer.unobserve(itemRef.current);
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
};

const Timeline = () => {
    const [items, setItems] = React.useState([]);

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
                {items.map((item, index) => (
                    <TimelineItem key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
