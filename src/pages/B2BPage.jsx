// src/pages/B2BPage.jsx
import { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import api from '../axiosConfig';
import './B2BPage.css'; // Import the new stylesheet

function B2BPage() {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        message: ''
    });
    // State to track if fields have been touched for validation
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/b2b-inquiry', formData);
            alert('Thank you! Your inquiry has been sent.');
            setFormData({ companyName: '', contactPerson: '', email: '', phone: '', message: '' });
            setTouched({});
        } catch (error) {
            alert('There was an error submitting your form.');
        }
    };

    return (
        <div className="b2b-form-container">
            <div className="text-center mb-5">
                <h1>B2B & Wholesale Inquiries</h1>
                <p>Interested in stocking our products? Please fill out the form below.</p>
            </div>

            <Card className="glass-card p-4">
                <Card.Body>
                    <Form noValidate onSubmit={handleSubmit} className="b2b-form">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4" controlId="companyName">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.companyName && formData.companyName.length > 2}
                                        isInvalid={touched.companyName && formData.companyName.length <= 2}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4" controlId="contactPerson">
                                    <Form.Label>Your Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.contactPerson && formData.contactPerson.length > 2}
                                        isInvalid={touched.contactPerson && formData.contactPerson.length <= 2}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4" controlId="email">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.email && /\S+@\S+\.\S+/.test(formData.email)}
                                        isInvalid={touched.email && !/\S+@\S+\.\S+/.test(formData.email)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4" controlId="phone">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.phone && formData.phone.length > 6}
                                        isInvalid={touched.phone && formData.phone.length <= 6}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-4" controlId="message">
                            <Form.Label>Your Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button type="submit" size="lg" className="mt-3">
                                Submit Inquiry
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default B2BPage;