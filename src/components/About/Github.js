import React from "react";
import { Row } from "react-bootstrap";

function Github() {
  return (
    <Row
      style={{
        justifyContent: "center",
        paddingBottom: "30px",
        position: "relative",
      }}
    >
      <h1
        className="project-heading"
        style={{
          paddingBottom: "20px",
          zIndex: 1,
          position: "relative",
        }}
      >
        My <strong className="purple">Coding Journey</strong> 🐍
      </h1>

      {/* Snake Animation */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img
          src="https://raw.githubusercontent.com/Rajashekharvn/Rajashekharvn/output/github-snake-dark.svg"
          alt="GitHub contribution snake animation"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(192, 132, 245, 0.4)",
          }}
        />
      </div>
    </Row>
  );
}

export default Github;
