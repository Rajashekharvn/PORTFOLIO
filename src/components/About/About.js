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
  // Intersection Observer to trigger reveal animations
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
  {/*new*/}
        {/* Heading */}
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col md={7} className="reveal-left">
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              Know Who <strong className="purple">I'M</strong>
            </h1>

            {/* About Card */}
            <div className="reveal-left">
              <Aboutcard />
            </div>
          </Col>

          {/* Image */}
          <Col md={5} className="about-img reveal-right">
            <img
              src={laptopImg}
              alt="about"
              className="img-fluid float-animation"
            />
          </Col>
        </Row>

        {/* Skillset */}
        <h1 className="project-heading reveal">Professional <strong className="purple">Skillset</strong></h1>
        <div className="stagger">
          <Techstack />
        </div>

        {/* Tools */}
        <h1 className="project-heading reveal"><strong className="purple">Tools</strong> I use</h1>
        <div className="stagger">
          <Toolstack />
        </div>

        {/* Github snake animation */}
        <div className="reveal">
          <Github />
        </div>
      </Container>
    </Container>
  );
}

export default About;
