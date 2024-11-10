import React from 'react';
import { Link } from 'react-router-dom';
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
                  <a href="/login?post_login_redirect_uri=https://youtube.com"> Please log in! </a>
                </h1>
            </main>

        </div>
    );
};

export default SplashScreen;