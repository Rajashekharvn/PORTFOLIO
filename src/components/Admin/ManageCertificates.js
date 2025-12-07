import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Modal } from 'react-bootstrap';
import { FaArrowLeft, FaPlus, FaTrash, FaFilePdf } from 'react-icons/fa';
import { uploadFile } from '../../supabase/storage';
import { getCertificates, addCertificate, deleteCertificate } from '../../supabase/database';
import './AdminPanel.css';

function ManageCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        date: '',
        manualImgUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [certToDelete, setCertToDelete] = useState(null);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            const data = await getCertificates();
            setCertificates(data);
        } catch (error) {
            }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            setImageFile(file);
            setError('');
            setFormData(prev => ({ ...prev, manualImgUrl: '' }));
        } else {
            setError('Please select an image or PDF file');
            setImageFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile && !formData.manualImgUrl) {
            setError('Please select a certificate file or enter a URL');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let imgPath = '';

            if (imageFile) {
                const extension = imageFile.name.split('.').pop();
                const fileName = `cert_${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9]/g, '')}.${extension}`;
                imgPath = await uploadFile(imageFile, `certificates/${fileName}`);
            } else if (formData.manualImgUrl) {
                imgPath = formData.manualImgUrl;
            }

            const certData = {
                ...formData,
                imgPath
            };
            delete certData.manualImgUrl;

            await addCertificate(certData);

            setSuccess('Certificate added successfully!');
            setFormData({
                title: '',
                issuer: '',
                date: '',
                manualImgUrl: ''
            });
            setImageFile(null);
            e.target.reset();
            loadCertificates();

            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            setError(`Failed to add certificate: ${error.message}`);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (certId) => {
        setCertToDelete(certId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (certToDelete) {
            try {
                await deleteCertificate(certToDelete);
                setSuccess('Certificate deleted successfully!');
                loadCertificates();
                setTimeout(() => setSuccess(''), 5000);
            } catch (error) {
                setError('Failed to delete certificate.');
                setTimeout(() => setError(''), 5000);
            }
        }
        setShowDeleteModal(false);
        setCertToDelete(null);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setCertToDelete(null);
    };

    const isPdf = (url) => {
        return url && (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf?'));
    };

    return (
        <div className="admin-management-page">
            <Container>
                <Link to="/admin/dashboard" className="btn btn-outline-light back-button">
                    <FaArrowLeft /> Back to Dashboard
                </Link>

                <div className="management-card">
                    <h2>Add New Certificate</h2>

                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Certificate Title *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., AWS Certified Developer"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Issuing Organization *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="issuer"
                                        value={formData.issuer}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Amazon Web Services"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Issue Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Certificate File (Image or PDF) *</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleImageChange}
                                        disabled={!!formData.manualImgUrl}
                                        className="mb-2"
                                    />
                                    <div className="text-center text-muted mb-2">- OR -</div>
                                    <Form.Control
                                        type="url"
                                        name="manualImgUrl"
                                        placeholder="https://example.com/certificate.jpg"
                                        value={formData.manualImgUrl}
                                        onChange={handleInputChange}
                                        disabled={!!imageFile}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Adding...' : <><FaPlus /> Add Certificate</>}
                        </Button>
                    </Form>
                </div>

                <div className="item-list">
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>Existing Certificates ({certificates.length})</h3>
                    <Row>
                        {certificates.map((cert) => (
                            <Col md={6} lg={4} key={cert.id} className="mb-3">
                                <Card className="item-card">
                                    {cert.img_path && (
                                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
                                            {isPdf(cert.img_path) ? (
                                                <div className="text-center">
                                                    <FaFilePdf size={50} color="#e74c3c" />
                                                    <p className="mt-2 mb-0 text-white-50">PDF Document</p>
                                                </div>
                                            ) : (
                                                <Card.Img variant="top" src={cert.img_path} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                            )}
                                        </div>
                                    )}
                                    <Card.Body>
                                        <Card.Title style={{ color: '#fff' }}>{cert.title}</Card.Title>
                                        <Card.Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                                            <strong>Issuer:</strong> {cert.issuer}<br />
                                            <strong>Date:</strong> {new Date(cert.date).toLocaleDateString()}
                                        </Card.Text>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(cert.id)}
                                        >
                                            <FaTrash /> Delete
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
                    <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #623686 0%, #c770f0 100%)', border: 'none' }}>
                        <Modal.Title style={{ color: '#fff' }}>
                            <FaTrash /> Confirm Deletion
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ background: '#1a0b2e', color: '#fff', padding: '30px' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                            Are you sure you want to delete this certificate? This action cannot be undone.
                        </p>
                    </Modal.Body>
                    <Modal.Footer style={{ background: '#1a0b2e', border: 'none', padding: '20px 30px' }}>
                        <Button
                            variant="outline-light"
                            onClick={handleDeleteCancel}
                            style={{ borderRadius: '30px', padding: '10px 25px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirm}
                            style={{
                                borderRadius: '30px',
                                padding: '10px 25px',
                                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                border: 'none'
                            }}
                        >
                            <FaTrash /> Delete Certificate
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default ManageCertificates;
