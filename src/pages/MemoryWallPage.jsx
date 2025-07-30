// src/pages/MemoryWallPage.jsx
import { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Form, Modal, Spinner } from 'react-bootstrap';
import api from '../axiosConfig';
import TreatTrail from '../components/TreatTrail';
import './MemoryWallPage.css'; // We will create this next

function MemoryWallPage() {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // State for the new memory form
    const [petName, setPetName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tribute, setTribute] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchMemories = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/memories');
            setMemories(data);
        } catch (error) {
            console.error("Could not fetch memories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        // Reset form
        setPetName('');
        setImageUrl('');
        setTribute('');
    };
    const handleShow = () => setShowModal(true);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/api/upload', formData, config);
            setImageUrl(data.imageUrl);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await api.post('/api/memories', { petName, imageUrl, tribute }, config);
            handleClose();
            fetchMemories(); // Refresh the wall
        } catch (error) {
            alert('Failed to post tribute. Please make sure you are logged in.');
        }
    };

    return (
        <div>
            <TreatTrail crumbs={[{ path: '/', label: 'Home' }, { path: '/memory-wall', label: 'Memory Wall' }]} />
            
            <div className="memory-wall-header text-center">
                <h1>In Loving Memory</h1>
                <p>A place to share and remember our friends who have crossed the rainbow bridge.</p>
                <Button variant="light" onClick={handleShow}>Share a Tribute</Button>
            </div>

            {loading ? <Spinner animation="border" /> : (
                <Row className="mt-5">
                    {memories.map(memory => (
                        <Col key={memory._id} md={4} className="mb-4">
                            <Card className="memory-card">
                                <Card.Img variant="top" src={memory.imageUrl} className="memory-image" />
                                <div className="candle-glow"></div>
                                <Card.Body className="text-center">
                                    <Card.Title as="h2">{memory.petName}</Card.Title>
                                    <Card.Text className="tribute-text">"{memory.tribute}"</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Share a Memory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Your Pet's Name</Form.Label>
                            <Form.Control type="text" value={petName} onChange={(e) => setPetName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>A Favorite Picture</Form.Label>
                            <Form.Control type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (or upload below)" />
                            <Form.Control type="file" className="mt-2" onChange={uploadFileHandler} />
                            {uploading && <Spinner animation="border" size="sm" />}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>A Short Tribute</Form.Label>
                            <Form.Control as="textarea" rows={3} value={tribute} onChange={(e) => setTribute(e.target.value)} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">Post Tribute</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default MemoryWallPage;