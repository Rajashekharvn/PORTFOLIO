import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import "./About.css";

function About() {
  useEffect(() => {
    // select all reveal targets and stagger children
    const revealSelector = [
      ".reveal",
      ".reveal-left",
      ".reveal-right",
      ".reveal-child",
      ".stagger > *",
    ].join(", ");
    const revealElements = Array.from(document.querySelectorAll(revealSelector));

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // if you only want one-time reveals, unobserve the target
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      // cleanup observer
      try {
        observer.disconnect();
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  return (
    <Container fluid className="about-section" id="about">
      <Particle />

      <Container>
        {/* Row: left text + right illustration */}
        <Row className="about-row" style={{ gap: 24 }}>
          {/* Left: text / about card */}
          <Col md={7} className="about-text-col">
            <div className="reveal-left">
              <h1 className="project-heading" style={{ marginBottom: 12 }}>
                Know Who <strong className="purple">I'M</strong>
              </h1>

              <div className="quote-card-wrapper reveal-child">
                <Aboutcard />
              </div>
            </div>
          </Col>

          {/* Right: illustration */}
          <Col md={5} className="about-img reveal-right">
            <img
              src={laptopImg}
              alt="about"
              className="img-fluid float-animation reveal-child"
            />
          </Col>
        </Row>

        {/* Skillset */}
        <div style={{ marginTop: 28 }}>
          <h2 className="project-heading reveal-left" style={{ marginTop: 24 }}>
            Professional <strong className="purple">Skillset</strong>
          </h2>

          {/* Tech icons row — uses stagger + tech-row to animate and align */}
          <div className="stagger tech-row" aria-hidden={false}>
            <Techstack />
          </div>
        </div>

        {/* Tools */}
        <div style={{ marginTop: 8 }}>
          <h2 className="project-heading reveal-left" style={{ marginTop: 8 }}>
            <strong className="purple">Tools</strong> I use
          </h2>

          <div className="stagger tech-row" style={{ marginBottom: 12 }}>
            <Toolstack />
          </div>
        </div>

        {/* Github snake animation */}
        <div className="reveal" style={{ marginTop: 18 }}>
          <Github />
        </div>
      </Container>
    </Container>
  );
}

export default About;
