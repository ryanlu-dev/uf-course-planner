import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import "./Profile.css";

const Profile = () => {
  const [major, setMajor] = useState("");
  const [majorOptions, setMajorOptions] = useState([]);
  const [courseload, setCourseload] = useState("");
  const [gradDate, setGradDate] = useState("");

  const azure_id = sessionStorage.getItem("azure_id");
  const email = sessionStorage.getItem("email");
  const [isMajorsLoading, setIsMajorsLoading] = useState(true);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile saved!" + major + courseload + gradDate);
  };

  // Generates the visible graduation date options based on the current day
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
    else startTermIndex = 2; // Fall

    for (let i = 0; i < 4 * terms.length; i++) {
      const term = terms[startTermIndex];
      options.push({
        value: `${term} ${currentYear}`,
        label: `${term} ${currentYear}`,
      });

      startTermIndex = (startTermIndex + 1) % terms.length;
      if (startTermIndex === 0) currentYear++;
    }
    return options;
  };

  const graduationOptions = generateGradOptions();

  const fetchUserInfo = useCallback(async (a_id) => {
    try {
      const response = await fetch(
        `/api/getUserInfo?azure_id=${encodeURIComponent(a_id)}`
      );
      if (!response.ok) {
        console.error("Failed to fetch user info:", response.statusText);
        return;
      }
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setIsUserInfoLoading(false);
    }
  }, []);

  const fetchMajors = useCallback(async () => {
    try {
      const response = await fetch(`/api/getAllMajors`);
      if (!response.ok) {
        console.error("Failed to fetch majors", response.statusText);
        return;
      }
      const data = await response.json();
      const formattedMajors = data.map((major) => ({
        value: major.major_id,
        label: major.name,
      }));
      setMajorOptions(formattedMajors);
    } catch (error) {
      console.error("Error fetching majors", error);
    } finally {
      setIsMajorsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (azure_id) {
      fetchMajors();
      fetchUserInfo(azure_id);
    }
  }, [azure_id, fetchMajors, fetchUserInfo]);

  const isLoading = isMajorsLoading || isUserInfoLoading;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div>
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading Profile...</p>
          </div>
        ) : userInfo & majorOptions ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Major</th>
                  <th>College</th>
                  <th>Current Semester</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userInfo.user_name}</td>
                  <td>{email}</td>
                  <td>{userInfo.major_name}</td>
                  <td>{userInfo.college_name}</td>
                  <td>{userInfo.current_semester}</td>
                </tr>
              </tbody>
            </table>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="major">Major</label>
                <Select
                  id="major"
                  options={majorOptions}
                  onChange={(selectedOption) =>
                    setMajor(selectedOption?.value || "")
                  }
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
          </>
        ) : (
          <p>Failed to load profile information.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;