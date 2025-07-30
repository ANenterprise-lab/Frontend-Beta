// src/components/GiftNoteModal.jsx
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './GiftNoteModal.css'; // We'll create this next

function GiftNoteModal({ show, handleClose, product, onAddWithNote }) {
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        onAddWithNote(product, note);
        setNote(''); // Clear note on submit
        handleClose();
    };

    const handleModalClose = () => {
        setNote(''); // Clear note on close
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Personalize Your Gift</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* --- PACKAGING PREVIEW --- */}
                <div className="packaging-preview">
                    <img src={product?.imageUrl} alt="Product" className="preview-product-image" />
                    <div className="preview-note-overlay">
                        <p>Made with love for...</p>
                        {/* Live preview of the note */}
                        <span className="handwritten-note-preview">{note || "Your pet's name here!"}</span>
                    </div>
                </div>
                {/* --- END PREVIEW --- */}

                <p className="mt-3">Add a custom note for your furry friend!</p>
                <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="e.g., 'Happy Birthday, Mochi! 🐶'"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={50} // Add a character limit
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add with Note
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default GiftNoteModal;