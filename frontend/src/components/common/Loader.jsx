import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="loader-fullscreen">
                <div className="loader-container">
                    <div className="loader-spinner"></div>
                    <p className="loader-text">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="loader-container">
            <div className="loader-spinner"></div>
        </div>
    );
};

export default Loader;
