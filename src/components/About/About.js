import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import SkillBar from "./SkillBar";
import useScrollReveal from "../../hooks/useScrollReveal";
import { getAboutData } from "../../supabase/database";
import { defaultAboutContent } from "../../utils/content";
import "./About.css";

function About() {
  useScrollReveal();
  const [content, setContent] = useState(defaultAboutContent);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getAboutData();
      if (data) {
        setContent({
          heading: data.heading,
          description: data.description,
          activities: data.activities || [],
          quote: data.quote,
          quoteAuthor: data.quote_author,
        });
      }
    };
    loadContent();
  }, []);

  return (
    <Container fluid className="about-section fade-up">
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px", minHeight: "100vh" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 className="about-heading">
              {content.heading.split("I'M")[0]} <strong className="purple">I'M</strong>
            </h1>
            <Aboutcard content={content} />
          </Col>
          <Col
            md={5}
            className="about-img"
          >
            <img
              src={laptopImg}
              alt="about"
              className="img-fluid"
            />
          </Col>
        </Row>
        <h1 className="project-heading skillset-heading">
          Professional <strong className="purple">Skillset </strong>
        </h1>

        <Techstack />

        <h1 className="project-heading">
          <strong className="purple">Tools</strong> I use
        </h1>
        <Toolstack />
        <SkillBar />
        <Github />
      </Container>
    </Container>
  );
}

export default About;
