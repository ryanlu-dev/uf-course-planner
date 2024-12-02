import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoadingSpinner.css";

const RedirToProfile = ({ onRedirectComplete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth/profile");
      if (onRedirectComplete) onRedirectComplete();
    }, 1500);

    return () => clearTimeout(timer); // Cleanup timeout if the component unmounts
  }, [navigate, onRedirectComplete]);

  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Redirecting to profile page...</p>
    </div>
  );
};

export default RedirToProfile;