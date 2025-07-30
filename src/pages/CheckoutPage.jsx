// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import './CheckoutPage.css';

function CheckoutPage({ cart, setCart, removeFromCart }) {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (cart.length === 0 && step !== 3) {
            navigate('/store');
        }
    }, [cart, navigate, step]);

    // CORRECTED: Access item.product.price for calculation
    const cartTotal = cart.reduce((total, item) => total + item.product.price, 0);

    const handleNextStep = () => setStep(prev => (prev < 3 ? prev + 1 : 3));
    const handlePrevStep = () => setStep(prev => (prev > 1 ? prev - 1 : 1));

    const handleCompletePurchase = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                alert('Please log in to place an order.');
                navigate('/login');
                return;
            }
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            };
            const orderData = { cartItems: cart, totalPrice: cartTotal };
            await api.post('/api/orders', orderData, config);
            alert('Order placed successfully! Thank you for your purchase.');
            setCart([]);
            navigate('/myorders');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order.');
        }
    };

    return (
        <div className="checkout-container">
            <header className="quote-banner">
                <p>"Every treat is a promise of tail wags."</p>
            </header>

            <div className={`progress-tracker step-${step}`}>
                <div className="progress-line"></div>
                <div className={`step ${step >= 1 ? 'active' : ''}`}><div className="step-icon">📦</div><div className="step-label">Shipping</div></div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}><div className="step-icon">💳</div><div className="step-label">Payment</div></div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}><div className="step-icon">❤️</div><div className="step-label">Confirm</div></div>
            </div>

            <Row>
                <Col md={7}>
                    <Form className="checkout-form" onSubmit={handleCompletePurchase}>
                        {step === 1 && (
                            <Row>
                                <h2>Shipping Details</h2>
                                <Col md={6} className="mb-3"><Form.Control type="text" placeholder="Your Name" className="doodled-input" required /></Col>
                                <Col md={6} className="mb-3"><Form.Control type="email" placeholder="Email Address" className="doodled-input" required /></Col>
                                <Col md={12} className="mb-3"><Form.Control type="text" placeholder="Shipping Address" className="doodled-input" required /></Col>
                            </Row>
                        )}
                        {step === 2 && (
                             <Row>
                                <h2>Payment Information</h2>
                                <Col md={12} className="mb-3"><Form.Control type="text" placeholder="Card Number" className="doodled-input" required /></Col>
                                <Col md={6} className="mb-3"><Form.Control type="text" placeholder="MM / YY" className="doodled-input" required /></Col>
                                <Col md={6} className="mb-3"><Form.Control type="text" placeholder="CVC" className="doodled-input" required /></Col>
                            </Row>
                        )}
                         {step === 3 && (
                            <div className="text-center">
                                <h2>Confirm Your Order</h2>
                                <p>Ready to make some tails wag?</p>
                                <Button variant="primary" className="payment-button mt-3" type="submit" disabled={cart.length === 0}>
                                    Complete Purchase
                                </Button>
                            </div>
                        )}
                        <div className="d-flex justify-content-between mt-4">
                            {step > 1 && (<Button variant="light" type="button" onClick={handlePrevStep}>Back</Button>)}
                            {step < 3 && (<Button variant="primary" type="button" onClick={handleNextStep} className="ms-auto">Next</Button>)}
                        </div>
                    </Form>
                </Col>
                <Col md={5}>
                    <div className="checkout-form">
                        <h3>Order Summary</h3>
                        {cart.length > 0 ? (
                            <ListGroup variant="flush">
                                {cart.map(item => (
                                    <ListGroup.Item key={item.product._id} className="d-flex justify-content-between align-items-center" style={{background: 'transparent', color: '#F5F5F5', borderColor: 'rgba(255,255,255,0.1)'}}>
                                        {/* CORRECTED: Access item.product.name */}
                                        <span>{item.product.name}</span>
                                        <div className="d-flex align-items-center">
                                            {/* CORRECTED: Access item.product.price */}
                                            <strong className="me-3">₹{item.product.price.toFixed(2)}</strong>
                                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.product)}>X</Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                                 <ListGroup.Item className="d-flex justify-content-between mt-3" style={{background: 'transparent', color: '#F5F5F5'}}>
                                    <h4>Total</h4>
                                    <h4>₹{cartTotal.toFixed(2)}</h4>
                                </ListGroup.Item>
                            </ListGroup>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CheckoutPage;