import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Particle from "../Particle"; // Importing background particles

const Certificates = () => {
	const certificates = [
		{
			name: "React Course",
			url: "#", // Replace with actual certificate URL or PDF
			issuer: "Frontend Academy",
			year: "2024",
		},
		{
			name: "JavaScript Mastery",
			url: "#", // Replace with actual certificate URL or PDF
			issuer: "JS Institute",
			year: "2023",
		},
		{
			name: "Python Certification",
			url: "#", // Replace with actual certificate URL or PDF
			issuer: "Py School",
			year: "2022",
		},
	];

	const handleView = (cert) => {
		if (cert.url && cert.url !== "#") {
			window.open(cert.url, '_blank', 'noopener,noreferrer');
		} else {
			// Show alert or message that certificate is not available
			alert(`${cert.name} certificate is not available at the moment.`);
		}
	};

	const handleDownload = (cert) => {
		if (cert.url && cert.url !== "#") {
			const link = document.createElement('a');
			link.href = cert.url;
			link.download = `${cert.name.replace(/\s+/g, '_')}_Certificate.pdf`;
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			// Show alert or message that certificate is not available for download
			alert(`${cert.name} certificate download is not available at the moment.`);
		}
	};

	return (
		<Container fluid className="certificates-section" id="certificates" aria-label="Certificates section">
			<Particle /> {/* Adding background animation */}

			<style>{`
				/* Page and certificates styling */
				.certificates-section {
					min-height: calc(100vh - 80px);
					padding: 5rem 0 3rem;
					position: relative;
					color: #fff;
					overflow: hidden;
				}
				.certificates-inner {
					max-width: 1100px;
					margin: 0 auto;
					padding: 0 1rem;
				}
				.certificates-title {
					text-align: center;
					font-size: 2.25rem;
					margin-bottom: 2rem;
					letter-spacing: 0.5px;
				}
				.cert-row {
					gap: 1.25rem;
				}
				.cert-card {
					background: rgba(255,255,255,0.03);
					border-radius: 12px;
					padding: 1.2rem;
					transition: transform 0.28s ease, box-shadow 0.28s ease;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					min-height: 220px;
				}
				.cert-card:hover {
					transform: translateY(-8px);
					box-shadow: 0 20px 40px rgba(6,6,12,0.6);
				}
				.thumb {
					height: 140px;
					border-radius: 8px;
					background: linear-gradient(135deg, rgba(74,25,82,0.95), rgba(58,20,64,0.95));
					display: flex;
					justify-content: center;
					align-items: center;
					color: #f7eefe;
					font-weight: 700;
					font-size: 1rem;
					margin-bottom: 0.8rem;
					box-shadow: inset 0 -6px 12px rgba(0,0,0,0.25);
				}
				.cert-meta { color: #d6cfe6; font-size: 0.875rem; margin-bottom: 0.6rem; text-align:center; }
				.cert-actions { display:flex; justify-content:center; gap:0.6rem; margin-top: 0.6rem; }
				.footer {
					position: relative;
					bottom: 0;
					padding: 14px 0;
					margin-top: 2.75rem;
					background: rgba(0,0,0,0.45);
					text-align:center;
					color: #b8b0d0;
				}
				@media (max-width: 576px) {
					.thumb { height: 110px; }
					.certificates-title { font-size: 1.6rem; }
				}
			`}</style>

			<div className="certificates-inner">
				<h2 className="certificates-title">
					<span className="white-text">My</span> <span className="violet-text">Certificates</span>
				</h2>

				<Row className="cert-row justify-content-center">
					{certificates.map((cert, index) => (
						<Col key={index} xs={12} sm={8} md={6} lg={4} className="mb-4">
							<div className="cert-card" role="article" aria-label={`${cert.name} certificate`}>
								<div className="thumb" title={cert.name}>
									{/* simple textual thumbnail — replace with real images if available */}
									{cert.name.split(" ").slice(0,2).map(w=>w[0]).join("")}
								</div>

								<div>
									<h5 className="mb-1" style={{ textAlign: "center" }}>{cert.name}</h5>
									<div className="cert-meta">
										{cert.issuer} • {cert.year}
									</div>
								</div>

								<div className="cert-actions">
									<Button
										variant="outline-light"
										onClick={() => handleView(cert)}
										aria-label={`View ${cert.name} certificate`}
										style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
									>
										View
									</Button>

									<Button
										variant="light"
										onClick={() => handleDownload(cert)}
										aria-label={`Download ${cert.name} certificate`}
										style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
									>
										Download
									</Button>
								</div>
							</div>
						</Col>
					))}
				</Row>

				
			</div>
		</Container>
	);
};

export default Certificates;
