// src/pages/AboutUsPage.jsx
import React from 'react';
import './AboutUsPage.css';

const teamMembers = [
    {
        name: 'Alex Doe',
        role: 'Founder & Chief Pet Officer',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        petAvatarUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500',
    },
    {
        name: 'Jane Smith',
        role: 'Head of Treats',
        // CORRECTED: Replaced blocked Unsplash image with a working one from Pexels
        avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
        petAvatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500',
    },
    {
        name: 'Sam Wilson',
        role: 'Toy Expert',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500',
        petAvatarUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
    },
];

// ... rest of the component remains the same
function AboutUsPage() {
    return (
        <div className="about-us-container">
            <section className="about-section">
                <h1>Our Pack</h1>
                <div className="our-pack-grid">
                    {teamMembers.map(member => (
                        <div key={member.name} className="team-member-card">
                            <div className="avatar-container">
                                <img src={member.avatarUrl} alt={member.name} className="team-member-avatar" />
                                <img src={member.petAvatarUrl} alt="pet" className="pet-avatar" />
                            </div>
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="about-section">
                <h1>Why We Bark</h1>
                <p className="manifesto-text">
                    We believe the purest joy comes from a happy tail wag, a gentle purr, and the unconditional love of a pet...
                </p>
            </section>
        </div>
    );
}

export default AboutUsPage;