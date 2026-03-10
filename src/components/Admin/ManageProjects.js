import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { uploadFile } from '../../supabase/storage';
import { getProjects, addProject, deleteProject, updateProject } from '../../supabase/database';
import './AdminPanel.css';

function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        ghLink: '',
        demoLink: '',
        isBlog: false,
        manualImgUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setError('');
            setFormData(prev => ({ ...prev, manualImgUrl: '' }));
        } else {
            setError('Please select an image file');
            setImageFile(null);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies,
            ghLink: project.gh_link || '',
            demoLink: project.demo_link || '',
            isBlog: project.is_blog || false,
            manualImgUrl: project.img_path || ''
        });
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            technologies: '',
            ghLink: '',
            demoLink: '',
            isBlog: false,
            manualImgUrl: ''
        });
        setImageFile(null);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let imgPath = '';

            // Upload image if provided
            if (imageFile) {
                const fileName = `project_${Date.now()}_${imageFile.name}`;
                imgPath = await uploadFile(imageFile, `projects/${fileName}`);
            }
            // Use manual URL if provided
            else if (formData.manualImgUrl) {
                imgPath = formData.manualImgUrl;
            }

            // Prepare project data
            const projectData = {
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()),
                imgPath
            };

            // Remove manualImgUrl from saved data
            delete projectData.manualImgUrl;

            if (editingProject) {
                // If editing, keep existing image if no new one provided
                if (!imgPath && !imageFile && editingProject.img_path) {
                    projectData.imgPath = editingProject.img_path;
                }

                await updateProject(editingProject.id, projectData);
                setSuccess('Project updated successfully!');
            } else {
                await addProject(projectData);
                setSuccess('Project added successfully!');
            }

            cancelEdit(); // Resets form and clears edit mode
            loadProjects();
        } catch (error) {
            setError(`Failed to save project: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(projectId);
                setSuccess('Project deleted successfully!');
                loadProjects();
            } catch (error) {
                setError('Failed to delete project.');
            }
        }
    };

    return (
        <div className="admin-management-page">
            <Container>
                <Link to="/admin/dashboard" className="btn btn-outline-light back-button">
                    <FaArrowLeft /> Back to Dashboard
                </Link>

                <div className="management-card">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                        {editingProject && (
                            <Button variant="outline-light" size="sm" onClick={cancelEdit}>
                                <FaTimes /> Cancel Edit
                            </Button>
                        )}
                    </div>

                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Title *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Image (Upload or URL)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={!!formData.manualImgUrl}
                                        className="mb-2"
                                    />
                                    <div className="text-center text-muted mb-2">- OR -</div>
                                    <Form.Control
                                        type="url"
                                        name="manualImgUrl"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.manualImgUrl}
                                        onChange={handleInputChange}
                                        disabled={!!imageFile}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Technologies (comma-separated) *</Form.Label>
                            <Form.Control
                                type="text"
                                name="technologies"
                                value={formData.technologies}
                                onChange={handleInputChange}
                                placeholder="React, Node.js, MongoDB"
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6} xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>GitHub Link *</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="ghLink"
                                        value={formData.ghLink}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Demo Link (optional)</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="demoLink"
                                        value={formData.demoLink}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="isBlog"
                                label="Is this a blog post?"
                                checked={formData.isBlog}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (
                                <>{editingProject ? <FaEdit /> : <FaPlus />} {editingProject ? 'Update Project' : 'Add Project'}</>
                            )}
                        </Button>
                    </Form>
                </div>

                <div className="item-list">
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>Existing Projects ({projects.length})</h3>
                    <Row>
                        {projects.map((project) => (
                            <Col md={6} lg={4} xs={12} key={project.id} className="mb-3">
                                <Card className="item-card">
                                    {project.imgPath && (
                                        <Card.Img variant="top" src={project.imgPath} style={{ height: '150px', objectFit: 'cover' }} />
                                    )}
                                    <Card.Body>
                                        <Card.Title style={{ color: '#fff' }}>{project.title}</Card.Title>
                                        <Card.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9em' }}>
                                            {project.description.substring(0, 100)}...
                                        </Card.Text>
                                        <div className="mb-2">
                                            {project.technologies && project.technologies.map((tech, idx) => (
                                                <span key={idx} className="badge bg-secondary me-1">{tech}</span>
                                            ))}
                                        </div>

                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                onClick={() => handleEdit(project)}
                                            >
                                                <FaEdit /> Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(project.id)}
                                            >
                                                <FaTrash /> Delete
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container >
        </div >
    );
}

export default ManageProjects;
