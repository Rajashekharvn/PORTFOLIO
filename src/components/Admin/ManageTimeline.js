import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card, Table, Modal } from "react-bootstrap";
import {
    getTimelineData,
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem
} from "../../supabase/database";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";

function ManageTimeline() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        type: "education",
        title: "",
        organization: "",
        period: "",
        description: "",
        icon: "fas fa-graduation-cap"
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getTimelineData();
            setItems(data);
        } catch (error) {
            setMessage({ type: "danger", text: "Failed to load timeline data" });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            type: item.type,
            title: item.title,
            organization: item.organization,
            period: item.period,
            description: item.description,
            icon: item.icon
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteTimelineItem(id);
                setMessage({ type: "success", text: "Item deleted successfully!" });
                fetchData();
            } catch (error) {
                setMessage({ type: "danger", text: "Failed to delete item" });
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            type: "education",
            title: "",
            organization: "",
            period: "",
            description: "",
            icon: "fas fa-graduation-cap"
        });
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
        try {
            if (editingItem) {
                await updateTimelineItem(editingItem.id, formData);
                setMessage({ type: "success", text: "Item updated successfully!" });
            } else {
                await addTimelineItem(formData);
                setMessage({ type: "success", text: "Item added successfully!" });
            }
            handleClose();
            fetchData();
        } catch (error) {
            setMessage({ type: "danger", text: "Failed to save item" });
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

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-white">Manage Journey</h2>
                    <Button
                        variant="primary"
                        style={{ backgroundColor: "#c770f0", border: "none" }}
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus /> Add New Item
                    </Button>
                </div>

                {message && (
                    <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                        {message.text}
                    </Alert>
                )}

                <Card className="admin-card">
                    <Card.Body>
                        <Table responsive hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Period</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.type}</td>
                                        <td>{item.period}</td>
                                        <td>
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center">No items found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal show={showModal} onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton className="bg-dark text-white">
                        <Modal.Title>{editingItem ? "Edit Item" : "Add New Item"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-white">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="education">Education</option>
                                    <option value="experience">Experience</option>
                                    <option value="achievement">Achievement</option>
                                    <option value="certification">Certification</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Bachelor's Degree"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Organization</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    placeholder="e.g. University Name"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Period</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="period"
                                    value={formData.period}
                                    onChange={handleChange}
                                    placeholder="e.g. 2020 - 2024"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Icon Class (FontAwesome)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="e.g. fas fa-graduation-cap"
                                />
                                <Form.Text className="text-muted">
                                    Use FontAwesome class names (e.g., fas fa-briefcase, fas fa-trophy)
                                </Form.Text>
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{ backgroundColor: "#c770f0", border: 'none' }}>
                                <FaSave /> {editingItem ? "Update" : "Add"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </Container>
    );
}

export default ManageTimeline;
