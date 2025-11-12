// src/components/Contact/Contact.jsx
import React, { useEffect, useRef, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
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

  // Refs for accessibility focus management
  const nameRef = useRef(null);
  const alertRef = useRef(null);
  const honeypotRef = useRef(null);
  const statusTimerRef = useRef(null);

  // disable pointer events on particle canvas
  useEffect(() => {
    const nodes = document.querySelectorAll("#tsparticles, canvas, .tsparticles-canvas-el");
    nodes.forEach((n) => {
      try { n.style.pointerEvents = "none"; } catch (e) { /* ignore */ }
    });
  }, []);

  // autofocus name on mount
  useEffect(() => {
    nameRef.current?.focus();
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  // helper to set status and focus the alert for screen readers
  const showStatus = (type, message, focusAlert = true, autoClear = true) => {
    setStatus({ type, message });
    if (focusAlert && alertRef.current) {
      alertRef.current.focus();
    }
    if (autoClear) {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
      statusTimerRef.current = setTimeout(() => setStatus({ type: "", message: "" }), 6000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // clear previous status
    setStatus({ type: "", message: "" });

    // honeypot check (bots)
    if (honeypotRef.current && honeypotRef.current.value.trim() !== "") {
      // silently drop
      return;
    }

    // simple validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      showStatus("danger", "⚠️ Please fill in all fields.");
      // move focus to first invalid input
      if (!name.trim()) {
        nameRef.current?.focus();
      } else if (!email.trim()) {
        document.getElementById("email")?.focus();
      } else {
        document.getElementById("message")?.focus();
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus("danger", "📧 Please enter a valid email address.");
      document.getElementById("email")?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
        });

        if (res.ok) {
          setName("");
          setEmail("");
          setMessage("");
          showStatus("success", "✅ Message sent successfully!");
        } else {
          // try to parse body for message
          let body = {};
          try { body = await res.json(); } catch (err) {}
          const errMsg = body?.error || "❌ Failed to send message. Try again later.";
          showStatus("danger", errMsg);
        }
      } else {
        // fallback to mailto
        const subject = encodeURIComponent(`Portfolio Contact: ${name.trim()}`);
        const body = encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`);
        window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, "_blank");
        showStatus("success", "✉️ Email client opened — send to complete.");
      }
    } catch (err) {
      console.error("Form error:", err);
      showStatus("danger", "🌐 Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="about-section contact-section" id="contact" aria-labelledby="contact-heading">
      <Particle />
      <Container className="contact-inner">
        <div className="text-center" style={{ paddingTop: 20 }}>
          <h1 id="contact-heading" className="project-heading">
            <strong className="purple">Get In Touch</strong>
          </h1>
          <p className="contact-subtitle">
            Let’s collaborate, discuss a project, or just connect!
          </p>
        </div>

        <div className="contact-content" role="region" aria-label="Contact content">
          {/* Left info card */}
          <div className="contact-info-col">
            <div className="contact-card contact-info-card" aria-hidden={isSubmitting}>
              <ul className="contact-info-list">
                <li>
                  <AiOutlineMail className="contact-icon" aria-hidden="true" />
                  <a href={`mailto:${EMAIL}`} className="contact-link" rel="noopener noreferrer">{EMAIL}</a>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" aria-hidden="true" />
                  <a href={`tel:${PHONE}`} className="contact-link" rel="noopener noreferrer">{PHONE}</a>
                </li>
                <li>
                  <MdLocationOn className="contact-icon" aria-hidden="true" />
                  <span className="contact-text">{LOCATION}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right contact form */}
          <div className="contact-form-col">
            <div className="contact-card contact-form-wrapper" aria-live="polite">
              {/* accessible status alert */}
              {status.message && (
                <Alert
                  variant={status.type === "danger" ? "danger" : "success"}
                  className="contact-alert"
                  role="status"
                  tabIndex={-1}
                  ref={alertRef}
                  aria-live="polite"
                >
                  {status.message}
                </Alert>
              )}

              <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
                {/* honeypot (hidden) */}
                <input
                  type="text"
                  name="hp_email"
                  tabIndex={-1}
                  autoComplete="off"
                  ref={honeypotRef}
                  style={{ display: "none" }}
                  aria-hidden="true"
                />

                <div className="form-group mb-3 contact-form">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    id="name"
                    ref={nameRef}
                    type="text"
                    className="form-control contact-input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    aria-required="true"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control contact-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    id="message"
                    className="form-control contact-input contact-textarea"
                    rows={6}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                    aria-required="true"
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-purple contact-submit-btn"
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default Contact;
