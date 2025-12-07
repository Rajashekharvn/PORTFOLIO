import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { getAboutData, updateAboutData } from "../../supabase/database";
import { defaultAboutContent } from "../../utils/content";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from "react-icons/fa";

function ManageAbout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState(defaultAboutContent);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getAboutData();
            if (data) {
                setFormData({
                    heading: data.heading,
                    description: data.description,
                    activities: data.activities || [],
                    quote: data.quote,
                    quoteAuthor: data.quote_author,
                    skillBars: data.skill_bars || {
                        frontend: [],
                        backend: [],
                        tools: []
                    }
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

    const handleActivityChange = (index, value) => {
        const newActivities = [...formData.activities];
        newActivities[index] = value;
        setFormData((prev) => ({ ...prev, activities: newActivities }));
    };

    const addActivity = () => {
        setFormData((prev) => ({
            ...prev,
            activities: [...prev.activities, ""],
        }));
    };

    const removeActivity = (index) => {
        const newActivities = formData.activities.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, activities: newActivities }));
    };

    // Skill Bars Management Functions
    const handleSkillChange = (category, index, field, value) => {
        const newSkills = [...(formData.skillBars?.[category] || [])];
        newSkills[index] = {
            ...newSkills[index],
            [field]: field === 'level' ? parseInt(value) || 0 : value
        };
        setFormData((prev) => ({
            ...prev,
            skillBars: {
                ...prev.skillBars,
                [category]: newSkills
            }
        }));
    };

    const addSkill = (category) => {
        const newSkills = [...(formData.skillBars?.[category] || []), { name: "", level: 50 }];
        setFormData((prev) => ({
            ...prev,
            skillBars: {
                ...prev.skillBars,
                [category]: newSkills
            }
        }));
    };

    const removeSkill = (category, index) => {
        const newSkills = (formData.skillBars?.[category] || []).filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            skillBars: {
                ...prev.skillBars,
                [category]: newSkills
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await updateAboutData(formData);
            setMessage({ type: "success", text: "About content updated successfully!" });
        } catch (error) {
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

                <h2 className="text-white mb-4">Manage About Section</h2>

                {message && (
                    <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                        {message.text}
                    </Alert>
                )}

                <Card className="admin-card">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-3 text-white">Main Content</h4>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Heading</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Description (Bio)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <hr className="bg-white" />
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-white mb-0">Activities</h4>
                                <Button variant="success" size="sm" onClick={addActivity}>
                                    <FaPlus /> Add Activity
                                </Button>
                            </div>

                            {formData.activities.map((activity, index) => (
                                <Row key={index} className="mb-2">
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            value={activity}
                                            onChange={(e) => handleActivityChange(index, e.target.value)}
                                            placeholder="Enter activity..."
                                            required
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="danger" onClick={() => removeActivity(index)}>
                                            <FaTrash />
                                        </Button>
                                    </Col>
                                </Row>
                            ))}

                            <hr className="bg-white mt-4" />
                            <h4 className="mb-3 text-white">Quote Section</h4>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-white">Quote</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="quote"
                                    value={formData.quote}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-white">Quote Author</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="quoteAuthor"
                                    value={formData.quoteAuthor}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <hr className="bg-white mt-4" />
                            <h4 className="mb-3 text-white">Skill Bars Management</h4>
                            <p className="text-white-50 mb-4">
                                Manage technical proficiency levels for Frontend, Backend, and Tools categories.
                            </p>

                            {/* Frontend Skills */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0">
                                        <i className="fas fa-laptop-code"></i> Frontend Development
                                    </h5>
                                    <Button variant="success" size="sm" onClick={() => addSkill('frontend')}>
                                        <FaPlus /> Add Skill
                                    </Button>
                                </div>
                                {(formData.skillBars?.frontend || []).map((skill, index) => (
                                    <Row key={index} className="mb-3 align-items-center">
                                        <Col md={5}>
                                            <Form.Control
                                                type="text"
                                                value={skill.name}
                                                onChange={(e) => handleSkillChange('frontend', index, 'name', e.target.value)}
                                                placeholder="Skill name (e.g., React.js)"
                                                required
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center">
                                                <Form.Range
                                                    value={skill.level}
                                                    onChange={(e) => handleSkillChange('frontend', index, 'level', e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    className="me-3"
                                                />
                                                <Form.Control
                                                    type="number"
                                                    value={skill.level}
                                                    onChange={(e) => handleSkillChange('frontend', index, 'level', e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    style={{ width: '70px' }}
                                                />
                                                <span className="text-white ms-2">%</span>
                                            </div>
                                        </Col>
                                        <Col xs="auto">
                                            <Button variant="danger" onClick={() => removeSkill('frontend', index)}>
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </div>

                            {/* Backend Skills */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0">
                                        <i className="fas fa-server"></i> Backend Development
                                    </h5>
                                    <Button variant="success" size="sm" onClick={() => addSkill('backend')}>
                                        <FaPlus /> Add Skill
                                    </Button>
                                </div>
                                {(formData.skillBars?.backend || []).map((skill, index) => (
                                    <Row key={index} className="mb-3 align-items-center">
                                        <Col md={5}>
                                            <Form.Control
                                                type="text"
                                                value={skill.name}
                                                onChange={(e) => handleSkillChange('backend', index, 'name', e.target.value)}
                                                placeholder="Skill name (e.g., Node.js)"
                                                required
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center">
                                                <Form.Range
                                                    value={skill.level}
                                                    onChange={(e) => handleSkillChange('backend', index, 'level', e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    className="me-3"
                                                />
                                                <Form.Control
                                                    type="number"
                                                    value={skill.level}
                                                    onChange={(e) => handleSkillChange('backend', index, 'level', e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    style={{ width: '70px' }}
                                                />
                                                <span className="text-white ms-2">%</span>
                                            </div>
                                        </Col>
                                        <Col xs="auto">
                                            <Button variant="danger" onClick={() => removeSkill('backend', index)}>
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </div>

                            {/* Tools Skills */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0">
                                        <i className="fas fa-tools"></i> Tools & Technologies
                                    </h5>
                                    <Button variant="success" size="sm" onClick={() => addSkill('tools')}>
                                        <FaPlus /> Add Skill
                                    </Button>
                                </div>
                                {(formData.skillBars?.tools || []).map((skill, index) => (
                                    <Row key={index} className="mb-3 align-items-center">
                                        <Col md={5}>
                                            <Form.Control
                                                type="text"
                                                value={skill.name}
                                                onChange={(e) => handleSkillChange('tools', index, 'name', e.target.value)}
                                                placeholder="Skill name (e.g., Git/GitHub)"
                                                required
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center">
                                                <Form.Range
                                                    value={skill.level}
                                                    onChange={(e) => handleSkillChange('tools', index, 'level', e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    className="me-3"
                                                />
                                                <Form.Control
                                                    type="number"
                                                    value={skill.level}
                                                    onChange={(e) => handleSkillChange('tools', index, 'level', e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    style={{ width: '70px' }}
                                                />
                                                <span className="text-white ms-2">%</span>
                                            </div>
                                        </Col>
                                        <Col xs="auto">
                                            <Button variant="danger" onClick={() => removeSkill('tools', index)}>
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </div>

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

export default ManageAbout;
