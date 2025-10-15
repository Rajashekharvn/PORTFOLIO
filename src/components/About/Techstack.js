import React from "react";
import { Col, Row } from "react-bootstrap";
import { FaAws, FaCode } from "react-icons/fa"; // Using AWS and a generic code icon
import { DiJavascript1, DiPython, DiGit } from "react-icons/di";
import { SiHtml5, SiCss3 } from "react-icons/si";


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
