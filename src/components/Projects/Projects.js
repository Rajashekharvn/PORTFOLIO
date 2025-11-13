import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import ProjectCard from "../Projects/ProjectCards";
import Particle from "../Particle";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import bitsOfCode from "../../Assets/Projects/blog.png";

function Projects() {
  useEffect(() => {
    const cards = document.querySelectorAll(".project-card-view");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.18 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, []);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">My Recent <strong className="purple">Works</strong></h1>
        <p className="project-subtext">Here are a few projects I've worked on recently.</p>

        <div className="project-grid">
          <div className="project-card">
            <ProjectCard
              imgPath={chatify}
              isBlog={false}
              title="Centralized Certificate Collection"
              description="Developed a centralized system for collecting certificates for a college-level Faculty-Student Development Program using PHP and HTML."
              ghLink="https://github.com/Rajashekharvn/centralized_certificate_collection"
              tags={["PHP", "HTML", "Forms"]}
            />
          </div>

          <div className="project-card">
            <ProjectCard
              imgPath={bitsOfCode}
              isBlog={false}
              title="Data Hub Collaboration"
              description="A secure data-sharing platform built with PHP and HTML during a National Hackathon. Enables safe collaboration with data protection and an intuitive interface."
              ghLink="https://github.com/Rajashekharvn/secured-data-hub-collaboration"
              tags={["PHP", "Security", "Hackathon"]}
            />
          </div>

          <div className="project-card">
            <ProjectCard
              imgPath={editor}
              isBlog={false}
              title="Hamster Combat"
              description="Hamster Combat Key Generator bot and web app built with JavaScript, HTML, and CSS. Generates unique keys and offers an intuitive interface for management."
              ghLink="https://github.com/Rajashekharvn/hmkey"
              demoLink="https://hmkey.vercel.app/"
              tags={["JavaScript", "WebApp", "Vercel"]}
            />
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default Projects;
