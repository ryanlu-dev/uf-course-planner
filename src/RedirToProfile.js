import React, { useEffect } from "react";
import "./LoadingSpinner.css";

const RedirToProfile = ({ onRedirectComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/auth/profile";
      if (onRedirectComplete) onRedirectComplete();
    }, 1500);

    return () => clearTimeout(timer); // Cleanup timeout if the component unmounts
  }, [onRedirectComplete]);

  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Redirecting to profile page...</p>
    </div>
  );
};

export default RedirToProfile;