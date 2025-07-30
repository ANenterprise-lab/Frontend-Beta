import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ADDED: useNavigate
import api from '../axiosConfig'; // The path might be './axiosConfig' if you're in App.jsx
import { Button } from 'react-bootstrap'; // ADDED: Button for consistent styling

function AdminPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const navigate = useNavigate(); // ADDED: Initialize useNavigate

    // Function to fetch orders from the backend
    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/api/orders');
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Fetch orders when the component first loads
    useEffect(() => {
        fetchOrders();
    }, []);

    // Handler for checkbox changes
    const handleOrderSelect = (orderId) => {
        setSelectedOrders(prevSelected =>
            prevSelected.includes(orderId)
                ? prevSelected.filter(id => id !== orderId) // Uncheck: remove from array
                : [...prevSelected, orderId] // Check: add to array
        );
    };

    // Handler for the "Generate Picklist" button
    const handleGeneratePicklist = async () => {
        if (selectedOrders.length === 0) {
            alert("Please select at least one order.");
            return;
        }
        try {
            await api.post('/api/orders/generate-picklist', {
                orderIds: selectedOrders,
            });
            alert("Picklist generated successfully!");
            setSelectedOrders([]); // Clear selection
            fetchOrders(); // Refresh the order list
        } catch (error) {
            console.error("Error generating picklist:", error);
            alert("Failed to generate picklist.");
        }
    };

    // NEW: Handler to navigate to order details page
    const viewOrderDetailsHandler = (orderId) => {
        navigate(`/myorders/${orderId}`); // Reusing the /myorders/:id route for admin view too
    };

    // Filter orders to only show those with 'pending' status
    const pendingOrders = orders.filter(order => order.status === 'pending');

    return (
        <div>
            <h1>Admin - Pending Orders</h1>
            <div className="admin-actions">
                <button onClick={handleGeneratePicklist} disabled={selectedOrders.length === 0}>
                    Generate Picklist ({selectedOrders.length} selected)
                </button>
            </div>
            {pendingOrders.map(order => (
                <div key={order._id} className="order-item">
                    <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleOrderSelect(order._id)}
                    />
                    <div>
                        <h3>Order ID: {order._id}</h3>
                        <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                        <p>Total: ₹{order.totalPrice}</p>
                        <ul>
                            {order.orderItems.map(item => (
                                <li key={item._id}>{item.name}</li>
                            ))}
                        </ul>
                        {/* ADDED: View Details Button */}
                        <Button 
                            variant='info' 
                            className='btn-sm mt-2' 
                            onClick={() => viewOrderDetailsHandler(order._id)}
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AdminPage;