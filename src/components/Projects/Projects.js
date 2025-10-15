import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import bitsOfCode from "../../Assets/Projects/blog.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={chatify}
              isBlog={false}
              title="Centralized Certificate Collection"
              description="Developed a centralized system for collecting certificates for a CollegeLevel Faculty Student. Development Program, using PHP and HTML."
              ghLink="https://github.com/Rajashekharvn/centralized_certificate_collection"
              
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={bitsOfCode}
              isBlog={false}
              title="data-hub-collaboration"
              description="A secure data-sharing platform built with PHP and HTML, designed during a National Level Hackathon. Enables safe collaboration with features for data protection and user-friendly interface for seamless interactions."
              ghLink="https://github.com/Rajashekharvn/secured-data-hub-collaboration"
              
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={editor}
              isBlog={false}
              title="Hamster Combat"
              description="Hamster Combat Key Generator bot and web app built with JavaScript, HTML, and CSS. The bot generates unique keys, while the web app provides an intuitive interface for key generation and management."
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
