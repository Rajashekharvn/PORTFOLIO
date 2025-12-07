// src/components/Contact/Contact.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { AiOutlineMail, AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaPhoneAlt, FaLinkedinIn } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
// import { EMAIL, PHONE, LOCATION } from "../../config/contact"; // Removed
import { submitMessage, getContactData } from "../../supabase/database";
import useScrollReveal from "../../hooks/useScrollReveal";

import "./Contact.css";

function Contact() {
  useScrollReveal();
  // const { content } = useHomeContent(); // Removed as we fetch socials from contact info now

  const [contactInfo, setContactInfo] = useState({
    email: "", // EMAIL
    phone: "", // PHONE
    location: "", // LOCATION
    github: "",
    linkedin: "",
    instagram: ""
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      const data = await getContactData();
      if (data) {
        setContactInfo({
          email: data.email,
          phone: data.phone,
          location: data.location,
          github: data.github,
          linkedin: data.linkedin,
          instagram: data.instagram
        });
      }
    };
    fetchContactInfo();
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "danger", message: "⚠️ Please fill in all fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: "danger", message: "📧 Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);

    try {
      try {
        await submitMessage({ name, email, message });
        setStatus({ type: "success", message: "✅ Message sent successfully!" });
        setName("");
        setEmail("");
        setMessage("");
      } catch (err) {
        console.error("Form error:", err);
        setStatus({ type: "danger", message: "❌ Failed to send message. Please try again later." });
      } finally {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Form error:", err);
      setStatus({ type: "danger", message: "🌐 Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="about-section contact-section fade-up" id="contact">
      <Container>
        <h1 className="project-heading">
          <strong className="purple">Get In Touch</strong>
        </h1>
        <p style={{ color: "white", textAlign: "center", marginBottom: "3rem" }}>
          Feel free to reach out to me for any queries or collaboration opportunities!
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
          {/* Contact Information */}
          <Col md={5} className="contact-info-section">
            <h2 className="contact-section-title">
              Contact <span className="purple">Information</span>
            </h2>
            <div className="contact-info-items">
              <div className="contact-info-item">
                <AiOutlineMail className="contact-icon" />
                <a href={`mailto:${contactInfo.email} `} className="contact-link">
                  {contactInfo.email}
                </a>
              </div>
              <div className="contact-info-item">
                <FaPhoneAlt className="contact-icon" />
                <a href={`tel:${contactInfo.phone} `} className="contact-link">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="contact-info-item">
                <MdLocationOn className="contact-icon" />
                <span className="contact-text">{contactInfo.location}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="contact-social-wrapper">
              <h3 className="contact-social-title">Find Me On</h3>
              <p className="contact-social-text">
                Feel free to <span className="purple">connect</span> with me
              </p>
              <ul className="contact-social-links">
                <li className="social-icons">
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    aria-label="GitHub"
                  >
                    <AiFillGithub />
                  </a>
                </li>
                <li className="social-icons">
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn />
                  </a>
                </li>
                <li className="social-icons">
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="icon-colour home-social-icons"
                    aria-label="Instagram"
                  >
                    <AiFillInstagram />
                  </a>
                </li>
              </ul>
            </div>
          </Col>

          {/* Contact Form */}
          <Col md={7} className="contact-form-section">
            <h2 className="contact-section-title">
              Send Me a <span className="purple">Message</span>
            </h2>
            {status.message && (
              <Alert variant={status.type} className="contact-alert" role="status">
                {status.message}
              </Alert>
            )}
            <form onSubmit={handleSubmit} noValidate className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-control contact-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control contact-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  className="form-control contact-input contact-textarea"
                  rows={6}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary contact-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Contact;
