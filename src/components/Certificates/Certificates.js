// src/components/Certificates/Certificates.jsx
import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import certificate1 from "../../Assets/Certificate-1.pdf";
import certificate2 from "../../Assets/Certificate-2.pdf";
import certificate3 from "../../Assets/Certificate-3.pdf";
import certificate4 from "../../Assets/Certificate-4.pdf";

// configure pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// helper to create url-friendly slugs
const slugify = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const certificatesData = [
  { name: "Professional Certificate", url: certificate1, issuer: "Certification Authority", year: "2024" },
  { name: "Technical Certification", url: certificate2, issuer: "Tech Institute", year: "2024" },
  { name: "Advanced Certification", url: certificate3, issuer: "Advanced Academy", year: "2023" },
  { name: "Specialized Training", url: certificate4, issuer: "Training Institute", year: "2023" },
].map((c) => ({ ...c, slug: slugify(c.name) }));

export default function Certificates() {
  const defaultTabId = "cert-0";
  const defaultOpenTabs = [{ id: defaultTabId, cert: certificatesData[0] }];

  const [openTabs, setOpenTabs] = useState(() => defaultOpenTabs);
  const [activeTab, setActiveTab] = useState(() => defaultTabId);
  const [pageCounts, setPageCounts] = useState({});
  const [loadedPages, setLoadedPages] = useState({});
  const [renderError, setRenderError] = useState({});
  const [viewerWidth, setViewerWidth] = useState(800); // measured container width (px)
  const [viewerHeight, setViewerHeight] = useState(560);

  const tabListRef = useRef(null);
  const viewerContainerRef = useRef(null); // measure this to size viewer
  const viewerRef = useRef(null);

  // initial mount: set worker & parse URL param, attach resize observers
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    // parse cert param on mount
    try {
      const params = new URLSearchParams(window.location.search);
      const certParam = params.get("cert");
      if (certParam) {
        const foundIndex = certificatesData.findIndex((c) => c.slug === certParam);
        if (foundIndex !== -1) {
          const tabId = `cert-${foundIndex}`;
          setOpenTabs([{ id: tabId, cert: certificatesData[foundIndex] }]);
          setActiveTab(tabId);
          setLoadedPages((p) => ({ ...p, [tabId]: false }));
        }
      }
    } catch (e) {
      // ignore
    }

    return () => {
      // nothing to cleanup here (resize handled separately)
    };
  }, []);

  // Measure viewer container and update viewerWidth; use ResizeObserver if available
  useEffect(() => {
    const el = viewerContainerRef.current;
    if (!el) {
      // fallback to window-based calculation
      const fallback = () => {
        const w = Math.max(320, Math.min(920, Math.round(window.innerWidth * 0.82)));
        setViewerWidth(w);
      };
      fallback();
      window.addEventListener("resize", fallback);
      return () => window.removeEventListener("resize", fallback);
    }

    // function to compute target width with safe padding
    const compute = () => {
      const containerWidth = el.clientWidth || el.getBoundingClientRect().width || window.innerWidth;
      // Leave a small horizontal padding (32px) so the viewer never touches edges
      const safeWidth = Math.max(320, Math.min(920, Math.round(containerWidth - 32)));
      setViewerWidth(safeWidth);
    };

    compute(); // initial
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        compute();
      });
      ro.observe(el);
    } else {
      // fallback
      window.addEventListener("resize", compute);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", compute);
    };
  }, [viewerContainerRef.current]);

  // fallback timeout to avoid infinite loading
  useEffect(() => {
    if (!activeTab) return;
    const t = setTimeout(() => {
      setLoadedPages((prev) => {
        if (!prev[activeTab] && !renderError[activeTab]) {
          return { ...prev, [activeTab]: true };
        }
        return prev;
      });
    }, 8000);
    return () => clearTimeout(t);
  }, [activeTab, renderError]);

  const pushCertToUrl = (cert) => {
    try {
      const url = new URL(window.location.href);
      if (cert && cert.slug) url.searchParams.set("cert", cert.slug);
      else url.searchParams.delete("cert");
      window.history.replaceState(null, "", url.toString());
    } catch (e) {
      if (cert && cert.slug) window.location.hash = `cert-${cert.slug}`;
      else window.location.hash = "";
    }
  };

  const openCertificate = (cert, index) => {
    const tabId = `cert-${index}`;
    setRenderError((prev) => ({ ...prev, [tabId]: false }));
    setOpenTabs((prev) => {
      if (!prev.find((t) => t.id === tabId)) {
        setLoadedPages((p) => ({ ...p, [tabId]: false }));
        setActiveTab(tabId);
        pushCertToUrl(cert);
        setTimeout(() => viewerRef.current?.focus(), 120);
        return [...prev, { id: tabId, cert }];
      }
      setActiveTab(tabId);
      pushCertToUrl(cert);
      setTimeout(() => viewerRef.current?.focus(), 120);
      return prev;
    });
  };

  const closeTab = (tabId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setOpenTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === tabId);
      if (idx === -1) return prev;
      const newTabs = prev.filter((t) => t.id !== tabId);

      setActiveTab((cur) => {
        if (cur !== tabId) return cur;
        if (newTabs.length === 0) {
          pushCertToUrl(null);
          return null;
        }
        const newIndex = idx - 1 >= 0 ? idx - 1 : 0;
        pushCertToUrl(newTabs[newIndex].cert);
        return newTabs[newIndex].id;
      });

      // cleanup states
      setLoadedPages((lp) => { const c = { ...lp }; delete c[tabId]; return c; });
      setPageCounts((pc) => { const c = { ...pc }; delete c[tabId]; return c; });
      setRenderError((re) => { const c = { ...re }; delete c[tabId]; return c; });

      return newTabs;
    });
  };

  const handleDownload = (cert) => {
    const toDownload = cert || openTabs.find((t) => t.id === activeTab)?.cert;
    if (!toDownload || !toDownload.url) {
      alert("Certificate not available.");
      return;
    }
    const a = document.createElement("a");
    a.href = toDownload.url;
    a.download = `${toDownload.name.replace(/\s+/g, "_")}_Certificate.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onDocumentLoadSuccess = (tabId) => (doc) => {
    setPageCounts((prev) => ({ ...prev, [tabId]: doc.numPages }));
  };

  const onDocumentLoadError = (tabId) => (err) => {
    console.error(`[Certificates] Document load error for ${tabId}:`, err);
    setRenderError((prev) => ({ ...prev, [tabId]: true }));
    setLoadedPages((prev) => ({ ...prev, [tabId]: true }));
  };

  const onPageRenderSuccess = (tabId) => () => {
    setLoadedPages((prev) => ({ ...prev, [tabId]: true }));
    setRenderError((prev) => ({ ...prev, [tabId]: false }));
  };

  const activeCert = openTabs.find((t) => t.id === activeTab)?.cert || null;

  // keyboard navigation for tabs
  const handleTabKey = (e, idx) => {
    const count = openTabs.length;
    if (count <= 1) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % count;
      setActiveTab(openTabs[next].id);
      pushCertToUrl(openTabs[next].cert);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (idx - 1 + count) % count;
      setActiveTab(openTabs[prev].id);
      pushCertToUrl(openTabs[prev].cert);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveTab(openTabs[0].id);
      pushCertToUrl(openTabs[0].cert);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveTab(openTabs[count - 1].id);
      pushCertToUrl(openTabs[count - 1].cert);
    }
  };

  return (
    <Container fluid className="about-section certificates-container" id="certificates">
      <Particle />

      <Container>
        <h1 className="project-heading certificates-title">
          My <strong className="purple violet-text">Certificates</strong>
        </h1>

        <Row className="cert-row-wrapper" style={{ justifyContent: "center", padding: 8 }}>
          <Col xs={12} lg={3} className="mb-4">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {certificatesData.map((cert, index) => {
                const initials = cert.name.split(" ").slice(0, 2).map((w) => w[0]).join("");
                const tabId = `cert-${index}`;
                const isActive = activeTab === tabId;
                return (
                  <div
                    key={tabId}
                    className={`cert-card clickable-card hover-reveal ${isActive ? "active" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => openCertificate(cert, index)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openCertificate(cert, index); }}
                    aria-label={`Open ${cert.name}`}
                  >
                    <div className="small-thumb" aria-hidden>
                      <span className="initials">{initials}</span>
                      <div className="thumb-content" aria-hidden>
                        <div className="thumb-name" title={cert.name}>{cert.name}</div>
                        <div className="thumb-meta">{cert.issuer} • {cert.year}</div>
                      </div>
                    </div>

                    <div className="sr-only card-info">
                      <h6>{cert.name}</h6>
                      <p>{cert.issuer} • {cert.year}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>

          <Col xs={12} lg={9} className="mb-4">
            <div className="vscode-like-window" style={{ minHeight: 460 }}>
              <div
                className="tab-bar"
                role="tablist"
                aria-label="Open certificates tabs"
                ref={tabListRef}
                style={{ display: "flex", gap: 8, padding: 8, background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)", overflowX: "auto" }}
              >
                {openTabs.length === 0 && (
                  <div style={{ color: "#bda9e6", padding: "8px 16px" }}>
                    No open certificates — click any certificate to open
                  </div>
                )}

                {openTabs.map((tab, idx) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <div
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`viewer-${tab.id}`}
                      tabIndex={0}
                      onClick={() => { setActiveTab(tab.id); pushCertToUrl(tab.cert); }}
                      onKeyDown={(e) => handleTabKey(e, idx)}
                      className={`tab ${isActive ? "active" : ""}`}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: isActive ? "rgba(192,132,245,0.12)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 160,
                      }}
                    >
                      <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.95rem" }}>
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
                  );
                })}
              </div>

              <div className="viewer-area" style={{ padding: 16, minHeight: 400 }}>
                {activeCert ? (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div className="viewer-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <h4 style={{ margin: 0, color: "#fff" }}>{activeCert.name}</h4>
                        <div style={{ color: "#bda9e6", fontSize: 14 }}>{activeCert.issuer} • {activeCert.year}</div>
                      </div>

                      <div className="cert-actions" style={{ marginLeft: 12 }}>
                        <button className="cert-btn" onClick={() => handleDownload(activeCert)} aria-label="Download certificate">
                          ⤓ Download
                        </button>

                        <a
                          className="outline button"
                          href={activeCert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open certificate in new tab"
                        >
                          View
                        </a>
                      </div>
                    </div>

                    {/* viewer container that we measure */}
                    <div
                      ref={viewerContainerRef}
                      className="viewer-container"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%" }}
                    >
                      <div ref={viewerRef} tabIndex={-1} style={{ width: "100%", maxWidth: viewerWidth }}>
                        {/* skeleton loader */}
                        {!loadedPages[activeTab] && !renderError[activeTab] && (
                          <div className="skeleton" style={{ width: "100%", height: viewerHeight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ color: "#bda9e6" }}>Loading certificate…</div>
                          </div>
                        )}

                        {/* react-pdf viewer (hidden until loadedPages true) */}
                        {!renderError[activeTab] && (
                          <div style={{ width: "100%", display: loadedPages[activeTab] ? "block" : "none" }}>
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

                        {/* iframe fallback (uses responsive width) */}
                        {(renderError[activeTab] || (loadedPages[activeTab] && !pageCounts[activeTab])) && (
                          <iframe
                            src={activeCert.url}
                            title={activeCert.name}
                            style={{ width: "100%", maxWidth: viewerWidth, height: viewerHeight, borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)" }}
                          />
                        )}
                      </div>
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

      {/* small inline styles to ensure clicks reach cards */}
      <style>{`
        #tsparticles, canvas, .tsparticles-canvas-el { pointer-events: none !important; }
        .cert-card, .clickable-card { pointer-events: auto; }
        .tab-bar::-webkit-scrollbar { height: 6px; }
        .tab-bar::-webkit-scrollbar-thumb { background: rgba(192,132,245,0.25); border-radius: 4px; }
      `}</style>
    </Container>
  );
}
