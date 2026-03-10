import React, { useEffect, useRef, useState, memo } from "react";
import "./SkillBar.css";

const SkillBar = memo(({ skill, percentage, category }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentPercentage, setCurrentPercentage] = useState(0);
    const barRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (barRef.current) {
            observer.observe(barRef.current);
        }

        const currentBarRef = barRef.current;
        return () => {
            if (currentBarRef) {
                observer.unobserve(currentBarRef);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            let start = 0;
            const increment = percentage / 60; // 60 frames for smooth animation
            const timer = setInterval(() => {
                start += increment;
                if (start >= percentage) {
                    setCurrentPercentage(percentage);
                    clearInterval(timer);
                } else {
                    setCurrentPercentage(Math.floor(start));
                }
            }, 16); // ~60fps

            return () => clearInterval(timer);
        }
    }, [isVisible, percentage]);

    return (
        <div className="skill-bar-container" ref={barRef}>
            <div className="skill-bar-header">
                <span className="skill-name">{skill}</span>
                <span className="skill-percentage">{currentPercentage}%</span>
            </div>
            <div className="skill-bar-background">
                <div
                    className={`skill-bar-fill ${category}`}
                    style={{
                        width: isVisible ? `${currentPercentage}%` : "0%",
                    }}
                >
                    <div className="skill-bar-glow"></div>
                </div>
            </div>
        </div>
    );
});

// Default fallback skills
const defaultSkills = {
    frontend: [
        { name: "React.js", level: 90 },
        { name: "JavaScript", level: 88 },
        { name: "HTML/CSS", level: 92 },
        { name: "Bootstrap", level: 85 },
    ],
    backend: [
        { name: "Java", level: 80 },
        { name: "MySQL", level: 82 },
        { name: "Node.js", level: 75 },
        { name: "REST APIs", level: 78 },
    ],
    tools: [
        { name: "Git/GitHub", level: 85 },
        { name: "VS Code", level: 90 },
        { name: "IntelliJ", level: 70 },
        { name: "Postman", level: 75 },
    ],
};

const SkillBars = memo(() => {
    const [skills, setSkills] = React.useState({
        frontend: [],
        backend: [],
        tools: []
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { getAboutData } = await import('../../supabase/database');
                const data = await getAboutData();

                if (data && data.skill_bars) {
                    // Use skill_bars from database
                    setSkills(data.skill_bars);
                } else {
                    // Fallback to default skills
                    setSkills(defaultSkills);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
                // Fallback to default skills on error
                setSkills(defaultSkills);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    if (loading) {
        return (
            <div className="skill-bars-section">
                <h2 className="skill-category-title">
                    <span className="purple">Loading</span> Skills...
                </h2>
            </div>
        );
    }

    return (
        <div className="skill-bars-section">
            <h2 className="skill-category-title">
                <span className="purple">Technical</span> Proficiency
            </h2>

            {skills.frontend && skills.frontend.length > 0 && (
                <div className="skill-category">
                    <h3 className="category-name">
                        <i className="fas fa-laptop-code"></i> Frontend Development
                    </h3>
                    {skills.frontend.map((skill, index) => (
                        <SkillBar
                            key={index}
                            skill={skill.name}
                            percentage={skill.level}
                            category="frontend"
                        />
                    ))}
                </div>
            )}

            {skills.backend && skills.backend.length > 0 && (
                <div className="skill-category">
                    <h3 className="category-name">
                        <i className="fas fa-server"></i> Backend Development
                    </h3>
                    {skills.backend.map((skill, index) => (
                        <SkillBar
                            key={index}
                            skill={skill.name}
                            percentage={skill.level}
                            category="backend"
                        />
                    ))}
                </div>
            )}

            {skills.tools && skills.tools.length > 0 && (
                <div className="skill-category">
                    <h3 className="category-name">
                        <i className="fas fa-tools"></i> Tools & Technologies
                    </h3>
                    {skills.tools.map((skill, index) => (
                        <SkillBar
                            key={index}
                            skill={skill.name}
                            percentage={skill.level}
                            category="tools"
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default memo(SkillBars);
