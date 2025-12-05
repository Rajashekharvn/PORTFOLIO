import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
  AiOutlineMail,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { EMAIL } from "../../../config/contact";
import useHomeContent from "../../../hooks/useHomeContent";
import "./Footer.css";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  const { content } = useHomeContent();

  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>Designed and Developed by Rajashekhar V N</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>Copyright © {year} RVN</h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">
              <a
                href={`mailto:${EMAIL}`}
                className="footer-social-icons"
                rel="noopener noreferrer"
              >
                <AiOutlineMail />
              </a>
            </li>
            <li className="social-icons">
              <a
                href={content.githubLink}
                className="footer-social-icons"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social-icons">
              <a
                href={content.linkedinLink}
                className="footer-social-icons"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social-icons">
              <a
                href={content.instagramLink}
                className="footer-social-icons"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillInstagram />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
