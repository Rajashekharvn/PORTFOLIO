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

// small helper to create URL-friendly slugs from certificate names
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
  // Open the first certificate by default
  const defaultTabId = "cert-0";
  const defaultOpenTabs = [{ id: defaultTabId, cert: certificatesData[0] }];

  const [openTabs, setOpenTabs] = useState(() => defaultOpenTabs);
  const [activeTab, setActiveTab] = useState(() => defaultTabId);
  const [pageCounts, setPageCounts] = useState({});
  const [loadedPages, setLoadedPages] = useState({});
  const [renderError, setRenderError] = useState({});

  // responsive viewer sizing based on container, not window
  const [viewerWidth, setViewerWidth] = useState(820);
  const viewerHeight = 550;
  const viewerContainerRef = useRef(null);

  // refs for reveal animations
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const leftColRef = useRef(null);
  const viewerRef = useRef(null);

  // measure viewer container and keep width in sync
  useEffect(() => {
    const updateWidth = () => {
      const el = viewerContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.max(320, Math.min(900, rect.width)); // safe bounds
      setViewerWidth(w);
    };

    updateWidth();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateWidth);
      if (viewerContainerRef.current) {
        ro.observe(viewerContainerRef.current);
      }
    } else {
      window.addEventListener("resize", updateWidth);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // --- fallback timeout to avoid infinite 'Loading' state ---
  useEffect(() => {
    if (!activeTab) return;
    const t = setTimeout(() => {
      setLoadedPages((prev) => {
        if (!prev[activeTab] && !renderError[activeTab]) {
          console.warn(
            `[Certificates] PDF did not render in time for ${activeTab}, enabling iframe fallback.`
          );
          return { ...prev, [activeTab]: true };
        }
        return prev;
      });
    }, 8000); // 8 seconds

    return () => clearTimeout(t);
  }, [activeTab, renderError]);

  // --- Section entrance reveal: medium intensity (option 2) ---
  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !("IntersectionObserver" in window)) {
      // If no IO support, reveal immediately
      titleRef.current?.classList?.add("reveal--active");
      leftColRef.current?.classList?.add("reveal--active");
      viewerRef.current?.classList?.add("reveal--active");
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal the parts with a tiny stagger for feel
            setTimeout(() => titleRef.current?.classList?.add("reveal--active"), 0);
            setTimeout(() => leftColRef.current?.classList?.add("reveal--active"), 120);
            setTimeout(() => viewerRef.current?.classList?.add("reveal--active"), 220);
            observer.disconnect();
          }
        });
      },
      { root: null, threshold: 0.12 }
    );

    io.observe(root);

    return () => {
      try { io.disconnect(); } catch (e) { /* ignore */ }
    };
  }, []);

  const pushCertToUrl = (cert) => {
    try {
      const url = new URL(window.location.href);
      if (cert && cert.slug) {
        url.searchParams.set("cert", cert.slug);
      } else {
        url.searchParams.delete("cert");
      }
      window.history.replaceState(null, "", url.toString());
    } catch (e) {
      if (cert && cert.slug) {
        window.location.hash = `cert-${cert.slug}`;
      } else {
        window.location.hash = "";
      }
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
        return [...prev, { id: tabId, cert }];
      }
      setActiveTab(tabId);
      pushCertToUrl(cert);
      return prev;
    });

    setTimeout(() => {
      const preview = document.querySelector(".vscode-like-window");
      if (preview) {
        preview.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);
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

      setLoadedPages((lp) => {
        const c = { ...lp };
        delete c[tabId];
        return c;
      });
      setPageCounts((pc) => {
        const c = { ...pc };
        delete c[tabId];
        return c;
      });
      setRenderError((re) => {
        const c = { ...re };
        delete c[tabId];
        return c;
      });

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
    console.log(`[Certificates] Document loaded for ${tabId}, pages=${doc.numPages}`);
    setPageCounts((prev) => ({ ...prev, [tabId]: doc.numPages }));
  };

  const onDocumentLoadError = (tabId) => (err) => {
    console.error(`[Certificates] Document load error for ${tabId}:`, err);
    setRenderError((prev) => ({ ...prev, [tabId]: true }));
    setLoadedPages((prev) => ({ ...prev, [tabId]: true }));
  };

  const onPageRenderSuccess = (tabId) => () => {
    console.log(`[Certificates] Page render success for ${tabId}`);
    setLoadedPages((prev) => ({ ...prev, [tabId]: true }));
    setRenderError((prev) => ({ ...prev, [tabId]: false }));
  };

  const activeCert = openTabs.find((t) => t.id === activeTab)?.cert || null;

  return (
    <Container
      fluid
      className="about-section certificates-container"
      id="certificates"
      ref={sectionRef}
    >
      <Particle />

      <Container>
        <h1
          ref={titleRef}
          className="project-heading certificates-title reveal title-reveal"
        >
          My <strong className="purple violet-text">Certificates</strong>
        </h1>

        {/* upgraded layout: custom grid via CSS */}
        <Row
          className="cert-layout-row"
          style={{ justifyContent: "center", padding: "10px" }}
        >
          {/* Left column: smaller, clickable cards (initials reveal on hover) */}
          <Col
            xs={12}
            lg={3}
            className="mb-4 cert-col-left reveal left-reveal"
            ref={leftColRef}
          >
            <div className="cert-list">
              {certificatesData.map((cert, index) => {
                const initials = cert.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("");
                const tabId = `cert-${index}`;
                const isActive = activeTab === tabId;
                return (
                  <div
                    key={index}
                    className={`cert-card clickable-card hover-reveal ${
                      isActive ? "active" : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => openCertificate(cert, index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        openCertificate(cert, index);
                      }
                    }}
                    aria-label={`Open ${cert.name}`}
                  >
                    <div className="small-thumb" aria-hidden>
                      {/* initials (visible by default) */}
                      <span className="initials">{initials}</span>

                      {/* content that will slide in to replace initials on hover/focus */}
                      <div className="thumb-content" aria-hidden>
                        <div className="thumb-name" title={cert.name}>
                          {cert.name}
                        </div>
                        <div className="thumb-meta">
                          {cert.issuer} • {cert.year}
                        </div>
                      </div>
                    </div>

                    {/* semantic info for screen readers only */}
                    <div className="sr-only card-info">
                      <h6>{cert.name}</h6>
                      <p>
                        {cert.issuer} • {cert.year}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>

          {/* Right column: large viewer */}
          <Col xs={12} lg={9} className="mb-4 cert-col-right reveal right-reveal" ref={viewerRef}>
            <div className="vscode-like-window" style={{ minHeight: 460 }}>
              {/* Tab bar */}
              <div className="tab-bar">
                {openTabs.length === 0 && (
                  <div style={{ color: "#bda9e6", padding: "8px 16px" }}>
                    No open certificates — click any certificate to open
                  </div>
                )}
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      pushCertToUrl(tab.cert);
                    }}
                    className={`tab ${activeTab === tab.id ? "active" : ""}`}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background:
                        activeTab === tab.id
                          ? "rgba(192,132,245,0.12)"
                          : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 160,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.95rem",
                      }}
                    >
                      {tab.cert.name}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => closeTab(tab.id, e)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#c8b5e9",
                        cursor: "pointer",
                        padding: "0 6px",
                      }}
                      aria-label={`Close ${tab.cert.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Viewer */}
              <div
                className="viewer-area"
                style={{ padding: 16, background: "transparent", minHeight: 400 }}
              >
                {activeCert ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0, color: "#fff" }}>
                          {activeCert.name}
                        </h4>
                        <div style={{ color: "#bda9e6", fontSize: 14 }}>
                          {activeCert.issuer} • {activeCert.year}
                        </div>
                      </div>
                      <div className="cert-actions">
                        <button
                          className="cert-btn"
                          type="button"
                          onClick={() => handleDownload(activeCert)}
                        >
                          ⤓ Download
                        </button>
                        <button
                          className="cert-btn outline"
                          type="button"
                          onClick={() =>
                            window.open(activeCert.url, "_blank", "noopener")
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>

                    {/* viewer container measured for width */}
                    <div ref={viewerContainerRef} className="viewer-container">
                      <div className="viewer-inner">
                        {/* skeleton loader */}
                        {!loadedPages[activeTab] && !renderError[activeTab] && (
                          <div
                            className="skeleton"
                            style={{
                              width: "100%",
                              height: viewerHeight,
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid rgba(255,255,255,0.04)",
                            }}
                          >
                            <div style={{ color: "#bda9e6" }}>
                              Loading certificate…
                            </div>
                          </div>
                        )}

                        {/* PDF viewer */}
                        {!renderError[activeTab] && (
                          <div
                            style={{
                              width: "100%",
                              display: loadedPages[activeTab] ? "block" : "none",
                            }}
                          >
                            <Document
                              key={`${activeCert.url}-${activeTab}`}
                              file={activeCert.url}
                              onLoadSuccess={onDocumentLoadSuccess(activeTab)}
                              onLoadError={onDocumentLoadError(activeTab)}
                              loading={null}
                            >
                              <Page
                                pageNumber={1}
                                width={viewerWidth}
                                onRenderSuccess={onPageRenderSuccess(activeTab)}
                              />
                            </Document>

                            {pageCounts[activeTab] > 1 && (
                              <div style={{ marginTop: 8, color: "#bda9e6", fontSize: 13 }}>
                                Page 1 of {pageCounts[activeTab]}
                              </div>
                            )}
                          </div>
                        )}

                        {/* iframe fallback */}
                        {(renderError[activeTab] ||
                          (loadedPages[activeTab] && !pageCounts[activeTab])) && (
                          <iframe
                            src={activeCert.url}
                            title={activeCert.name}
                            style={{
                              width: "100%",
                              maxWidth: viewerWidth,
                              height: viewerHeight,
                              borderRadius: 12,
                              border: "1px solid rgba(255,255,255,0.04)",
                            }}
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
    </Container>
  );
}
