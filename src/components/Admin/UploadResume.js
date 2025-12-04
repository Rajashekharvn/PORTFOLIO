import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { uploadFile } from '../../supabase/storage';
import { getResume, updateResume } from '../../supabase/database';
import './AdminPanel.css';

function UploadResume() {
    const [file, setFile] = useState(null);
    const [currentResume, setCurrentResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ manualUrl: '' });

    useEffect(() => {
        loadCurrentResume();
    }, []);

    const loadCurrentResume = async () => {
        try {
            const resume = await getResume();
            setCurrentResume(resume);
        } catch (error) {
            console.error('Error loading resume:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
            setFormData({ manualUrl: '' }); // Clear manual URL if file is selected
        } else {
            setError('Please select a PDF file');
            setFile(null);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let downloadURL = currentResume?.url || '';

            // If a file is selected, upload it
            if (file) {
                const fileName = `resume_${Date.now()}.pdf`;
                downloadURL = await uploadFile(file, `resumes/${fileName}`);
            }
            // If no file but URL provided manually
            else if (formData.manualUrl) {
                downloadURL = formData.manualUrl;
            }

            if (!downloadURL) {
                setError('Please select a file or enter a URL');
                setLoading(false);
                return;
            }

            // Update database with new resume URL
            await updateResume({
                url: downloadURL,
                fileName: file ? file.name : 'External Link',
                uploadedAt: new Date().toISOString()
            });

            setSuccess('Resume updated successfully!');
            setFile(null);
            setFormData({ manualUrl: '' });
            loadCurrentResume();

            // Reset file input
            e.target.reset();
        } catch (error) {
            setError(`Failed to update resume: ${error.message}`);
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-management-page">
            <Container>
                <Link to="/admin/dashboard" className="btn btn-outline-light back-button">
                    <FaArrowLeft /> Back to Dashboard
                </Link>

                <div className="management-card">
                    <h2>Resume Management</h2>

                    {currentResume && (
                        <Alert variant="info">
                            <strong>Current Resume:</strong> {currentResume.fileName || 'resume.pdf'}
                            <br />
                            <small>Uploaded: {new Date(currentResume.uploadedAt).toLocaleString()}</small>
                            <br />
                            <a href={currentResume.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary mt-2">
                                View Current Resume
                            </a>
                        </Alert>
                    )}

                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleUpload}>
                        <Form.Group className="mb-3">
                            <Form.Label>Option 1: Upload New Resume (PDF)</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                disabled={loading || formData.manualUrl}
                            />
                            <Form.Text className="text-muted">
                                Maximum file size: 5MB
                            </Form.Text>
                        </Form.Group>

                        <div className="text-center my-3 text-white">OR</div>

                        <Form.Group className="mb-3">
                            <Form.Label>Option 2: Enter External Resume URL</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="https://example.com/my-resume.pdf"
                                value={formData.manualUrl}
                                onChange={(e) => {
                                    setFormData({ manualUrl: e.target.value });
                                    setFile(null); // Clear file if manual URL is being entered
                                }}
                                disabled={loading || file}
                            />
                            <Form.Text className="text-muted">
                                Use a direct link from Google Drive, Dropbox, or GitHub
                            </Form.Text>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading || (!file && !formData.manualUrl)}
                        >
                            {loading ? 'Updating...' : <><FaUpload /> Update Resume</>}
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
}

export default UploadResume;
