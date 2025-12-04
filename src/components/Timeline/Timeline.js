import React, { useEffect, useRef } from "react";
import "./Timeline.css";

const timelineData = [
    {
        id: 1,
        type: "education",
        title: "Bachelor's in Computer Science",
        organization: "University Name",
        period: "2020 - 2024",
        description: "Focused on software development, algorithms, and web technologies. Graduated with honors.",
        icon: "fas fa-graduation-cap",
    },
    {
        id: 2,
        type: "experience",
        title: "Full Stack Developer Intern",
        organization: "Tech Company",
        period: "2023 - 2024",
        description: "Developed web applications using React.js and Node.js. Collaborated with cross-functional teams.",
        icon: "fas fa-briefcase",
    },
    {
        id: 3,
        type: "achievement",
        title: "National Hackathon Winner",
        organization: "Hackathon Event",
        period: "2023",
        description: "Built a secure data-sharing platform and won first place among 100+ teams.",
        icon: "fas fa-trophy",
    },
    {
        id: 4,
        type: "certification",
        title: "React Developer Certification",
        organization: "Online Platform",
        period: "2023",
        description: "Completed comprehensive React.js course covering advanced concepts and best practices.",
        icon: "fas fa-certificate",
    },
];

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
                {timelineData.map((item, index) => (
                    <TimelineItem key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
