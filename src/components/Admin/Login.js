import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './AdminPanel.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            if (data.user) {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Card className="admin-login-card">
                    <Card.Body>
                        <h2 className="text-center mb-4">Admin Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Login;
