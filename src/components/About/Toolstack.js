import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiVercel,
  SiWindows,
  SiNetlify,
} from "react-icons/si"; // Selected tools

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons" data-name="Windows">
  <SiWindows />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="VS Code">
  <SiVisualstudiocode />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="Vercel">
  <SiVercel />
</Col>

<Col xs={4} md={2} className="tech-icons" data-name="Netlify">
  <SiNetlify />
</Col>

    </Row>
  );
}

export default Toolstack;
