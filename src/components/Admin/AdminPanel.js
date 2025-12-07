import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
    FaFileAlt,
    FaProjectDiagram,
    FaCertificate,
    FaUser,
    FaHome,
    FaSignOutAlt,
    FaChartLine,
    FaEnvelope,
    FaAddressBook,
    FaHistory
} from 'react-icons/fa';
import { getProjects, getCertificates, getStats } from '../../supabase/database';
import './AdminPanel.css';

/**
 * AdminPanel component - Main dashboard for portfolio administration
 * Displays statistics and provides navigation to all management sections
 * @returns {JSX.Element} Admin dashboard interface
 */

function AdminPanel() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        projects: 0,
        certificates: 0,
        views: 0,
        loading: true
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [projectsData, certificatesData, viewsCount] = await Promise.all([
                getProjects(),
                getCertificates(),
                getStats()
            ]);

            setStats({
                projects: projectsData.length,
                certificates: certificatesData.length,
                views: viewsCount,
                loading: false
            });
        } catch (error) {
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/admin/login');
        } catch (error) {
            // Silent fail - user will be redirected anyway
        }
    };

    const menuItems = [
        {
            title: 'Resume Management',
            icon: <FaFileAlt />,
            path: '/admin/resume',
            description: 'Upload and manage your resume',
            color: '#4CAF50'
        },
        {
            title: 'Projects Management',
            icon: <FaProjectDiagram />,
            path: '/admin/projects',
            description: 'Add, edit, or delete projects',
            color: '#2196F3',
            count: stats.projects
        },
        {
            title: 'Certificates Management',
            icon: <FaCertificate />,
            path: '/admin/certificates',
            description: 'Manage your certificates',
            color: '#FF9800',
            count: stats.certificates
        },
        {
            title: 'About Section',
            icon: <FaUser />,
            path: '/admin/about',
            description: 'Update your bio and skills',
            color: '#9C27B0'
        },
        {
            title: 'Home Section',
            icon: <FaHome />,
            path: '/admin/home',
            description: 'Edit home page content',
            color: '#F44336'
        },
        {
            title: 'Skills Management',
            icon: <FaChartLine />,
            path: '/admin/skills',
            description: 'Manage tech stack and tools',
            color: '#00BCD4'
        },
        {
            title: 'Messages',
            icon: <FaEnvelope />,
            path: '/admin/messages',
            description: 'View contact form messages',
            color: '#E91E63'
        },
        {
            title: 'Contact Info & Social Links',
            icon: <FaAddressBook />,
            path: '/admin/contact',
            description: 'Manage contact info and social links (Footer, Contact, Home)',
            color: '#607D8B'
        },
        {
            title: 'Manage Journey',
            icon: <FaHistory />,
            path: '/admin/timeline',
            description: 'Edit your timeline',
            color: '#9575CD'
        }
    ];

    const statsCards = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: <FaProjectDiagram />,
            color: '#c770f0'
        },
        {
            title: 'Total Certificates',
            value: stats.certificates,
            icon: <FaCertificate />,
            color: '#c770f0'
        },
        {
            title: 'Portfolio Views',
            value: stats.views,
            icon: <FaChartLine />,
            color: '#c770f0'
        }
    ];

    return (
        <div className="admin-dashboard">
            <Container fluid>
                <div className="admin-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p className="admin-subtitle">Manage your portfolio content</p>
                    </div>
                    <Button variant="outline-light" onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Logout
                    </Button>
                </div>

                <Container className="mt-4">
                    {/* Statistics Cards */}
                    <Row className="stats-row mb-5">
                        {statsCards.map((stat, index) => (
                            <Col md={4} key={index} className="mb-4">
                                <Card className="stat-card">
                                    <Card.Body>
                                        <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                                        <div className="stat-content">
                                            <h3 className="stat-value">
                                                {stats.loading ? '...' : stat.value}
                                            </h3>
                                            <p className="stat-title">{stat.title}</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Management Cards */}
                    <h2 className="section-title">Content Management</h2>
                    <Row>
                        {menuItems.map((item, index) => (
                            <Col md={6} lg={4} key={index} className="mb-4">
                                <Link to={item.path} className="admin-card-link">
                                    <Card className="admin-menu-card">
                                        <Card.Body>
                                            <div className="admin-card-icon" style={{ color: item.color }}>
                                                {item.icon}
                                            </div>
                                            <Card.Title>{item.title}</Card.Title>
                                            <Card.Text>{item.description}</Card.Text>
                                            {item.count !== undefined && (
                                                <div className="card-badge" style={{ background: item.color }}>
                                                    {item.count} items
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Container>
        </div>
    );
}

export default AdminPanel;
