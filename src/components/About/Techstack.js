import React from "react";
import { Col, Row } from "react-bootstrap";
import { FaAngular, FaAws, FaDocker, FaCode } from "react-icons/fa"; // Added FaCode for Data Structures
import { DiJavascript1, DiReact, DiPython, DiGit } from "react-icons/di";
import { SiKubernetes, SiPostgresql, SiTypescript, SiHtml5, SiCss3 } from "react-icons/si"; // Added SiHtml5 and SiCss3


function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <DiJavascript1 /> {/* JavaScript */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiHtml5 /> {/* HTML */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiCss3 /> {/* CSS */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiPython /> {/* Python */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaCode /> {/* Data Structures */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiGit /> {/* Git */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaAws /> {/* AWS */}
      </Col>
    </Row>
  );
}

export default Techstack;
