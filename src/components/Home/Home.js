import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Home2 from "./Home2";
import Type from "./Type";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Home.css";
import "./HomeFix.css";

import useHomeContent from "../../hooks/useHomeContent";
import "./Home.css";
import "./HomeFix.css";

function Home() {
  useScrollReveal();
  const { content } = useHomeContent();

  return (
    <section>
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

              <h1 className="heading-name">
                I'M
                <strong className="main-name"> {content.name}</strong>
              </h1>

              <div className="type-wrapper">
                <Type />
              </div>
            </Col>

            <Col md={5} xs={12} className="home-image-col">
              <img
                src={content.mainImgUrl || homeLogo}
                alt="home pic"
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
