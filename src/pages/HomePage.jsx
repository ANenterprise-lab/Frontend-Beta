// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import StoryCarousel from '../components/StoryCarousel';
import PetQuoteGenerator from '../components/PetQuoteGenerator'; // Import the new component
import './HomePage.css';

function HomePage() {
    return (
        <div>
            <div className="hero-banner">
                <div className="animated-pet pet-1"></div>
                <div className="animated-pet pet-2"></div>
                <div className="hero-content">
                    <h1>Crafted with love, curated for tails.</h1>
                    <p>Discover the perfect products to make your best friend happy.</p>
                    <div className="cta-buttons">
                        <Link to="/store" className="paw-button">
                            Shop Treats
                        </Link>
                        {/* You can link this to a future quiz page */}
                        <Link to="/quiz" className="paw-button">
                            Find Your Match
                        </Link>
                    </div>
                </div>
            </div>

            <StoryCarousel />

            {/* ADDED: The new Pet Quote Generator section */}
            <PetQuoteGenerator />

        </div>
    );
}

export default HomePage;