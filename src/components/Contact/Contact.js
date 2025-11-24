// src/components/Contact/Contact.jsx
import React, { useState } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { AiOutlineMail, AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { FaPhoneAlt, FaLinkedinIn } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { EMAIL, PHONE, LOCATION, FORMSPREE_ENDPOINT } from "../../config/contact";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Contact.css";

function Contact() {
  useScrollReveal();

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
      if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        if (res.ok) {
          setStatus({ type: "success", message: "✅ Message sent successfully!" });
          setName("");
          setEmail("");
          setMessage("");
        } else {
          setStatus({ type: "danger", message: "❌ Failed to send message. Try again later." });
        }
      } else {
        const subject = encodeURIComponent(`Portfolio Contact: ${name} `);
        const body = encodeURIComponent(`Name: ${name} \nEmail: ${email} \n\n${message} `);
        window.open(`mailto:${EMAIL}?subject = ${subject}& body=${body} `, "_blank");
        setStatus({
          type: "success",
          message: "✉️ Email client opened — send to complete.",
        });
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
                <a href={`mailto:${EMAIL} `} className="contact-link">
                  {EMAIL}
                </a>
              </div>
              <div className="contact-info-item">
                <FaPhoneAlt className="contact-icon" />
                <a href={`tel:${PHONE} `} className="contact-link">
                  {PHONE}
                </a>
              </div>
              <div className="contact-info-item">
                <MdLocationOn className="contact-icon" />
                <span className="contact-text">{LOCATION}</span>
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
                    href="https://github.com/Rajashekharvn"
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
                    href="https://www.linkedin.com/in/rajashekhar-naduvinahalli-476b15253"
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
                    href="https://www.instagram.com/rajashekhar_v_n?igsh=MTM0bmJhZ2d4dWFnbg=="
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
