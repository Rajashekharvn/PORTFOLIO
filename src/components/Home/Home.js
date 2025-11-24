import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Home2 from "./Home2";
import Type from "./Type";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./Home.css"; // 1. Import the CSS file

function Home() {
  useScrollReveal();

  return (
    <section>
      <Container fluid className="home-section fade-up" id="home">
        <Container className="home-content">
          <Row className="align-items-center">
            <Col md={7} className="home-header">
              <h1 className="heading">
                Hi There!{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="heading-name">
                I'M
                <strong className="main-name"> RAJASHEKHAR V N</strong>
              </h1>

              <div className="type-wrapper">
                <Type />
              </div>
            </Col>

            <Col md={5} className="home-image-col">
              <img
                src={homeLogo}
                alt="home pic"
                // 2. Add the "floating" class name
                className="img-fluid floating"
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <div className="fade-up">
        <Home2 />
      </div>
    </section>
  );
}

export default Home;
