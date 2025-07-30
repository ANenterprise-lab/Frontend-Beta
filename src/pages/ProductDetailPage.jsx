// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Accordion } from 'react-bootstrap';
import api from '../axiosConfig';
import GiftNoteModal from '../components/GiftNoteModal'; // Import the new modal
import './ProductDetailPage.css';

function ProductDetailPage({ addToCart }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGiftModal, setShowGiftModal] = useState(false); // State for modal
    const { id: productId } = useParams();

    useEffect(() => {
        // ... fetchProduct logic remains the same
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${productId}`);
                setProduct(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch product.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <>
            <div>
                {/* ... rest of the component layout remains the same */}
                <Row>
                    <Col md={6}>
                       {/* ... image container ... */}
                    </Col>
                    <Col md={6}>
                        <Card className="glass-card product-buy-box">
                            <Card.Body>
                                <ListGroup variant='flush'>
                                    {/* ... other list group items ... */}
                                    <ListGroup.Item className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            {/* Normal Add to Cart */}
                                            <Button className='btn-block paw-button-large' type='button' onClick={() => addToCart(product)}>
                                                Add to Bowl
                                            </Button>
                                            {/* New Gift Button */}
                                            <Button variant="secondary" className='btn-block paw-button-large' type='button' onClick={() => setShowGiftModal(true)}>
                                                🎁 Send as Gift
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                         {/* ... mood match summary ... */}
                    </Col>
                </Row>
                 {/* ... story accordion ... */}
            </div>

            {/* Render the modal */}
            {product && (
                <GiftNoteModal
                    show={showGiftModal}
                    handleClose={() => setShowGiftModal(false)}
                    product={product}
                    onAddWithNote={addToCart}
                />
            )}
        </>
    );
}

export default ProductDetailPage;