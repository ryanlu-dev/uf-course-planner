import React, { useState } from "react";
import "./Styles/Profile.css";

const Profile = () => {
  const [major, setMajor] = useState("");
  const [courseload, setCourseload] = useState("");
  const [gradDate, setGradDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile saved!");
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="major">Major</label>
          <input
            type="text"
            id="major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="Enter your major"
          />
        </div>
        <div>
          <label htmlFor="courseload">Desired Courseload</label>
          <input
            type="text"
            id="courseload"
            value={courseload}
            onChange={(e) => setCourseload(e.target.value)}
            placeholder="Enter desired courseload"
          />
        </div>
        <div>
          <label htmlFor="grad-date">Planned Graduation Date</label>
          <input
            type="date"
            id="grad-date"
            value={gradDate}
            onChange={(e) => setGradDate(e.target.value)}
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
