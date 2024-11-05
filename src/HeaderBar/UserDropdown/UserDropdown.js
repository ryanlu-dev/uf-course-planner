// src/HeaderBar/UserDropdown/UserDropdown.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import a user icon
import "./UserDropdown.css";

export const UserDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close the dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isDropdownOpen &&
                !event.target.closest(".user-dropdown")
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="user-dropdown">
            <div className="user-icon" onClick={toggleDropdown}>
                <FaUserCircle />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <button
                        onClick={() => {
                            navigate("/login");
                            setIsDropdownOpen(false);
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => {
                            navigate("/settings");
                            setIsDropdownOpen(false);
                        }}
                    >
                        Settings
                    </button>
                </div>
            )}
        </div>
    );
};