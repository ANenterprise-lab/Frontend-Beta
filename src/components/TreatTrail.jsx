// src/components/TreatTrail.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './TreatTrail.css'; // This file will be created next

const TreatTrail = ({ crumbs }) => {
    return (
        <nav className="treat-trail">
            {crumbs.map((crumb, index) => (
                <div key={index} className="trail-item">
                    <Link to={crumb.path}>{crumb.label}</Link>
                    {index < crumbs.length - 1 && <span className="trail-separator">🐾</span>}
                </div>
            ))}
        </nav>
    );
};

export default TreatTrail;