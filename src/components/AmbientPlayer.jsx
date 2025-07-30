// src/components/AmbientPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './MuteButton.css';

const AmbientPlayer = ({ isNight }) => {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if (audioRef.current) {
            const newMutedState = !isMuted;
            audioRef.current.muted = newMutedState;
            setIsMuted(newMutedState);

            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.1;
        }
    }, []);

    if (!isNight) {
        return null;
    }

    return (
        <div>
            <audio ref={audioRef} loop autoPlay muted={isMuted}>
                {/* CORRECTED: Using a direct public path to the audio file */}
                <source src="/audio/ambient-music.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <button onClick={toggleMute} className="mute-button">
                {isMuted ? '🔇' : '🔊'}
            </button>
        </div>
    );
};

export default AmbientPlayer;