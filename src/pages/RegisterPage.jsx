// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap'; 
import api from '../axiosConfig'; 

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [message, setMessage] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError(null); 
        setMessage(null); 

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            await api.post(
                '/api/users/register',
                { name, email, password },
                config
            );
            setMessage('Registration successful! Please log in.'); 
            setLoading(false);
            setName('');
            setEmail('');
            setPassword('');
            setTimeout(() => {
                window.location.href = '/login'; 
            }, 1500); 
        } catch (submitError) { 
            setError(submitError.response?.data?.message || 'Registration failed.'); 
            setLoading(false);
        }
    };

    return (
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={6} lg={4}> 
                <Card className='p-4 glass-card'> {/* MODIFIED: Added .glass-card class */}
                    <Card.Body>
                        <h1 className='text-center mb-4'>Register</h1>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        {message && <Alert variant='success'>{message}</Alert>}
                        {loading && <Spinner animation="border" role="status" className='d-block mx-auto mb-3'><span className="visually-hidden">Loading...</span></Spinner>}

                        <Form onSubmit={handleSubmit}> 
                            <Form.Group controlId='name' className='my-2'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </Form.Group>

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
                                Register
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default RegisterPage;