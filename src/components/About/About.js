import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import SkillBar from "./SkillBar";
import useScrollReveal from "../../hooks/useScrollReveal";
import { getAboutData } from "../../supabase/database";
import { defaultAboutContent } from "../../utils/content";
import SEO from "../Common/SEO/SEO";
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
      <SEO
        title="About"
        description="Learn more about Rajashekhar, a Full Stack Developer passionate about building robust and scalable web applications."
        url="about"
      />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px", minHeight: "100vh" }}>
          <Col
            md={7}
            xs={12}
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
            xs={12}
            className="about-img"
          >
            <img
              src={laptopImg}
              alt="Rajashekhar working on laptop"
              className="img-fluid"
            />
          </Col>
        </Row>
        <h2 className="project-heading skillset-heading">
          Professional <strong className="purple">Skillset </strong>
        </h2>

        <Techstack />

        <h2 className="project-heading">
          <strong className="purple">Tools</strong> I use
        </h2>
        <Toolstack />
        <SkillBar />
        <Github />
      </Container>
    </Container>
  );
}

export default About;
