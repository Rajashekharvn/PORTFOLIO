import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import sticker from "../../Assets/404_developer_avatar.png";

function NotFound() {
  // Set a descriptive document title for the 404 page
  useEffect(() => {
    document.title = "404 Not Found | Portfolio";
  }, []);

  return (
    <Container fluid className="project-section" style={{ minHeight: "60vh", paddingTop: "120px" }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <img
              src={sticker}
              alt="404 Not Found"
              className="img-fluid"
              style={{ maxHeight: "300px", marginBottom: "20px" }}
            />
            <div style={{ marginTop: 20 }}>
              <Link to="/" className="btn btn-primary btn-sm">
                Go to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default NotFound;
