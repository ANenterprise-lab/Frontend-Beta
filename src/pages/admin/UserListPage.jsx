// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/admin/UserListPage.jsx
import { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig'; // Adjust path for nested folder

function UserListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!userInfo || !userInfo.isAdmin) {
                alert('Not authorized as an admin.');
                setLoading(false);
                navigate('/login'); 
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await api.get('/api/users', config); // Fetch all users (backend endpoint added previously)
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.response?.data?.message || 'Failed to fetch users.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Placeholder for future delete user functionality
    const deleteUserHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            alert(`Delete user with ID: ${id}`);
            // Implement actual delete API call here later
            // After deletion, call fetchUsers() again to refresh the list
        }
    };

    return (
        <div>
            <h1>Users</h1>
            {loading ? (
                <p>Loading users...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th> {/* For action buttons */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>
                                    {user.isAdmin ? (
                                        <i className='fas fa-check' style={{ color: 'green' }}></i> // Check icon for admin
                                    ) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i> // Cross icon for non-admin
                                    )}
                                </td>
                                <td>
                                    {/* Placeholder for Edit/Details */}
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-info-circle'></i> {/* Info/Edit icon */}
                                    </Button>
                                    {/* Delete User Button */}
                                    <Button 
                                        variant='danger' 
                                        className='btn-sm' 
                                        onClick={() => deleteUserHandler(user._id)}
                                    >
                                        <i className='fas fa-trash'></i> {/* Trash icon */}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default UserListPage;