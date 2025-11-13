import React from "react";
import { Col, Row } from "react-bootstrap";
import { SiVisualstudiocode, SiVercel, SiWindows, SiNetlify } from "react-icons/si";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col className="tech-icons" data-name="Windows"><SiWindows /></Col>
      <Col className="tech-icons" data-name="VS Code"><SiVisualstudiocode /></Col>
      <Col className="tech-icons" data-name="Vercel"><SiVercel /></Col>
      <Col className="tech-icons" data-name="Netlify"><SiNetlify /></Col>
    </Row>
  );
}

export default Toolstack;
