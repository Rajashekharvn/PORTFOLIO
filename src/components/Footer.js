import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub, AiFillInstagram, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { EMAIL } from "../config/contact";

const social = [
  { label: "Email", href: `mailto:${EMAIL}`, icon: <AiOutlineMail /> },
  { label: "GitHub", href: "https://github.com/Rajashekharvn", icon: <AiFillGithub /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rajashekhar-naduvinahalli-476b15253/", icon: <FaLinkedinIn /> },
  { label: "Instagram", href: "https://www.instagram.com/rajashekhar_v_n?igsh=MTM0bmJhZ2d4dWFnbg==", icon: <AiFillInstagram /> },
];

export default function Footer() {
  const year = new Date().getFullYear();
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
          <ul className="footer-icons" aria-label="Social links">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
