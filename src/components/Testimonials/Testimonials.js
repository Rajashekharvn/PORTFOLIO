import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Testimonials.css";

const testimonialData = [
    {
        id: 1,
        name: "John Doe",
        role: "Senior Developer",
        company: "Tech Corp",
        image: "https://ui-avatars.com/api/?name=John+Doe&background=c770f0&color=fff&size=100",
        rating: 5,
        text: "Rajashekhar is an exceptional developer with great attention to detail. His work on our web application exceeded expectations and was delivered on time.",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Project Manager",
        company: "Digital Solutions",
        image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=8a49a8&color=fff&size=100",
        rating: 5,
        text: "Working with Rajashekhar was a pleasure. He brings innovative solutions to complex problems and communicates effectively throughout the development process.",
    },
    {
        id: 3,
        name: "Michael Chen",
        role: "CTO",
        company: "StartupHub",
        image: "https://ui-avatars.com/api/?name=Michael+Chen&background=6a11cb&color=fff&size=100",
        rating: 5,
        text: "Outstanding technical skills and professional approach. Rajashekhar delivered a robust and scalable solution that perfectly met our requirements.",
    },
];

const TestimonialCard = ({ testimonial, isActive }) => {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <i
                key={index}
                className={`fas fa-star ${index < rating ? "filled" : ""}`}
            ></i>
        ));
    };

    return (
        <div className={`testimonial-card ${isActive ? "active" : ""}`}>
            <div className="testimonial-content">
                <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-rating">{renderStars(testimonial.rating)}</div>
            </div>
            <div className="testimonial-author">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="author-image"
                />
                <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">
                        {testimonial.role} at {testimonial.company}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? testimonialData.length - 1 : prev - 1
        );
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    return (
        <Container fluid className="testimonials-section">
            <Container>
                <h2 className="testimonials-heading">
                    What <span className="purple">People Say</span>
                </h2>
                <p className="testimonials-subheading">
                    Feedback from colleagues and clients I've worked with
                </p>

                <Row className="justify-content-center">
                    <Col lg={8} md={10}>
                        <div className="testimonials-carousel">
                            <button
                                className="carousel-button prev"
                                onClick={prevSlide}
                                aria-label="Previous testimonial"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            <div className="testimonials-wrapper">
                                {testimonialData.map((testimonial, index) => (
                                    <TestimonialCard
                                        key={testimonial.id}
                                        testimonial={testimonial}
                                        isActive={index === currentIndex}
                                    />
                                ))}
                            </div>

                            <button
                                className="carousel-button next"
                                onClick={nextSlide}
                                aria-label="Next testimonial"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>

                        <div className="carousel-indicators">
                            {testimonialData.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentIndex ? "active" : ""}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default Testimonials;
