import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiFillInstagram,
  AiOutlineMail,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { EMAIL } from "../config/contact";

function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: <AiOutlineMail />, link: `mailto:${EMAIL}` },
    { icon: <AiFillGithub />, link: "https://github.com/Rajashekharvn" },
    {
      icon: <FaLinkedinIn />,
      link: "https://www.linkedin.com/in/rajashekhar-naduvinahalli-476b15253/",
    },
    {
      icon: <AiFillInstagram />,
      link: "https://www.instagram.com/rajashekhar_v_n?igsh=MTM0bmJhZ2d4dWFnbg==",
    },
  ];

  return (
    <Container fluid className="footer">
      <Row>
        <Col md={4} className="footer-copywright">
          <h3>Designed & Developed by Rajashekhar V N</h3>
        </Col>

        <Col md={4} className="footer-copywright">
          <h3>© {year} RVN</h3>
        </Col>

        <Col md={4} className="footer-body">
          <ul className="footer-icons">
            {socialLinks.map((item, index) => (
              <li className="social-icons" key={index}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social Media Link"
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
