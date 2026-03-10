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
import { getContactData } from "../../supabase/database";
import { useState, useEffect } from "react";


function Home2({ content }) {
  const [socials, setSocials] = useState({
    github: "",
    linkedin: "",
    instagram: ""
  });

  useEffect(() => {
    const fetchSocials = async () => {
      const data = await getContactData();
      if (data) {
        setSocials({
          github: data.github,
          linkedin: data.linkedin,
          instagram: data.instagram
        });
      }
    };
    fetchSocials();
  }, []);

  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} xs={12} className="home-about-description">
            <h2 style={{ fontSize: "2.6em" }}>
              {content.introTitle}
            </h2>
            <p className="home-about-body" style={{ whiteSpace: "pre-wrap" }}>
              {content.introBody}
            </p>
          </Col>
          <Col md={4} xs={12} className="myAvtar">
            <Tilt>
              <img src={content.avatarUrl || myImg} className="img-fluid" alt="Rajashekhar Profile Avatar" />
            </Tilt>
          </Col>
        </Row>
        <StatsCounter />
        <Row>
          <Col md={12} className="home-about-social">
            <h2>FIND ME ON</h2>
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
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href={socials.instagram}
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
