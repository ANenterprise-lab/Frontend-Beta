// src/components/PetQuoteGenerator.jsx
import React, { useState } from 'react'; // CORRECTED: Changed the comma to curly braces for useState
import { Card, Button } from 'react-bootstrap';
import './PetQuoteGenerator.css';

const quotes = [
    "The road to my heart is paved with paw prints.",
    "My dog thinks I'm a big deal.",
    "Be the person your dog thinks you are.",
    "In a perfect world, every dog has a home and every home has a dog.",
    "The best therapist has fur and four legs.",
    "Handle every situation like a dog. If you can't eat it or play with it, just pee on it and walk away.",
    "Home is where the dog hair sticks to everything but the dog."
];

function PetQuoteGenerator() {
    // CORRECTED: Used useState hook correctly
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);

    const generateQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIndex]);
    };

    return (
        <div className="quote-generator-container">
            <Card className="glass-card quote-card">
                <Card.Body>
                    <blockquote className="quote-text">
                        "{currentQuote}"
                    </blockquote>
                    <Button onClick={generateQuote}>
                        Generate a New Quote
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default PetQuoteGenerator;