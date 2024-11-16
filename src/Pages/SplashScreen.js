import React from 'react';
import './Styles/SplashScreen.css';
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
    const navigate = useNavigate(); 
    return (
        <div className="splash-page">
            <div className="splash-container-1">
                <header className="splash-header">
                    <h1>Welcome to the <span className="highlight">UF Course Planner</span></h1>
                    <p>Your personalized platform for academic planning and progress tracking.</p>
                </header>
                <main className="splash-main">
                    <div className="login-button">
                        <button onClick={() => { navigate("/login/"); }}>
                            Login
                        </button>
                    </div>
                </main>
            </div>
            <div className="splash-container-2">
                <h1>
                    Item 1
                </h1>
            </div>
            <div className="splash-container-2">
                <h1>
                    Item 2
                </h1>
            </div>
            <div className="splash-container-2">
                <h1>
                    Item 3
                </h1>
            </div>
        </div>
    );
};

export default SplashScreen;