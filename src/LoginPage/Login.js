import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login for now by storing username in localStorage
    localStorage.setItem("user", username);
    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="close-button" onClick={() => navigate("/")}>
          &times;
        </button>
        <h2>UF Course Planner</h2>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/register">Sign up now</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
