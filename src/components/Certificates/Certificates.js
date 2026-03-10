import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import {
  FaDownload,
  FaExpand,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus
} from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import useScrollReveal from "../../hooks/useScrollReveal";
import { getCertificates } from "../../supabase/database";
import SEO from "../Common/SEO/SEO";
import "./Certificates.css";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Certificates() {
  useScrollReveal();

  const [certificatesData, setCertificatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // PDF Viewer State
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);

  // ✅ Fetch & SORT certificates (Latest First)
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certs = await getCertificates();
        if (certs && certs.length > 0) {
          const sortedCerts = [...certs].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setCertificatesData(sortedCerts);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleViewCertificate = (cert) => {
    setSelectedCert(cert);
    setScale(1.0);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCert(null);
    setNumPages(null);
    setScale(1.0);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const handleDownload = (cert) => {
    const link = document.createElement("a");
    link.href = cert.img_path;
    link.download = `${cert.title.replace(/\s+/g, "_")}_Certificate`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPdf = (url) =>
    url && (url.toLowerCase().endsWith(".pdf") || url.includes(".pdf?"));

  return (
    <Container fluid className="certificates-section fade-up" id="certificates">
      <SEO
        title="Certifications & Achievements"
        description="View professional certifications and academic achievements earned by Rajashekhar V N. A collection of credentials in React, PHP, and other modern technologies."
        url="/Certificates"
      />
      <Container>
        <h1 className="project-heading">
          My <strong className="purple">Certificates</strong>
        </h1>
        <p className="certificates-subtitle">
          Professional certifications and achievements
        </p>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading certificates...</p>
          </div>
        ) : certificatesData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <h4>No Certificates Yet</h4>
            <p>Certificates will appear here once added</p>
          </div>
        ) : (
          <Row className="certificate-grid">
            {certificatesData.map((cert, index) => (
              <Col
                md={6}
                lg={4}
                xs={12}
                key={cert.id || index}
                className="certificate-col"
              >
                <Card className="certificate-card">
                  <div className="certificate-image-wrapper">
                    {isPdf(cert.img_path) ? (
                      <div className="pdf-preview-container">
                        <Document
                          file={cert.img_path}
                          loading={<div className="pdf-loading">Loading PDF...</div>}
                          error={<div className="pdf-error">Failed to load PDF</div>}
                          className="pdf-document"
                        >
                          <Page
                            pageNumber={1}
                            width={400}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="pdf-page"
                          />
                        </Document>
                      </div>
                    ) : (
                      <Card.Img
                        variant="top"
                        src={cert.img_path}
                        alt={`Certificate for ${cert.title} issued by ${cert.issuer}`}
                        className="certificate-image"
                        loading="lazy"
                      />
                    )}

                    <div className="certificate-overlay">
                      <Button
                        variant="light"
                        className="action-btn view-btn"
                        onClick={() => handleViewCertificate(cert)}
                      >
                        <FaExpand /> View
                      </Button>
                      <Button
                        variant="light"
                        className="action-btn download-btn"
                        onClick={() => handleDownload(cert)}
                      >
                        <FaDownload /> Download
                      </Button>
                    </div>
                  </div>

                  <Card.Body className="certificate-body">
                    <Card.Title className="certificate-title">
                      {cert.title}
                    </Card.Title>
                    <div className="certificate-meta">
                      <span className="certificate-issuer">{cert.issuer}</span>
                      <span className="meta-separator">•</span>
                      <span className="certificate-date">
                        {new Date(cert.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short"
                        })}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* ✅ Full-Screen Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        centered
        className="certificate-modal"
        dialogClassName="modal-90w"
      >
        <Modal.Header className="modal-header-custom">
          <div className="modal-title-section">
            <Modal.Title>{selectedCert?.title}</Modal.Title>
            <div className="modal-meta">
              <span>{selectedCert?.issuer}</span>
              <span className="meta-separator">•</span>
              <span>
                {selectedCert &&
                  new Date(selectedCert.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline-light"
              className="modal-download-btn"
              onClick={() =>
                selectedCert && handleDownload(selectedCert)
              }
            >
              <FaDownload /> Download
            </Button>
            <Button
              variant="outline-light"
              className="modal-close-btn"
              onClick={handleCloseModal}
            >
              <FaTimes />
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body className="modal-body-custom">
          {selectedCert &&
            (isPdf(selectedCert.img_path) ? (
              <div className="pdf-modal-wrapper">
                <div className="pdf-controls">
                  <div className="pdf-zoom-controls">
                    <button
                      onClick={zoomOut}
                      disabled={scale <= 0.5}
                      className="control-btn"
                    >
                      <FaSearchMinus />
                    </button>
                    <span className="zoom-level">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={zoomIn}
                      disabled={scale >= 3}
                      className="control-btn"
                    >
                      <FaSearchPlus />
                    </button>
                  </div>

                  {numPages && (
                    <div className="pdf-page-info">
                      {numPages} Page{numPages > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div className="pdf-modal-viewer">
                  <Document
                    file={selectedCert.img_path}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="pdf-loading-spinner">
                        Loading PDF...
                      </div>
                    }
                  >
                    {Array.from(
                      new Array(numPages),
                      (_, index) => (
                        <Page
                          key={index}
                          pageNumber={index + 1}
                          scale={scale}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="mb-3"
                        />
                      )
                    )}
                  </Document>
                </div>
              </div>
            ) : (
              <img
                src={selectedCert.img_path}
                alt={selectedCert.title}
                className="modal-certificate-image"
              />
            ))}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
