import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
  AiOutlineMail,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
// import { EMAIL } from "../../../config/contact"; // Removed
import { getContactData } from "../../../supabase/database";
// import useHomeContent from "../../../hooks/useHomeContent"; // Removed
import "./Footer.css";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  // const { content } = useHomeContent();
  const [socials, setSocials] = React.useState({
    email: "",
    github: "",
    linkedin: "",
    instagram: ""
  });

  React.useEffect(() => {
    const fetchSocials = async () => {
      console.log('Footer: Fetching contact data...');
      const data = await getContactData();
      console.log('Footer: Received contact data:', data);
      if (data) {
        setSocials({
          email: data.email,
          github: data.github,
          linkedin: data.linkedin,
          instagram: data.instagram
        });
        console.log('Footer: Updated socials state:', {
          email: data.email,
          github: data.github,
          linkedin: data.linkedin,
          instagram: data.instagram
        });
      } else {
        console.log('Footer: No contact data received');
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
