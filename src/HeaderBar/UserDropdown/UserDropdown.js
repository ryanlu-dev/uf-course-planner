import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDropdown.css";

export const UserDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="user-dropdown">
      <div className="user-icon" onClick={toggleDropdown}>
        user icon
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              navigate("/settings");
            }}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
};
