// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { data } = await api.post(
                '/api/users/login',
                { email, password }
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            setMessage('Login successful!');
            setLoading(false);
            window.location.href = '/';
        } catch (submitError) {
            setError(submitError.response?.data?.message || 'Login failed.');
            setLoading(false);
        }
    };

    return (
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={6} lg={4}>
                {/* MODIFIED: The .glass-card class from RegisterPage has been applied for consistency */}
                <Card className='p-4 glass-card'>
                    <Card.Body>
                        <h1 className='text-center mb-4'>Sign In</h1>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        {message && <Alert variant='success'>{message}</Alert>}
                        {loading && <Spinner animation="border" role="status" className='d-block mx-auto mb-3'><span className="visually-hidden">Loading...</span></Spinner>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId='email' className='my-2'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId='password' className='my-2'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" variant="primary" className='my-3 w-100' disabled={loading}>
                                Login
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default LoginPage;