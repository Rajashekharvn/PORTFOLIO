// src/components/Projects/ProjectCards.jsx
import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

function ProjectCards({ imgPath, title, description, ghLink, demoLink, isBlog, tags = [] }) {
  return (
    <article className="project-card project-card-view" role="article" aria-label={title}>
      <Card className="transparent-card">
        {/* Thumbnail wrapper so we can control sizing consistently */}
        <div className="thumb-wrap" aria-hidden="false">
          <img
            src={imgPath}
            alt={`${title} screenshot`}
            className="project-thumb"
            loading="lazy"
          />
        </div>

        <Card.Body className="card-body d-flex flex-column align-items-center">
          <Card.Title className="project-title text-center">{title}</Card.Title>

          <Card.Text className="project-desc text-center">
            {description}
          </Card.Text>

          {/* Tech stacks rendered as visible pill elements */}
          <div className="tech-list" aria-hidden="false">
            {tags && tags.length
              ? tags.map((t, i) => (
                  <span key={`${t}-${i}`} className="tech-pill" title={t}>
                    {t}
                  </span>
                ))
              : null}
          </div>

          {/* Action buttons: hidden until hover/focus via CSS */}
          <div className="project-actions" aria-hidden="true">
            {ghLink && (
              <Button
                as="a"
                href={ghLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                aria-label={`${title} GitHub`}
              >
                <BsGithub /> GitHub
              </Button>
            )}

            {!isBlog && demoLink && (
              <Button
                as="a"
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                aria-label={`${title} Demo`}
              >
                <CgWebsite /> Demo
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </article>
  );
}

export default ProjectCards;
