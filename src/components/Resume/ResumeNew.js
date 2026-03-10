import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import pdf from "../../Assets/RajashekharResume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./Resume.css";
import "./ResumeMobile.css";
import useScrollReveal from "../../hooks/useScrollReveal";
import Timeline from "../Timeline/Timeline";

import { getResume } from "../../supabase/database";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  useScrollReveal();

  const [width, setWidth] = useState(1200);
  const [resumeUrl, setResumeUrl] = useState(pdf); // Default to local PDF
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const resumeData = await getResume();
        if (resumeData && resumeData.url) {
          setResumeUrl(resumeData.url);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        // Keep using local PDF as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Container fluid className="resume-section fade-up">
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            style={{
              maxWidth: "250px",
              marginLeft: "10px",
              borderColor: "#c95bf5",
              color: "#c95bf5",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c95bf5";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#c95bf5";
            }}
            onClick={() => {
              const link = document.createElement("a");
              link.href = resumeUrl;
              link.download = "Rajashekhar_Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
        </Row>

        <Timeline />

        <Row className="resume d-flex flex-column align-items-center">
          {loading ? (
            <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>
              <h3>Loading resume...</h3>
            </div>
          ) : (
            <Document file={resumeUrl} className="d-flex flex-column align-items-center">
              {/* Page 1 */}
              <div style={{ marginBottom: "20px", width: "100%", display: "flex", justifyContent: "center" }}>
                <Page
                  pageNumber={1}
                  scale={width > 786 ? 1.7 : width > 480 ? 0.8 : 0.6}
                />
              </div>
              {/* Page 2 */}
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Page
                  pageNumber={2}
                  scale={width > 786 ? 1.7 : width > 480 ? 0.8 : 0.6}
                />
              </div>
            </Document>
          )}
        </Row>

        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            style={{
              maxWidth: "250px",
              marginLeft: "10px",
              borderColor: "#c95bf5",
              color: "#c95bf5",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c95bf5";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#c95bf5";
            }}
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdf;
              link.download = "Rajashekhar_Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
