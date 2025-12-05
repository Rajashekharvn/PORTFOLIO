import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Card, Spinner } from "react-bootstrap";
import { getMessages, deleteMessage } from "../../supabase/database";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

function ManageMessages() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionStatus, setActionStatus] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const data = await getMessages();
        setMessages(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteMessage(id);
                setMessages(messages.filter(msg => msg.id !== id));
                setActionStatus({ type: "success", text: "Message deleted successfully" });
            } catch (error) {
                setActionStatus({ type: "danger", text: "Failed to delete message" });
            }
        }
    };

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

                <h2 className="text-white mb-4">Messages</h2>

                {actionStatus && (
                    <Alert variant={actionStatus.type} onClose={() => setActionStatus(null)} dismissible>
                        {actionStatus.text}
                    </Alert>
                )}

                <Card className="admin-card">
                    <Card.Body>
                        {loading ? (
                            <div className="text-center p-5">
                                <Spinner animation="border" variant="light" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-white p-5">
                                <h4>No messages yet</h4>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover variant="dark" className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Message</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map((msg) => (
                                            <tr key={msg.id}>
                                                <td style={{ minWidth: '120px' }}>
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ fontWeight: 'bold' }}>{msg.name}</td>
                                                <td>
                                                    <a href={`mailto:${msg.email}`} style={{ color: '#c770f0' }}>
                                                        {msg.email}
                                                    </a>
                                                </td>
                                                <td style={{ whiteSpace: 'pre-wrap', maxWidth: '400px' }}>
                                                    {msg.message}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(msg.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </Container>
    );
}

export default ManageMessages;
