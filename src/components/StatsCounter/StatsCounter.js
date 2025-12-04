import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CountUp from "react-countup";
import { FaProjectDiagram, FaCode, FaCertificate, FaClock } from "react-icons/fa";
import "./StatsCounter.css";

const StatCard = ({ icon: Icon, count, label, suffix = "", duration = 2 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [isVisible]);

    return (
        <Col xs={6} md={3} className="stat-card-col" ref={cardRef}>
            <div className="stat-card">
                <div className="stat-icon">
                    <Icon />
                </div>
                <div className="stat-number">
                    {isVisible ? (
                        <CountUp end={count} duration={duration} suffix={suffix} />
                    ) : (
                        0
                    )}
                </div>
                <div className="stat-label">{label}</div>
                <div className="stat-glow"></div>
            </div>
        </Col>
    );
};

const StatsCounter = () => {
    return (
        <Container fluid className="stats-section">
            <Container>
                <Row className="stats-row">
                    <StatCard
                        icon={FaProjectDiagram}
                        count={15}
                        suffix="+"
                        label="Projects Completed"
                        duration={2.5}
                    />
                    <StatCard
                        icon={FaCode}
                        count={20}
                        suffix="+"
                        label="Technologies"
                        duration={2}
                    />
                    <StatCard
                        icon={FaCertificate}
                        count={10}
                        suffix="+"
                        label="Certifications"
                        duration={2}
                    />
                    <StatCard
                        icon={FaClock}
                        count={2}
                        suffix="+"
                        label="Years Experience"
                        duration={1.5}
                    />
                </Row>
            </Container>
        </Container>
    );
};

export default StatsCounter;
