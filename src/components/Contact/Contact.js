import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Particle from "../Particle";
import { AiOutlineMail } from "react-icons/ai";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { EMAIL, PHONE, LOCATION, FORMSPREE_ENDPOINT } from "../../config/contact";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: "danger", message: "Please fill in all fields." });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: "danger", message: "Please enter a valid email address." });
      setIsSubmitting(false);
      return;
    }

    try {
      if (FORMSPREE_ENDPOINT) {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message
          })
        });

        if (response.ok) {
          setStatus({ type: "success", message: "Thank you! Your message has been sent successfully." });
          setFormData({ name: "", email: "", message: "" });
        } else {
          const data = await response.json().catch(() => ({}));
          setStatus({ type: "danger", message: data?.errors?.[0]?.message || "Failed to send message. Please try again." });
        }
      } else {
        // Fallback to mailto
        const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, '_blank');
        setStatus({ type: "success", message: "Your email client should open with the message ready to send." });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({ type: "danger", message: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="contact-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", paddingTop: "110px" }}>
          <Col md={12} className="contact-header">
            <h1 className="project-heading">
              <strong className="purple">Get In Touch</strong>
            </h1>
            <p className="contact-subtitle">
              Have a question, project idea, or just want to say hi? I'd love to hear from you.
            </p>
          </Col>
        </Row>

        <Row className="contact-content">
          <Col md={5} className="contact-info">
            <ul className="contact-info-list">
              <li>
                <AiOutlineMail className="contact-icon" />
                <a href={`mailto:${EMAIL}`} className="contact-link">
                  {EMAIL}
                </a>
              </li>
              <li>
                <FaPhoneAlt className="contact-icon" />
                <a href={`tel:${PHONE}`} className="contact-link">
                  {PHONE}
                </a>
              </li>
              <li>
                <MdLocationOn className="contact-icon" />
                <span className="contact-text">{LOCATION}</span>
              </li>
            </ul>
          </Col>

          <Col md={7} className="contact-form-wrapper">
            {status.message && (
              <Alert variant={status.type} className="mb-3">
                {status.message}
              </Alert>
            )}
            <Form onSubmit={handleSubmit} className="contact-form">
              <Form.Group controlId="contactName" className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  disabled={isSubmitting}
                  required
                />
              </Form.Group>

              <Form.Group controlId="contactEmail" className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  inputMode="email"
                  disabled={isSubmitting}
                  required
                />
              </Form.Group>

              <Form.Group controlId="contactMessage" className="mb-4">
                <Form.Label>Message *</Form.Label>
                <Form.Control
                  name="message"
                  as="textarea"
                  rows={5}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : (FORMSPREE_ENDPOINT ? "Send Message" : "Send Email")}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Contact;
