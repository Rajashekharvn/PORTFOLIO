import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Home2 from "./Home2";
import Type from "./Type";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Home.css";
import "./HomeFix.css";

import useHomeContent from "../../hooks/useHomeContent";
import SEO from "../Common/SEO/SEO";

function Home() {
  useScrollReveal();
  const { content } = useHomeContent();

  return (
    <section>
      <SEO
        title="Full Stack Developer Portfolio"
        description="Explore the portfolio of Rajashekhar V N, a Full Stack Developer specializing in React.js, PHP, and modern web development. Discover innovative projects and technical expertise."
        keywords="Rajashekhar V N, Portfolio, Full Stack Developer, React.js, Node.js, Springboot, RestAPI, Web Development, Software Engineer"
      />
      <Container fluid className="home-section fade-up" id="home">
        <Container className="home-content">
          <Row className="align-items-center">
            <Col md={7} xs={12} className="home-header">
              <h1 className="heading">
                {content.heading}{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h2 className="heading-name">
                I'M
                <strong className="main-name"> {content.name}</strong>
              </h2>

              <div className="type-wrapper">
                <Type />
              </div>
            </Col>

            <Col md={5} xs={12} className="home-image-col">
              <img
                src={content.mainImgUrl || homeLogo}
                alt="Rajashekhar - Full Stack Developer Illustration"
                className="img-fluid float-animation"
                style={{ maxHeight: "450px" }}
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
