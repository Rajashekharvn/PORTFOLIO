/**
 * NotFound route component (404 page).
 * 
 * Displays a friendly message for unknown routes and provides a link back to
 * the home page.
 */
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

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
            <h1 className="project-heading">Page Not Found</h1>
            <p style={{ color: "#ddd", marginTop: 10 }}>
              The page you’re looking for doesn’t exist or may have been moved.
            </p>
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
