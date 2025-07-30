// src/pages/StorePage.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import './StorePage.css';

function StorePage({ cart, addToCart, removeFromCart }) {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    // CORRECTED: Access item.product.price for calculation
    const cartTotal = cart.reduce((total, item) => total + item.product.price, 0);

    const fetchProducts = async (searchKeyword = '') => {
        try {
            const url = searchKeyword ? `/api/products?keyword=${searchKeyword}` : '/api/products';
            const { data } = await api.get(url);
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts(keyword);
    }, [keyword]);

    const viewDetailsHandler = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div>
            {/* The cart display is now also corrected */}
            {cart.length > 0 && (
                <div className="cart-section glass-card mb-4">
                    <h2>🛒 Your Bowl</h2>
                    {cart.map(item => (
                        <div key={item.product._id} className="cart-item">
                            {/* CORRECTED: Access item.product.name */}
                            <span>{item.product.name}</span>
                            {/* CORRECTED: Access item.product.price */}
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
            
            <h1>Products</h1>

            <Form onSubmit={(e) => e.preventDefault()} className='mb-4'>
                <InputGroup>
                    <Form.Control
                        type='text'
                        placeholder='Search products...'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </InputGroup>
            </Form>

            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                        <div className="product-card-container">
                            <Card className="product-card">
                                <Card.Img src={product.imageUrl || '/placeholder.jpg'} variant="top" />
                                <Card.Body>
                                    <Card.Title as="div"><strong>{product.name}</strong></Card.Title>
                                    <Card.Text as="h3">₹{product.price.toFixed(2)}</Card.Text>
                                </Card.Body>
                            </Card>

                            <div className="product-details-overlay">
                                <div className="overlay-buttons">
                                    <Button variant="primary" onClick={() => addToCart(product)}>Add to Cart</Button>
                                    <Button variant="secondary" onClick={() => viewDetailsHandler(product._id)}>Details</Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default StorePage;