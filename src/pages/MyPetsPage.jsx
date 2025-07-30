// src/pages/MyPetsPage.jsx
import { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Form, Modal } from 'react-bootstrap';
import api from '../axiosConfig';
import './MyPetsPage.css';

const moods = ['Happy', 'Playful', 'Sleepy', 'Anxious', 'Hungry'];
const moodEmojis = {
    Happy: '😊',
    Playful: '🎾',
    Sleepy: '😴',
    Anxious: '😟',
    Hungry: '🍖'
};

function MyPetsPage() {
    const [pets, setPets] = useState([]);
    const [moodHistories, setMoodHistories] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newPet, setNewPet] = useState({ name: '', avatarUrl: '', favoriteTreats: '' });
    const [loading, setLoading] = useState(true);

    const fetchPets = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await api.get('/api/pets/mypets', config);
            setPets(data);
        } catch (error) {
            console.error("Could not fetch pets:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoodHistory = async (petId) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await api.get(`/api/moods/${petId}`, config);
            setMoodHistories(prev => ({ ...prev, [petId]: data }));
        } catch (error) {
            console.error(`Could not fetch mood history for pet ${petId}:`, error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleLogMood = async (petId, mood) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await api.post(`/api/moods/${petId}`, { mood }, config);
            fetchMoodHistory(petId);
        } catch (error) {
            alert('Failed to log mood.');
        }
    };

    // --- CORRECTED SECTION ---
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        // Reset form fields when closing
        setNewPet({ name: '', avatarUrl: '', favoriteTreats: '' });
    };

    const handleInputChange = (e) => {
        setNewPet({ ...newPet, [e.target.name]: e.target.value });
    };

    const handleAddPet = async (e) => {
        e.preventDefault();
        if (!newPet.name) {
            alert('Please enter a name for your pet.');
            return;
        }
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await api.post('/api/pets', newPet, config);
            
            fetchPets(); // Refresh the pet list
            handleCloseModal(); // Close and reset the modal
        } catch (error) {
            alert('Failed to add pet.');
        }
    };
    // --- END CORRECTED SECTION ---

    const handlePetSelect = (petId) => {
        if (!moodHistories[petId]) {
            fetchMoodHistory(petId);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Pack</h1>
                <Button onClick={handleShowModal}>Add a New Pet</Button>
            </div>

            {loading ? <p>Loading your pack...</p> : (
                <Row>
                    {pets.length > 0 ? pets.map(pet => (
                        <Col key={pet._id} md={6} lg={4} className="mb-4">
                            <Card className="glass-card text-center pet-card" onClick={() => handlePetSelect(pet._id)}>
                                <Card.Img variant="top" src={pet.avatarUrl || 'https://i.imgur.com/7aC0cPs.png'} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', margin: '1rem auto' }} />
                                <Card.Body>
                                    <Card.Title as="h2">{pet.name}</Card.Title>
                                    <Card.Text><strong>Loves:</strong> {pet.favoriteTreats || 'Everything!'}</Card.Text>
                                    
                                    <div className="mood-tracker-section">
                                        <p className="mb-2">How is {pet.name} feeling today?</p>
                                        <div className="mood-buttons">
                                            {moods.map(mood => (
                                                <button key={mood} className="mood-button" onClick={(e) => { e.stopPropagation(); handleLogMood(pet._id, mood); }}>
                                                    {moodEmojis[mood]} {mood}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {moodHistories[pet._id] && (
                                        <div className="mood-history">
                                            <h5>Recent Moods:</h5>
                                            <ul className="mood-history-list">
                                                {moodHistories[pet._id].map(entry => (
                                                    <li key={entry._id}>
                                                        <span>{moodEmojis[entry.mood]} {entry.mood}</span>
                                                        <small>{new Date(entry.createdAt).toLocaleDateString()}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : (
                        <p>You haven't added any pets yet. Add one to get started!</p>
                    )}
                </Row>
            )}

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add a New Member to Your Pack</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddPet}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pet's Name</Form.Label>
                            <Form.Control type="text" name="name" value={newPet.name} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Avatar URL</Form.Label>
                            <Form.Control type="text" name="avatarUrl" value={newPet.avatarUrl} onChange={handleInputChange} placeholder="http://..."/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Favorite Treats</Form.Label>
                            <Form.Control type="text" name="favoriteTreats" value={newPet.favoriteTreats} onChange={handleInputChange} />
                        </Form.Group>
                         <Button variant="primary" type="submit">Add Pet</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default MyPetsPage;