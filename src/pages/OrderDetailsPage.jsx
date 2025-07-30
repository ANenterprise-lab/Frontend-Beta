// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/OrderDetailsPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import api from '../axiosConfig'; // Adjust path

function OrderDetailsPage() {
    const { id: orderId } = useParams(); // Get order ID from URL
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));

                if (!userInfo) {
                    navigate('/login'); // Redirect if not logged in
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await api.get(`/api/orders/${orderId}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError(err.response?.data?.message || 'Failed to load order details.');
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        } else {
            setError('No order ID provided.');
            setLoading(false);
        }
    }, [orderId, navigate]);

    return (
        <div>
            <Link to="/myorders" className='btn btn-light my-3'>Go Back</Link>
            <h1>Order: {orderId}</h1>

            {loading ? (
                <p>Loading order details...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : order ? (
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong>{' '}
                                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                </p>
                                {/* You might want to add actual shipping address fields to your order model if needed */}
                                <p>
                                    <strong>Status: </strong> {order.status}
                                </p>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.length === 0 ? (
                                    <p>Order is empty</p>
                                ) : (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        {/* Assuming product has an imageUrl field, otherwise use placeholder */}
                                                        <Image src={item.productId?.imageUrl || '/placeholder.jpg'} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        {item.productId ? (
                                                            <Link to={`/product/${item.productId}`}>{item.name}</Link> // Link to product details if implemented
                                                        ) : (
                                                            <span>{item.name}</span>
                                                        )}
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                                        {item.scanned && <span className='ms-2' style={{ color: 'green' }}>✔️ Scanned</span>}
                                                        {item.validationId && <p className="mt-2"><small>Validation ID: <code>{item.validationId}</code></small></p>}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total Price</Col>
                                        <Col>₹{order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {/* You can add more summary details here like tax, shipping etc. */}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <p>Order not found or an error occurred.</p>
            )}
        </div>
    );
}

export default OrderDetailsPage;