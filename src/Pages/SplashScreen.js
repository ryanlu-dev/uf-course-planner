import React from 'react';
import './Styles/HomePage.css';

const SplashScreen = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the <span className="highlight">UF Course Planner</span></h1>
                <p>Your personalized platform for academic planning and progress tracking.</p>
            </header>

            <main className="home-main">
                <h1>
                    <a href="/login"> Please log in! </a>
                </h1>
            </main>

        </div>
    );
};

export default SplashScreen;