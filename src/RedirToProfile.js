import React from "react";
import "./LoadingSpinner.css";

const RedirToProfile = () => {
  React.useEffect(() => {
    window.location.href = "https://ufcourseplanner.ryanlu.dev/auth/profile";
  }, []);
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Redirecting to profile page...</p>
    </div>
  );
};

export default RedirToProfile;