// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/admin/ProductListPage.jsx
import { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig';
import './ProductListPage.css'; // Import the new CSS

// A fun component for the "Tail Wag Meter"
const TailWagMeter = ({ rating }) => {
    const maxRating = 5;
    const filledWags = Math.round(rating); // Round to nearest whole number for display

    return (
        <div className="tail-wag-meter">
            <div className="meter-label">Tail Wag Meter:</div>
            <div className="meter-bar">
                {[...Array(maxRating)].map((_, index) => (
                    <span
                        key={index}
                        className="wag-icon"
                        style={{ color: index < filledWags ? '#CCA43B' : '#555' }}
                    >
                        🐾
                    </span>
                ))}
            </div>
        </div>
    );
};


function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    // Sample quips for the hover effect
    const hoverQuips = ["I woof this!", "Purrfection!", "Paw-sitively awesome!", "My new favorite!"];

    const fetchProducts = async (searchKeyword = '') => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.isAdmin) {
                alert('Not authorized as an admin.');
                setProducts([]);
                setLoading(false);
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const url = searchKeyword ? `/api/products?keyword=${searchKeyword}` : '/api/products';
            const { data } = await api.get(url, config);
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.response?.data?.message || 'Failed to fetch products.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(keyword);
    }, [keyword]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const deleteProductHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setLoading(true);
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await api.delete(`/api/products/${id}`, config);
                alert('Product deleted successfully!');
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                alert(error.response?.data?.message || 'Failed to delete product.');
                setLoading(false);
            }
        }
    };

    const editProductHandler = (id) => {
        navigate(`/admin/products/${id}/edit`);
    };

    return (
        <div>
            <h1>Manage Products</h1>

            <Form onSubmit={handleSearchSubmit} className='mb-4'>
                <InputGroup>
                    <Form.Control
                        type='text'
                        placeholder='Search products...'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Button type='submit' variant='primary'>
                        Search
                    </Button>
                </InputGroup>
            </Form>

            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <Row>
                    {products.map((product, index) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="product-list-card">
                                <div className="card-img-container">
                                    <Card.Img variant="top" src={product.imageUrl || '/placeholder.jpg'} />
                                    <div className="pet-mascot"></div>
                                    <div className="hover-quip">{hoverQuips[index % hoverQuips.length]}</div>
                                </div>
                                <Card.Body>
                                    <div>
                                        <Card.Title as="h5">{product.name}</Card.Title>
                                        <Card.Text as="h3">₹{product.price.toFixed(2)}</Card.Text>
                                        <TailWagMeter rating={product.rating || (index % 5) + 1} /> {/* Using a placeholder rating */}
                                    </div>
                                    <div className="mt-3 d-flex justify-content-between">
                                        <Button variant='light' className='btn-sm' onClick={() => editProductHandler(product._id)}>
                                            <i className='fas fa-edit'></i> Edit
                                        </Button>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteProductHandler(product._id)}>
                                            <i className='fas fa-trash'></i> Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

export default ProductListPage;