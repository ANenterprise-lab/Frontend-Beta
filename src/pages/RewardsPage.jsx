// src/pages/RewardsPage.jsx
import { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import api from '../axiosConfig';
import TreatTrail from '../components/TreatTrail';
import './RewardsPage.css'; // We'll create this next

function RewardsPage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) {
                    // Redirect or handle not-logged-in state
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // We'll need to create this backend route next
                const { data } = await api.get('/api/users/profile', config);
                setUserData(data);
            } catch (error) {
                console.error("Could not fetch user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <div>
            <TreatTrail crumbs={[{ path: '/', label: 'Home' }, { path: '/rewards', label: 'My Rewards' }]} />
            
            <div className="rewards-header text-center">
                <h1>Your Loyalty Journey</h1>
                <p>Thank you for being a part of our pack.</p>
            </div>

            <Row className="justify-content-center">
                <Col md={4}>
                    <Card className="glass-card text-center points-card">
                        <Card.Body>
                            <p className="points-label">Your Points</p>
                            <p className="points-value">{userData?.loyaltyPoints || 0}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="badges-section text-center mt-5">
                <h2>Your Badges</h2>
                <Row className="justify-content-center mt-4">
                    {userData?.badges && userData.badges.length > 0 ? (
                        userData.badges.map(badge => (
                            <Col key={badge} md={3} className="text-center">
                                <div className="badge-item">
                                    <div className="badge-icon">🏆</div>
                                    <p className="badge-name">{badge}</p>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <p>Your first badge is just around the corner!</p>
                    )}
                </Row>
            </div>
        </div>
    );
}

export default RewardsPage;