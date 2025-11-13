import React from "react";
import { Col, Row } from "react-bootstrap";
import { FaAws, FaCode } from "react-icons/fa";
import { DiJavascript1, DiPython, DiGit } from "react-icons/di";
import { SiHtml5, SiCss3 } from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col className="tech-icons" data-name="JavaScript"><DiJavascript1 /></Col>
      <Col className="tech-icons" data-name="HTML5"><SiHtml5 /></Col>
      <Col className="tech-icons" data-name="CSS3"><SiCss3 /></Col>
      <Col className="tech-icons" data-name="Python"><DiPython /></Col>
      <Col className="tech-icons" data-name="Data Structures"><FaCode /></Col>
      <Col className="tech-icons" data-name="Git"><DiGit /></Col>
      <Col className="tech-icons" data-name="AWS"><FaAws /></Col>
    </Row>
  );
}

export default Techstack;
