import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view reveal-child">
      <Card.Body>
        <blockquote className="blockquote mb-0 stagger">
          <p className="stagger-child" style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Rajashekhar N </span>
            from <span className="purple"> Karnataka, India.</span>
            <br />
            I am currently pursuing my engineering in Computer Science &
            Engineering at SKSVMACET Laxmeshwar.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>

          <ul>
            <li className="about-activity stagger-child">
              <ImPointRight /> Playing Chess
            </li>
            <li className="about-activity stagger-child">
              <ImPointRight /> Watching Movies and Series
            </li>
            <li className="about-activity stagger-child">
              <ImPointRight /> Travelling
            </li>
          </ul>

          <p className="stagger-child" style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"
          </p>
          <footer className="blockquote-footer stagger-child">Rajashekhar</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
