import React from "react";
import { Col, Row } from "react-bootstrap";
import { FaAws, FaCode } from "react-icons/fa"; // Using AWS and a generic code icon
import { DiJavascript1, DiPython, DiGit } from "react-icons/di";
import { SiHtml5, SiCss3 } from "react-icons/si";


function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons" data-name="JavaScript">
  <DiJavascript1 />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="HTML">
  <SiHtml5 />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="CSS">
  <SiCss3 />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="Python">
  <DiPython />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="Data Structures">
  <FaCode />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="Git">
  <DiGit />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="AWS">
  <FaAws />
</Col>

    </Row>
  );
}

export default Techstack;
