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
        <div>
          <Card.Title className="mb-1">{title}</Card.Title>
          <Card.Text style={{ textAlign: "justify" }}>{description}</Card.Text>
        </div>

        <div className="project-card-footer">
          <div className="project-badges">
            {tags.slice(0,4).map((t, i) => (
              <span key={i} className="badge-tech">{t}</span>
            ))}
          </div>

          <div>
            <Button href={ghLink} target="_blank" rel="noopener noreferrer" className="btn">
              <BsGithub />&nbsp;{isBlog ? "Blog" : "GitHub"}
            </Button>

            {!isBlog && demoLink && (
              <Button
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ marginLeft: "8px" }}
              >
                <CgWebsite />&nbsp;Demo
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCards;
