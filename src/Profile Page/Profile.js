import React, { useState } from "react";
import Select from "react-select";
import "./Profile.css";

const Profile = () => {
  const [major, setMajor] = useState("");
  const [courseload, setCourseload] = useState("");
  const [gradDate, setGradDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile saved!" + major + courseload + gradDate);
  };

  const tempMajors = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Electrical Engineering", label: "Electrical Engineering" },
    // this is temp, we should be getting this from database
  ];

  // Generates the visible graduation date options based on the current day
  // Displays: current semester + semesters for the next 4 years
  // NOTE: no summer a/b support yet
  const generateGradOptions = () => {
    const date = new Date();
    let currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    const terms = ["Spring", "Summer", "Fall"];

    const options = [];

    let startTermIndex;
    if (currentMonth >= 0 && currentMonth <= 4) startTermIndex = 0; // Spring
    else if (currentMonth >= 5 && currentMonth <= 7)
      startTermIndex = 1; // Summer
    else startTermIndex = 2;

    for (let i = 0; i < 4 * terms.length; i++) {
      const term = terms[startTermIndex];
      options.push({
        value: `${term} ${currentYear}`,
        label: `${term} ${currentYear}`,
      });

      // Move to the next term
      startTermIndex = (startTermIndex + 1) % terms.length;
      if (startTermIndex === 0) currentYear++;
    }
    return options;
  };

  const graduationOptions = generateGradOptions();

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      {/* User information goes here! */}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="major">Major</label>
          <Select
            id="major"
            options={tempMajors}
            onChange={(selectedOption) => setMajor(selectedOption?.value || "")}
            placeholder="Select your major"
          />
        </div>
        <div>
          <label htmlFor="courseload">Desired Courseload</label>
          <div className="courseload-options">
            <label>
              <input
                type="radio"
                name="courseload"
                value="9-12"
                checked={courseload === "9-12"}
                onChange={(e) => setCourseload(e.target.value)}
              />
              Light: 9–12 credits (low-intensity)
            </label>
            <label>
              <input
                type="radio"
                name="courseload"
                value="13-15"
                checked={courseload === "13-15"}
                onChange={(e) => setCourseload(e.target.value)}
              />
              Moderate: 13–15 credits (balanced)
            </label>
            <label>
              <input
                type="radio"
                name="courseload"
                value="16+"
                checked={courseload === "16+"}
                onChange={(e) => setCourseload(e.target.value)}
              />
              Heavy: 16+ credits (high-intensity)
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="grad-date">Planned Graduation Date</label>
          <Select
            id="grad-date"
            options={graduationOptions}
            onChange={(selectedOption) =>
              setGradDate(selectedOption?.value || "")
            }
            placeholder="Select planned graduation date"
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
