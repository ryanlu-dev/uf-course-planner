import React from "react";
import { UserDropdown } from "./UserDropdown/UserDropdown";
import "./HeaderBar.css"; // Add styles for the header component

export const HeaderBar = () => {
  return (
    <header className="header-bar">
      <h1 className="header-title">
        <span className="highlight-uf">UF</span> Course Planner
      </h1>
      <UserDropdown />
    </header>
  );
};
