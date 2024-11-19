import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Reuse the same CSS styles

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Mock registration logic
    console.log("Registering user:", { username, email });
    navigate("/"); // Redirect to login after registration
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
