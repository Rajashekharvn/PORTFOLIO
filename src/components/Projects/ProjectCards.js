import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

function ProjectCards({ imgPath, title, description, ghLink, demoLink, isBlog, tags = [] }) {
  return (
    <Card className="project-card-view" role="article" aria-label={title}>
      <Card.Img variant="top" src={imgPath} alt={`${title} screenshot`} />

      <Card.Body>
        <Card.Title className="mb-1 text-center">{title}</Card.Title>
        <Card.Text style={{ textAlign: "center" }}>{description}</Card.Text>

        {/* Tech stacks centered */}
        <div className="project-badges">
          {tags.map((t, i) => (
            <span key={i} className="badge-tech">{t}</span>
          ))}
        </div>

        {/* Buttons – hidden until card hover */}
        <div className="project-buttons">
          <Button href={ghLink} target="_blank" rel="noopener noreferrer">
            <BsGithub /> GitHub
          </Button>

          {!isBlog && demoLink && (
            <Button href={demoLink} target="_blank" rel="noopener noreferrer">
              <CgWebsite /> Demo
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCards;
