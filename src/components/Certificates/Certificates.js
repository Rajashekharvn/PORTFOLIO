// src/components/Certificates/Certificates.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Particle from "../Particle";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import certificate1 from "../../Assets/Certificate-1.pdf";
import certificate2 from "../../Assets/Certificate-2.pdf";
import certificate3 from "../../Assets/Certificate-3.pdf";
import certificate4 from "../../Assets/Certificate-4.pdf";

// configure pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const certificatesData = [
  { name: "Professional Certificate", url: certificate1, issuer: "Certification Authority", year: "2024" },
  { name: "Technical Certification", url: certificate2, issuer: "Tech Institute", year: "2024" },
  { name: "Advanced Certification", url: certificate3, issuer: "Advanced Academy", year: "2023" },
  { name: "Specialized Training", url: certificate4, issuer: "Training Institute", year: "2023" },
];

export default function Certificates() {
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [pageCounts, setPageCounts] = useState({});
  const [loadedPages, setLoadedPages] = useState({});
  const [renderError, setRenderError] = useState({});
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // open and focus cert
  const openCertificate = useCallback((cert, index) => {
    const tabId = `cert-${index}`;
    setRenderError((prev) => ({ ...prev, [tabId]: false }));
    setOpenTabs((prev) => {
      if (!prev.find((t) => t.id === tabId)) {
        setLoadedPages((p) => ({ ...p, [tabId]: false }));
        setActiveTab(tabId);
        return [...prev, { id: tabId, cert }];
      }
      setActiveTab(tabId);
      return prev;
    });

    setTimeout(() => {
      if (typeof document !== "undefined") {
        const preview = document.querySelector(".vscode-like-window");
        if (preview) preview.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);
  }, []);

  const closeTab = useCallback((tabId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setOpenTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === tabId);
      if (idx === -1) return prev;
      const newTabs = prev.filter((t) => t.id !== tabId);

      setActiveTab((cur) => {
        if (cur !== tabId) return cur;
        if (newTabs.length === 0) return null;
        const newIndex = idx - 1 >= 0 ? idx - 1 : 0;
        return newTabs[newIndex].id;
      });

      setLoadedPages((lp) => { const c = { ...lp }; delete c[tabId]; return c; });
      setPageCounts((pc) => { const c = { ...pc }; delete c[tabId]; return c; });
      setRenderError((re) => { const c = { ...re }; delete c[tabId]; return c; });

      return newTabs;
    });
  }, []);

  const handleDownload = useCallback((cert) => {
    const toDownload = cert || openTabs.find((t) => t.id === activeTab)?.cert;
    if (!toDownload || !toDownload.url) {
      alert("Certificate not available.");
      return;
    }
    if (typeof document === "undefined") return;
    const a = document.createElement("a");
    a.href = toDownload.url;
    a.download = `${toDownload.name.replace(/\s+/g, "_")}_Certificate.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [activeTab, openTabs]);

  const onDocumentLoadSuccess = (tabId) => (doc) => {
    try {
      setPageCounts((prev) => ({ ...prev, [tabId]: doc.numPages }));
    } catch {
      setPageCounts((prev) => ({ ...prev, [tabId]: 1 }));
    }
  };

  const onDocumentLoadError = (tabId) => (err) => {
    console.error("Document load error", tabId, err);
    setRenderError((prev) => ({ ...prev, [tabId]: true }));
  };

  const onPageRenderSuccess = (tabId) => () => {
    setLoadedPages((prev) => ({ ...prev, [tabId]: true }));
    setRenderError((prev) => ({ ...prev, [tabId]: false }));
  };

  const activeCert = openTabs.find((t) => t.id === activeTab)?.cert || null;
  const viewerWidth = Math.min(1000, Math.round(width * 0.65));
  const viewerHeight = 600;

  return (
    <Container fluid className="about-section certificates-container" id="certificates">
      <Particle />

      <Container>
        <h1 className="project-heading certificates-title">
          My <strong className="purple violet-text">Certificates</strong>
        </h1>

        <Row style={{ justifyContent: "center", padding: "10px" }}>
          {/* Left column: compact list (sticky & scrollable) */}
          <Col xs={12} lg={3} className="mb-4">
            <div className="cert-column" role="list" aria-label="Certificates list">
              {certificatesData.map((cert, index) => {
                const tabId = `cert-${index}`;
                const isActive = activeTab === tabId;
                return (
                  <div
                    key={tabId}
                    role="listitem"
                    className={`cert-card clickable-card ${isActive ? "active" : ""}`}
                    tabIndex={0}
                    onClick={() => openCertificate(cert, index)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openCertificate(cert, index); }}
                    aria-current={isActive ? "true" : "false"}
                    aria-label={`Open certificate: ${cert.name}`}
                  >
                    <div className="thumb small-thumb" aria-hidden>
                      {/* initials fallback */}
                      {cert.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </div>

                    <div className="cert-info">
                      <div className="cert-name" title={cert.name}>{cert.name}</div>
                      <div className="cert-meta">{cert.issuer} • {cert.year}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>

          {/* Right column: viewer */}
          <Col xs={12} lg={9} className="mb-4">
            <div className="vscode-like-window" style={{ borderRadius: 12, overflow: "hidden", minHeight: 460 }}>
              {/* Tab bar */}
              <div className="tab-bar" style={{ display: "flex", gap: 8, padding: 8, background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)", overflowX: "auto" }}>
                {openTabs.length === 0 && <div style={{ color: "#bda9e6", padding: "8px 16px" }}>No open certificates — click any certificate to open</div>}
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab ${activeTab === tab.id ? "active" : ""}`}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: activeTab === tab.id ? "rgba(192,132,245,0.12)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 160,
                    }}
                  >
                    <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.95rem" }} title={tab.cert.name}>
                      {tab.cert.name}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => closeTab(tab.id, e)}
                      style={{ background: "transparent", border: "none", color: "#c8b5e9", cursor: "pointer", padding: "0 6px" }}
                      aria-label={`Close ${tab.cert.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Viewer */}
              <div style={{ padding: 16, background: "transparent", minHeight: 400 }}>
                {activeCert ? (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <h4 style={{ margin: 0, color: "#fff" }}>{activeCert.name}</h4>
                        <div style={{ color: "#bda9e6", fontSize: 14 }}>{activeCert.issuer} • {activeCert.year}</div>
                      </div>
                      <Button variant="light" onClick={() => handleDownload(activeCert)}>Download</Button>
                    </div>

                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      {!loadedPages[activeTab] && !renderError[activeTab] && (
                        <div style={{ width: viewerWidth, height: viewerHeight, borderRadius: 12, background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(192,132,245,0.06) 50%, rgba(255,255,255,0.03) 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ color: "#bda9e6" }}>Loading certificate…</div>
                        </div>
                      )}

                      {!renderError[activeTab] && (
                        <div style={{ width: viewerWidth, maxWidth: "100%", display: loadedPages[activeTab] ? "block" : "none" }}>
                          <Document
                            key={`${activeCert.url}-${activeTab}`}
                            file={activeCert.url}
                            onLoadSuccess={onDocumentLoadSuccess(activeTab)}
                            onLoadError={onDocumentLoadError(activeTab)}
                            loading={null}
                          >
                            <Page pageNumber={1} width={viewerWidth} onRenderSuccess={onPageRenderSuccess(activeTab)} />
                          </Document>

                          {pageCounts[activeTab] > 1 && (
                            <div style={{ marginTop: 8, color: "#bda9e6", fontSize: 13 }}>Page 1 of {pageCounts[activeTab]}</div>
                          )}
                        </div>
                      )}

                      {renderError[activeTab] && (
                        <div style={{ width: viewerWidth }}>
                          <iframe src={activeCert.url} title={activeCert.name} style={{ width: "100%", height: viewerHeight, borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)" }} />
                          <div style={{ marginTop: 8, color: "#bda9e6", fontSize: 13 }}>Displayed via browser fallback. Use the Download button to get the PDF.</div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#bda9e6", paddingTop: 40 }}>
                    <h4 style={{ color: "#fff" }}>Certificate Explorer</h4>
                    <p>Select a certificate on the left to open it here for preview & download.</p>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        /* prevent particle canvas intercepting clicks */
        #tsparticles, canvas, .tsparticles-canvas-el { pointer-events: none !important; }
        .cert-card, .clickable-card { pointer-events: auto; outline: none; }

        .tab-bar::-webkit-scrollbar { height: 6px; }
        .tab-bar::-webkit-scrollbar-thumb { background: rgba(192,132,245,0.25); border-radius: 4px; }
      `}</style>
    </Container>
  );
}
