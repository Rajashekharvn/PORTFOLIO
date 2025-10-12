import React, { useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import Particle from "../Particle";
import { AiOutlineMail } from "react-icons/ai";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { EMAIL, PHONE, LOCATION, FORMSPREE_ENDPOINT } from "../../config/contact";
import "./Contact.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "danger", message: "Please fill in all fields." });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
            name: name,
            email: email,
            message: message
          })
        });

        if (response.ok) {
          setStatus({ type: "success", message: "Thank you! Your message has been sent successfully." });
          setName("");
          setEmail("");
          setMessage("");
        } else {
          const data = await response.json().catch(() => ({}));
          setStatus({ type: "danger", message: data?.errors?.[0]?.message || "Failed to send message. Please try again." });
        }
      } else {
        // Fallback to mailto
        const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
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
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control contact-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={handleNameChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control contact-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control contact-input contact-textarea"
                  rows={5}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={handleMessageChange}
                  disabled={isSubmitting}
                  required
                ></textarea>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : (FORMSPREE_ENDPOINT ? "Send Message" : "Send Email")}
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Contact;
