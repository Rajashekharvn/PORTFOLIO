import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card, Row, Col, Image } from "react-bootstrap";
import { getHomeData, updateHomeData } from "../../supabase/database";
import { uploadFile } from "../../supabase/storage";
import { defaultHomeContent } from "../../utils/content";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function ManageHome() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState(defaultHomeContent);
    const [avatarFile, setAvatarFile] = useState(null);
    const [mainImgFile, setMainImgFile] = useState(null);
    const [previews, setPreviews] = useState({ avatar: null, main: null });

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
                    linkedinLink: data.linkedin_link,
                    instagramLink: data.instagram_link,
                    avatarUrl: data.avatar_url,
                    mainImgUrl: data.main_img_url,
                });
                setPreviews({
                    avatar: data.avatar_url,
                    main: data.main_img_url
                });
            }
        } catch (error) {
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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (name === "avatarFile") {
            setAvatarFile(file);
            setPreviews(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
        } else if (name === "mainImgFile") {
            setMainImgFile(file);
            setPreviews(prev => ({ ...prev, main: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            let updatedData = { ...formData };

            if (avatarFile) {
                const avatarPath = `avatar-${Date.now()}.${avatarFile.name.split('.').pop()}`;
                const avatarUrl = await uploadFile(avatarFile, `portfolio-images/${avatarPath}`);
                updatedData.avatarUrl = avatarUrl;
            }

            if (mainImgFile) {
                const mainPath = `main-${Date.now()}.${mainImgFile.name.split('.').pop()}`;
                const mainUrl = await uploadFile(mainImgFile, `portfolio-images/${mainPath}`);
                updatedData.mainImgUrl = mainUrl;
            }

            await updateHomeData(updatedData);
            setFormData(updatedData); // Update local state with new URLs
            setAvatarFile(null);
            setMainImgFile(null);
            setMessage({ type: "success", text: "Home content updated successfully!" });
        } catch (error) {
            setMessage({ type: "danger", text: `Failed to update content: ${error.message || error}` });
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
                            <Row className="mb-4">
                                <Col md={8} xs={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-white">Main Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="mainImgFile"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} xs={12} className="text-center">
                                    {previews.main && (
                                        <Image src={previews.main} fluid thumbnail style={{ maxHeight: '150px' }} />
                                    )}
                                </Col>
                            </Row>

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

                            <Row className="mb-4">
                                <Col md={8} xs={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-white">Avatar Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="avatarFile"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} xs={12} className="text-center">
                                    {previews.avatar && (
                                        <Image src={previews.avatar} fluid roundedCircle style={{ maxHeight: '150px' }} />
                                    )}
                                </Col>
                            </Row>

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
