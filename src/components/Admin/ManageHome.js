import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { getHomeData, updateHomeData } from "../../supabase/database";
import { defaultHomeContent } from "../../utils/content";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function ManageHome() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState(defaultHomeContent);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getHomeData();
            if (data) {
                setFormData({
                    heading: data.heading,
                    name: data.name,
                    introTitle: data.intro_title,
                    introBody: data.intro_body,
                    githubLink: data.github_link,
                    linkedinLink: data.linkedin_link,
                    instagramLink: data.instagram_link,
                });
            }
        } catch (error) {
            console.error("Error fetching home data:", error);
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
            await updateHomeData(formData);
            setMessage({ type: "success", text: "Home content updated successfully!" });
        } catch (error) {
            console.error("Error updating home data:", error);
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

                <h2 className="text-white mb-4">Manage Home Section</h2>

                {message && (
                    <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                        {message.text}
                    </Alert>
                )}

                <Card className="admin-card">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-3 text-white">Main Banner</h4>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Heading (e.g., Hi There!)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <hr className="bg-white" />
                            <h4 className="mb-3 text-white">Introduction Section</h4>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Intro Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="introTitle"
                                    value={formData.introTitle}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Intro Body (Markdown supported)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    name="introBody"
                                    value={formData.introBody}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <hr className="bg-white" />
                            <h4 className="mb-3 text-white">Social Links</h4>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">GitHub Link</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="githubLink"
                                    value={formData.githubLink}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">LinkedIn Link</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="linkedinLink"
                                    value={formData.linkedinLink}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Instagram Link</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="instagramLink"
                                    value={formData.instagramLink}
                                    onChange={handleChange}
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

export default ManageHome;
