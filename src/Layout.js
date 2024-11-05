// src/Layout.js
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css"; 
import { HeaderBar } from "./HeaderBar/HeaderBar";
import {
    FaHome,
    FaBook,
    FaGraduationCap,
    FaCalendarAlt,
    FaChartBar,
    FaCog,
    FaQuestionCircle,
    FaBars,
} from "react-icons/fa";

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="layout-container">
            {/* Collapsible Sidebar */}
            <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                {/* Collapse Button - Moved inside the sidebar */}
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <FaBars />
                </button>

                {/* Logo */}
                {!isCollapsed && <div className="logo">UF Planner</div>}

                {/* Menu */}
                <ul className="menu-list">
                    <li>
                        <Link to="/">
                            <FaHome className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Home</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/courses">
                            <FaBook className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Courses</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/degree-plan">
                            <FaGraduationCap className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Degree Plan</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/schedule">
                            <FaCalendarAlt className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Schedule</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/grades">
                            <FaChartBar className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Grades</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings">
                            <FaCog className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Settings</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/help">
                            <FaQuestionCircle className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Help</span>}
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main content */}
            <div className="content">
                <HeaderBar />
                {/* Routed page content */}
                <main className="layout-content">
                    <Outlet />
                </main>

                <footer className="layout-footer">
                    <p>&copy; 2024 UF Course Planner</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
