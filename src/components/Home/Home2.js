import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.png";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import StatsCounter from "../StatsCounter/StatsCounter";


function Home2({ content }) {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              {content.introTitle}
            </h1>
            <p className="home-about-body" style={{ whiteSpace: "pre-wrap" }}>
              {content.introBody}
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={content.avatarUrl || myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <StatsCounter />
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <div style={{ marginBottom: 15 }}>
              <Button as={Link} to="/contact" variant="outline-light" size="sm">
                Contact Me
              </Button>
            </div>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href={content.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href={content.linkedinLink}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href={content.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
