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
    const revealEls = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          // Stagger children
          if (el.classList.contains("stagger")) {
            [...el.children].forEach((child, i) => {
              child.style.transitionDelay = `${i * 70}ms`;
              child.classList.add("is-visible");
            });
          }

          // Reveal element itself
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => revealEls.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>

        {/* About Row */}
        <Row className="reveal reveal-left" style={{ justifyContent: "center", padding: "10px" }}>
          <Col md={7} style={{ paddingTop: "30px", paddingBottom: "50px" }}>
            <h1 className="project-heading">
              Know Who <strong className="purple">I'M</strong>
            </h1>
            <div className="reveal stagger">
              <Aboutcard />
            </div>
          </Col>

          <Col md={5} className="about-img reveal reveal-right" style={{ paddingTop: "120px", paddingBottom: "50px" }}>
            <img src={laptopImg} alt="about" className="img-fluid float-animation reveal-child" />
          </Col>
        </Row>

        <h1 className="project-heading reveal">
          Professional <strong className="purple">Skillset</strong>
        </h1>

        <div className="reveal stagger">
          <Techstack />
        </div>

        <h1 className="project-heading reveal">
          <strong className="purple">Tools</strong> I use
        </h1>

        <div className="reveal stagger">
          <Toolstack />
        </div>

        <div className="reveal">
          <Github />
        </div>

      </Container>
    </Container>
  );
}

export default About;
