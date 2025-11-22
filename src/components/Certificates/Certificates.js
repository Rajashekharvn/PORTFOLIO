// src/components/Certificates/Certificates.jsx
import React, { useEffect, useState } from "react";
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
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    // ensure worker is set (helps with HMR too)
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);

    // when mount, read URL param to auto-open a certificate if provided
    try {
      const params = new URLSearchParams(window.location.search);
      const certParam = params.get("cert");
      if (certParam) {
        const foundIndex = certificatesData.findIndex((c) => c.slug === certParam);
        if (foundIndex !== -1) {
          // open that certificate and set it as active
          const tabId = `cert-${foundIndex}`;
          setOpenTabs([{ id: tabId, cert: certificatesData[foundIndex] }]);
          setActiveTab(tabId);
          // mark loadedPages false until rendered
          setLoadedPages((p) => ({ ...p, [tabId]: false }));
        }
      }
    } catch (e) {
      // ignore URL parse errors
    }

    return () => window.removeEventListener("resize", onResize);
  }, []);

  // --- NEW: fallback timeout to avoid infinite 'Loading' state ---
  useEffect(() => {
    // If nothing loads for the active tab within 8s, show iframe fallback
    if (!activeTab) return;
    const t = setTimeout(() => {
      setLoadedPages((prev) => {
        if (!prev[activeTab] && !renderError[activeTab]) {
          // mark as "loaded" so the UI switches from skeleton -> viewer (iframe will render)
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
      if (preview) preview.scrollIntoView({ behavior: "smooth", block: "center" });
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
    setPageCounts((prev) => ({ ...prev, [tabId]: doc.numPages }));
  };

  const onDocumentLoadError = (tabId) => (err) => {
    setRenderError((prev) => ({ ...prev, [tabId]: true }));
    setLoadedPages((prev) => ({ ...prev, [tabId]: true }));
  };

  const onPageRenderSuccess = (tabId) => () => {
    setLoadedPages((prev) => ({ ...prev, [tabId]: true }));
    setRenderError((prev) => ({ ...prev, false }));
  };

  const activeCert = openTabs.find((t) => t.id === activeTab)?.cert || null;
  const viewerWidth = Math.min(850, Math.round(width * 0.85));
  const viewerHeight = 550;

  return (
    <Container fluid className="about-section certificates-container" id="certificates">
      <Particle />

      <Container>
        <h1 className="project-heading certificates-title">
          My <strong className="purple violet-text">Certificates</strong>
        </h1>

        <Row style={{ justifyContent: "center", padding: "10px" }}>
          {/* Left column: smaller, clickable cards */}
          <Col xs={12} lg={3} className="mb-4">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      openCertificate(cert, index)
                    }
                    style={{ cursor: "pointer", width: "100%" }}
                    aria-label={`Open ${cert.name}`}
                  >
                    <div className="small-thumb" aria-hidden>
                      <span className="initials">{initials}</span>

                      <div className="thumb-content" aria-hidden>
                        <div className="thumb-name" title={cert.name}>
                          {cert.name}
                        </div>
                        <div className="thumb-meta">
                          {cert.issuer} • {cert.year}
                        </div>
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

          {/* Right column viewer */}
          <Col xs={12} lg={9} className="mb-4">
            <div className="vscode-like-window" style={{ borderRadius: 12, overflow: "hidden", minHeight: 460 }}>
              <div className="tab-bar" style={{ display: "flex", gap: 8, padding: 8, background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)", overflowX: "auto" }}>
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
                    <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.95rem" }}>
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

              <div style={{ padding: 16, background: "transparent", minHeight: 400 }}>
                {activeCert ? (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <h4 style={{ margin: 0, color: "#fff" }}>{activeCert.name}</h4>
                        <div style={{ color: "#bda9e6", fontSize: 14 }}>
                          {activeCert.issuer} • {activeCert.year}
                        </div>
                      </div>
                      <Button variant="light" onClick={() => handleDownload(activeCert)}>
                        Download
                      </Button>
                    </div>

                    <div style={{ flex: 1, display: "flex", alignItems: "center", justify-content: "center", position: "relative" }}>
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
                            <div style={{ marginTop: 8, color: "#bda9e6", fontSize: 13 }}>
                              Page 1 of {pageCounts[activeTab]}
                            </div>
                          )}
                        </div>
                      )}

                      {(renderError[activeTab] ||
                        (loadedPages[activeTab] && !pageCounts[activeTab])) && (
                        <iframe
                          src={activeCert.url}
                          title={activeCert.name}
                          style={{
                            width: viewerWidth,
                            height: viewerHeight,
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        />
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
        /* MAKE SURE particle canvas doesn't intercept clicks */
        #tsparticles, canvas, .tsparticles-canvas-el {
          pointer-events: none !important;
        }

        .cert-card, .clickable-card {
          pointer-events: auto;
        }

        .cert-card {
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(192,132,245,0.12);
          border-radius: 10px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .cert-card:hover { transform: translateY(-2px); }

        .small-thumb {
          height: 80px;
          width: 100%;
          border-radius: 8px;
          background: linear-gradient(135deg, #7e22ce, #c084f5);
          display:flex; align-items:center; justify-content:center;
          color:#fff; font-weight:700; font-size:1rem; margin-bottom:0.7rem;
          position: relative;
          overflow: hidden;
        }

        .tab-bar::-webkit-scrollbar { height: 6px; }
        .tab-bar::-webkit-scrollbar-thumb { background: rgba(192,132,245,0.25); border-radius: 4px; }

        .small-thumb .initials {
          display: inline-block;
          transition: transform 260ms cubic-bezier(.2,.9,.2,1), opacity 260ms cubic-bezier(.2,.9,.2,1);
          will-change: transform, opacity;
          font-size: 1.05rem;
          letter-spacing: 1px;
        }

        .small-thumb .thumb-content {
          position: absolute;
          left: 10px;
          right: 10px;
          top: 50%;
          transform: translateY(8px);
          opacity: 0;
          text-align: center;
          transition: transform 260ms cubic-bezier(.2,.9,.2,1), opacity 260ms cubic-bezier(.2,.9,.2,1);
          color: #ffffff;
          pointer-events: none;
        }

        .small-thumb .thumb-name {
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.1;
        }

        .small-thumb .thumb-meta {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.85);
          margin-top: 4px;
        }

        .hover-reveal:hover .small-thumb .initials,
        .hover-reveal:focus-within .small-thumb .initials {
          opacity: 0;
          transform: translateY(-6px);
        }
        .hover-reveal:hover .small-thumb .thumb-content,
        .hover-reveal:focus-within .small-thumb .thumb-content {
          opacity: 1;
          transform: translateY(-50%);
        }

        .sr-only.card-info {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
      `}</style>
    </Container>
  );
}
