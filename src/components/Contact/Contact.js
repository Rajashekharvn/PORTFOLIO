import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(e.target),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setStatus({ type: "success", message: "Thanks! Your message has been sent." });
          setName("");
          setEmail("");
          setMessage("");
        } else {
          setStatus({ type: "danger", message: data?.errors?.[0]?.message || "Something went wrong. Please try again." });
        }
      } catch (err) {
        setStatus({ type: "danger", message: "Network error. Please try again later." });
      }
      return;
    }

    // Fallback to mailto if no Formspree endpoint configured
    const subject = encodeURIComponent(`Portfolio Contact: ${name || "(No name)"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
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
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.target.focus()}
                  onClick={(e) => e.target.focus()}
                  onTouchStart={(e) => e.target.focus()}
                  autoComplete="name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="contactEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => e.target.focus()}
                  onClick={(e) => e.target.focus()}
                  onTouchStart={(e) => e.target.focus()}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="contactMessage" className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  name="message"
                  as="textarea"
                  rows={5}
                  placeholder="Write your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={(e) => e.target.focus()}
                  onClick={(e) => e.target.focus()}
                  onTouchStart={(e) => e.target.focus()}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" className="contact-submit-btn">
                  {FORMSPREE_ENDPOINT ? "Send Message" : "Send Email"}
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
