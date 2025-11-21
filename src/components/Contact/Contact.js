// src/components/Contact/Contact.jsx
import React, { useEffect, useRef, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const nameRef = useRef(null);
  const alertRef = useRef(null);
  const honeypotRef = useRef(null);
  const statusTimerRef = useRef(null);

  useEffect(() => {
    const nodes = document.querySelectorAll("#tsparticles, canvas, .tsparticles-canvas-el");
    nodes.forEach((n) => {
      try { n.style.pointerEvents = "none"; } catch (e) { /* ignore */ }
    });
  }, []);

  useEffect(() => {
    nameRef.current?.focus();
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  const showStatus = (type, message, focusAlert = true, autoClear = true) => {
    setStatus({ type, message });
    if (focusAlert && alertRef.current) alertRef.current.focus();
    if (autoClear) {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
      statusTimerRef.current = setTimeout(() => setStatus({ type: "", message: "" }), 6000);
    }
  };

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) errors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) errors.message = "Message cannot be empty.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field) => {
    setFieldErrors((s) => {
      if (!s[field]) return s;
      const copy = { ...s };
      delete copy[field];
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (honeypotRef.current && honeypotRef.current.value.trim() !== "") return;

    if (!validate()) {
      showStatus("danger", "⚠️ Please fix the highlighted fields.", true, false);
      return;
    }

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.ok) {
          setName("");
          setEmail("");
          setMessage("");
          setFieldErrors({});
          setSuccessVisible(true);
          showStatus("success", "✅ Message sent successfully!", true, true);
          // hide success overlay after a while
          setTimeout(() => setSuccessVisible(false), 2200);
        } else {
          let body = {};
          try { body = await res.json(); } catch (err) {}
          const errMsg = body?.error || "❌ Failed to send message. Try again later.";
          showStatus("danger", errMsg);
        }
      } else {
        const subject = encodeURIComponent(`Portfolio Contact: ${name.trim()}`);
        const body = encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`);
        window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, "_blank");
        setSuccessVisible(true);
        showStatus("success", "✉️ Email client opened — send to complete.");
        setTimeout(() => setSuccessVisible(false), 2000);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        showStatus("danger", "⏱️ Request timed out. Please check your connection and try again.");
      } else {
        console.error("Form error:", err);
        showStatus("danger", "🌐 Network error. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
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
              {/* success overlay */}
              {successVisible && (
                <div className="success-overlay" aria-hidden="true">
                  <div className="success-check">
                    <svg width="56" height="56" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                </div>
              )}

              {/* accessible status alert */}
              {status.message && (
                <div
                  className={`contact-alert ${status.type === "danger" ? "alert-danger" : "alert-success"}`}
                  role="status"
                  tabIndex={-1}
                  ref={alertRef}
                  aria-live="polite"
                >
                  {status.message}
                </div>
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

                <div className="form-row">
                  <div className="form-group mb-3 w-50">
                    <label htmlFor="name" className="form-label">Name *</label>
                    <input
                      id="name"
                      name="name"
                      ref={nameRef}
                      type="text"
                      className={`form-control contact-input ${fieldErrors.name ? "input-error" : ""}`}
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                      disabled={isSubmitting}
                      aria-required="true"
                    />
                    {fieldErrors.name && <div className="field-error" role="alert">{fieldErrors.name}</div>}
                  </div>

                  <div className="form-group mb-3 w-50">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control contact-input ${fieldErrors.email ? "input-error" : ""}`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                      disabled={isSubmitting}
                      aria-required="true"
                      autoComplete="email"
                    />
                    {fieldErrors.email && <div className="field-error" role="alert">{fieldErrors.email}</div>}
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    className={`form-control contact-input contact-textarea ${fieldErrors.message ? "input-error" : ""}`}
                    rows={6}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); clearFieldError("message"); }}
                    disabled={isSubmitting}
                    aria-required="true"
                  />
                  {fieldErrors.message && <div className="field-error" role="alert">{fieldErrors.message}</div>}
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
                      <>
                        <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M2 12l18-9-9 18-2-7-7-2z" />
                        </svg>
                        Send Message
                      </>
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
