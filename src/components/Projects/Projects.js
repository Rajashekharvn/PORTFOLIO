// src/components/Projects/Projects.jsx
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
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, []);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works</strong>
        </h1>
        <p className="project-subtext">Here are a few projects I've worked on recently.</p>

        {/* FIXED: correct grid class name */}
        <div className="projects-grid">

          <ProjectCard
            imgPath={chatify}
            isBlog={false}
            title="Centralized Certificate Collection"
            description="Developed a centralized system for managing certificate submissions for students & faculty."
            ghLink="https://github.com/Rajashekharvn/centralized_certificate_collection"
            tags={["PHP", "HTML", "CSS", "MySQL", "Form Validation"]}
          />

          <ProjectCard
            imgPath={bitsOfCode}
            isBlog={false}
            title="Data Hub Collaboration"
            description="A secure data sharing platform with role management & encryption to ensure data safety."
            ghLink="https://github.com/Rajashekharvn/secured-data-hub-collaboration"
            tags={["PHP", "Data Security", "MySQL", "Hackathon"]}
          />

          <ProjectCard
            imgPath={editor}
            isBlog={false}
            title="Hamster Combat"
            description="Key Generator bot & web app built with JavaScript + API logic. Generates unique redeem keys."
            ghLink="https://github.com/Rajashekharvn/hmkey"
            demoLink="https://hmkey.vercel.app/"
            tags={["JavaScript", "API", "CSS", "WebApp", "Vercel"]}
          />

        </div>
      </Container>
    </Container>
  );
}

export default Projects;
