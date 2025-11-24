import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import bitsOfCode from "../../Assets/Projects/blog.png";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Projects.css";

function Projects() {
  // Use custom hook for fade-up elements
  useScrollReveal();

  // Keep custom card animation logic
  useEffect(() => {
    const cards = document.querySelectorAll(".project-card-view");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting && entry.target.classList.contains("project-card-view")) {
            setTimeout(() => entry.target.classList.add("show"), i * 120);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, []);

  return (
    <Container fluid className="project-section fade-up">
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white", textAlign: "center", marginBottom: "2rem" }}>
          Here are a few projects I've worked on recently.
        </p>

        <Row className="project-grid">
          <Col>
            <ProjectCard
              imgPath={chatify}
              isBlog={false}
              title="Centralized Certificate Collection"
              description="Developed a centralized system for collecting certificates for a college-level Faculty-Student Development Program using PHP and HTML."
              technologies={["PHP", "HTML", "MySQL", "CSS"]}
              ghLink="https://github.com/Rajashekharvn/centralized_certificate_collection"
            />
          </Col>

          <Col>
            <ProjectCard
              imgPath={bitsOfCode}
              isBlog={false}
              title="Data Hub Collaboration"
              description="A secure data-sharing platform built with PHP and HTML during a National Hackathon. Enables safe collaboration with data protection and an intuitive interface."
              technologies={["PHP", "HTML", "Security", "MySQL"]}
              ghLink="https://github.com/Rajashekharvn/secured-data-hub-collaboration"
            />
          </Col>

          <Col>
            <ProjectCard
              imgPath={editor}
              isBlog={false}
              title="Hamster Combat"
              description="Hamster Combat Key Generator bot and web app built with JavaScript, HTML, and CSS. Generates unique keys and offers an intuitive interface for management."
              technologies={["JavaScript", "HTML", "CSS", "Bot"]}
              ghLink="https://github.com/Rajashekharvn/hmkey"
              demoLink="https://hmkey.vercel.app/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
