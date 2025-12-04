import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Home2 from "./Home2";
import Type from "./Type";
import useScrollReveal from "../../hooks/useScrollReveal";
import { getHomeData } from "../../supabase/database";
import { defaultHomeContent } from "../../utils/content";
import "./Home.css";
import "./HomeFix.css";

function Home() {
  useScrollReveal();
  const [content, setContent] = useState(defaultHomeContent);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getHomeData();
      if (data) {
        setContent({
          heading: data.heading,
          name: data.name,
          introTitle: data.intro_title,
          introBody: data.intro_body,
          githubLink: data.github_link,
          linkedinLink: data.linkedin_link,
          instagramLink: data.instagram_link,
        });
      }
    };
    loadContent();
  }, []);

  return (
    <section>
      <Container fluid className="home-section fade-up" id="home">
        <Container className="home-content">
          <Row className="align-items-center">
            <Col md={7} className="home-header">
              <h1 className="heading">
                {content.heading}{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="heading-name">
                I'M
                <strong className="main-name"> {content.name}</strong>
              </h1>

              <div className="type-wrapper">
                <Type />
              </div>
            </Col>

            <Col md={5} className="home-image-col">
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid float-animation"
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <div className="fade-up">
        <Home2 content={content} />
      </div>
    </section>
  );
}

export default Home;
