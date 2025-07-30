// src/pages/StorePage.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import TreatTrail from '../components/TreatTrail';
import './StorePage.css';

function StorePage({ cart, addToCart, removeFromCart }) {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const cartTotal = cart.reduce((total, item) => total + item.product.price, 0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = keyword ? `/api/products?keyword=${keyword}` : '/api/products';
                const { data } = await api.get(url);
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [keyword]);

    return (
        <div>
            <TreatTrail crumbs={[{ path: '/', label: 'Home' }, { path: '/store', label: 'Store' }]} />

            {cart.length > 0 && (
                <div className="cart-section glass-card mb-4">
                    <h2>🛒 Your Bowl</h2>
                    {cart.map(item => (
                        <div key={item.product._id} className="cart-item">
                            <span>{item.product.name}</span>
                            <span>₹{item.product.price.toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.product)} className="remove-btn">Remove</button>
                        </div>
                    ))}
                    <hr />
                    <div className="cart-total">
                        <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
                        <Button onClick={() => navigate('/checkout')} variant="success">
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
            
            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                        <Card className="product-card">
                            <div className="product-image-wrapper">
                                <Card.Img variant="top" src={product.imageUrl || '/placeholder.jpg'} />
                                <div className="pet-hover-portrait"></div> {/* The animated corgi! */}
                            </div>
                            <Card.Body>
                                <div>
                                    <Card.Title as="div"><strong>{product.name}</strong></Card.Title>
                                    <Card.Text as="h3">₹{product.price.toFixed(2)}</Card.Text>
                                </div>
                                <Button className="mt-2" variant="primary" onClick={() => addToCart(product)}>Add to Cart</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default StorePage;