import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./UserDropdown.css";

export const UserDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest(".user-dropdown")) {
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
            <div className="user-icon" onClick={toggleDropdown} role="button" aria-label="User menu">
                <FaUserCircle size={24} /> {/* Explicitly set the size */}
            </div>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <button
                        onClick={() => {
                            navigate("/auth/profile");
                            setIsDropdownOpen(false);
                        }}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => {
                            navigate("/logout");
                            setIsDropdownOpen(false);
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};