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
    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-child, .stagger > *"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <Container fluid className="about-section">
      <Particle />

      <Container>
        <Row className="about-top-row">
          <Col md={7} className="reveal-left">
            <h1 className="about-heading">
              Know Who <strong className="purple">I'M</strong>
            </h1>

            <div className="reveal-left">
              <Aboutcard />
            </div>
          </Col>

          <Col md={5} className="about-img reveal-right">
            <img
              src={laptopImg}
              alt="about"
              className="img-fluid float-animation"
            />
          </Col>
        </Row>

        {/* Skillset */}
        <h1 className="project-heading reveal">
          Professional <strong className="purple">Skillset</strong>
        </h1>
        <div className="stagger tech-row">
          <Techstack />
        </div>

        {/* Tools */}
        <h1 className="project-heading reveal">
          <strong className="purple">Tools</strong> I use
        </h1>
        <div className="stagger tech-row">
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
