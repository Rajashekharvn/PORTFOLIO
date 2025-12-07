import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { getContactData, updateContactData } from "../../supabase/database";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function ManageContact() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        location: "",
        github: "",
        linkedin: "",
        instagram: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getContactData();
            if (data) {
                setFormData({
                    email: data.email,
                    phone: data.phone,
                    location: data.location,
                    github: data.github,
                    linkedin: data.linkedin,
                    instagram: data.instagram
                });
            }
        } catch (error) {
            console.error("Error fetching contact data:", error);
            setMessage({ type: "danger", text: "Failed to load data" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await updateContactData(formData);
            setMessage({
                type: "success",
                text: "✅ Contact info updated successfully! Refresh the page (F5) to see changes in Footer, Contact, and Home pages."
            });
        } catch (error) {
            console.error("Error updating contact data:", error);
            setMessage({ type: "danger", text: "Failed to update content" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container fluid className="admin-section">
                <Container className="text-center text-white">Loading...</Container>
            </Container>
        );
    }

    return (
        <Container fluid className="admin-section">
            <Container>
                <Button
                    variant="outline-light"
                    className="mb-4"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    <FaArrowLeft /> Back to Dashboard
                </Button>

                <h2 className="text-white mb-4">Manage Contact Info & Social Links</h2>
                <p className="text-white-50 mb-4">
                    Changes here will update social links across Footer, Contact page, and Home page.
                </p>

                {message && (
                    <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                        {message.text}
                    </Alert>
                )}

                <Card className="admin-card">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. your.email@example.com"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +1 234 567 890"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. City, Country"
                                    required
                                />
                            </Form.Group>

                            <hr className="bg-white my-4" />
                            <h4 className="text-white mb-3">Social Links</h4>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">GitHub URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">LinkedIn URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Instagram URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="https://instagram.com/username"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={saving}
                                className="w-100"
                                style={{ backgroundColor: "#c770f0", border: "none" }}
                            >
                                {saving ? "Saving..." : <><FaSave /> Save Changes</>}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </Container>
    );
}

export default ManageContact;
