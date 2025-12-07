import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
  AiOutlineMail,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { getContactData } from "../../../supabase/database";
import "./Footer.css";

/**
 * Footer component displaying copyright information and social media links
 * Fetches social links dynamically from the contact_content table
 * @returns {JSX.Element} Footer component
 */
function Footer() {
  let date = new Date();
  let year = date.getFullYear();

  const [socials, setSocials] = React.useState({
    email: "",
    github: "",
    linkedin: "",
    instagram: ""
  });

  React.useEffect(() => {
    const fetchSocials = async () => {
      const data = await getContactData();
      if (data) {
        setSocials({
          email: data.email,
          github: data.github,
          linkedin: data.linkedin,
          instagram: data.instagram
        });
      }
    };
    fetchSocials();
  }, []);

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
                href={`mailto:${socials.email}`}
                className="footer-social-icons"
                rel="noopener noreferrer"
              >
                <AiOutlineMail />
              </a>
            </li>
            <li className="social-icons">
              <a
                href={socials.github}
                className="footer-social-icons"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social-icons">
              <a
                href={socials.linkedin}
                className="footer-social-icons"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social-icons">
              <a
                href={socials.instagram}
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
