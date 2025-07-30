// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/MyOrdersPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap'; // ADDED: Button
import api from '../axiosConfig'; 

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [validationId, setValidationId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));

                if (!userInfo) {
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await api.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                console.error("Could not fetch orders:", error);
            }
        };

        fetchMyOrders();
    }, [navigate]);

    const handleValidationSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/validate-product', { validationId });
            setValidationResult(data.message);
        } catch (error) {
            setValidationResult(error.response?.data?.message || 'Validation failed.');
        }
    };

    const viewOrderDetailsHandler = (orderId) => { // ADDED: Handler to navigate to order details
        navigate(`/myorders/${orderId}`);
    };

    return (
        <div>
            <div className="validation-section">
                <h2>Validate Your Product</h2>
                <form onSubmit={handleValidationSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Product Unique ID"
                        value={validationId}
                        onChange={(e) => setValidationId(e.target.value)}
                    />
                    <button type="submit">Validate</button>
                </form>
                {validationResult && <p><strong>{validationResult}</strong></p>}
            </div>
            <hr />

            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <p>You have no orders. Please place a new order while logged in.</p>
            ) : (
                orders.map(order => (
                    <Card key={order._id} className="mb-3">
                        <Card.Header>
                            <strong>Order ID:</strong> {order._id} | <strong>Status:</strong> {order.status}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()} | <strong>Total:</strong> ₹{order.totalPrice}
                            </Card.Text>
                            <ListGroup variant="flush">
                                {order.orderItems.map(item => (
                                    <ListGroup.Item key={item._id}>
                                        {item.name}
                                        {item.validationId && (
                                            <p className="mt-2"><small>Validation ID: <code>{item.validationId}</code></small></p>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Button 
                                variant='primary' 
                                className='mt-3' 
                                onClick={() => viewOrderDetailsHandler(order._id)} // ADDED: View Details Button
                            >
                                View Details
                            </Button>
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    );
}

export default MyOrdersPage;