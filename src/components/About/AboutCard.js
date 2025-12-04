import React from "react";
import { ImPointRight } from "react-icons/im";

function AboutCard({ content }) {
  return (
    <div className="quote-card-view">
      <blockquote className="blockquote mb-0">
        <p className="about-text" style={{ whiteSpace: "pre-wrap" }}>
          {content.description}
        </p>
        <ul>
          {content.activities.map((activity, index) => (
            <li className="about-activity" key={index}>
              <ImPointRight /> {activity}
            </li>
          ))}
        </ul>

        <p style={{ color: "rgba(255, 255, 255, 0.5)", fontStyle: "italic" }}>
          "{content.quote}"{" "}
        </p>
        <footer className="blockquote-footer">{content.quoteAuthor}</footer>
      </blockquote>
    </div>
  );
}

export default AboutCard;
