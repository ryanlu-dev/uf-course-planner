import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";
import { UserDropdown } from "./HeaderBar/UserDropdown/UserDropdown";
import {
    FaHome,
    FaBook,
    FaGraduationCap,
    FaCalendarAlt,
    FaBars,
} from "react-icons/fa";

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                {/* Collapse Button */}
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                {/* Logo */}
                {!isCollapsed && (
                    <div className="logo">
                        <span className="highlight-uf">UF</span> Planner
                    </div>
                )}
                {/* Menu */}
                <ul className="menu-list">
                    <li>
                        <Link to="/auth">
                            <FaHome className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Home</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/auth/courses">
                            <FaBook className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Courses</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/auth/degree-plan">
                            <FaGraduationCap className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Degree Plan</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/auth/schedule">
                            <FaCalendarAlt className="menu-icon" />
                            {!isCollapsed && <span className="menu-text">Schedule</span>}
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main content area */}
            <div className="content">
                {/* Header */}
                <header className="header-bar">
                    <h1 className="header-title">
                        <span className="highlight-uf">UF</span> Course Planner
                    </h1>
                    <UserDropdown />
                </header>

                {/* Main content */}
                <main className="layout-content">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="layout-footer">
                    <p>&copy; 2024 UF Course Planner</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;