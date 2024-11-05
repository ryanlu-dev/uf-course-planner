import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the <span className="highlight">UF Course Planner</span></h1>
                <p>Your personalized platform for academic planning and progress tracking.</p>
            </header>

            <main className="home-main">
                <div className="widget-grid">
                    <div className="widget">
                        <h3>Courses</h3>
                        <p>Manage and view the courses you are enrolled in.</p>
                        <Link to="/courses">
                            <button className="widget-button">Go to Courses</button>
                        </Link>
                    </div>
                    <div className="widget">
                        <h3>Degree Plan</h3>
                        <p>Track your degree progress and plan future courses.</p>
                        <Link to="/degree-plan">
                            <button className="widget-button">Go to Degree Plan</button>
                        </Link>
                    </div>
                    <div className="widget">
                        <h3>Schedule</h3>
                        <p>View your upcoming class schedule and make adjustments.</p>
                        <Link to="/schedule">
                            <button className="widget-button">Go to Schedule</button>
                        </Link>
                    </div>
                    <div className="widget">
                        <h3>Grades</h3>
                        <p>Track your grades and monitor your academic performance.</p>
                        <Link to="/grades">
                            <button className="widget-button">Go to Grades</button>
                        </Link>
                    </div>
                    <div className="widget">
                        <h3>Settings</h3>
                        <p>Adjust your account and application settings.</p>
                        <Link to="/settings">
                            <button className="widget-button">Go to Settings</button>
                        </Link>
                    </div>
                    <div className="widget">
                        <h3>Help</h3>
                        <p>Need assistance? Find answers to your questions here.</p>
                        <Link to="/help">
                            <button className="widget-button">Go to Help</button>
                        </Link>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default HomePage;
