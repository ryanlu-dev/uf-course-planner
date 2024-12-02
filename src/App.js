import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import AboutPage from "./LandingPage/AboutPage/Aboutpage";
import HomePage from "./Pages/HomePage";
import Courses from "./Pages/Courses";
import DegreePlan from "./Pages/DegreePlan";
import Schedule from "./Pages/Schedule";
import Grades from "./Pages/Grades";
import Settings from "./Pages/Settings";
import Help from "./Pages/Help";
import Profile from "./ProfilePage/Profile";
import Layout from "./Layout";
import AzureLoginRedirect from "./Pages/AzureLoginRedirect";
import AzureLogoutRedirect from "./Pages/AzureLogoutRedirect";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Check if auth status has been determined
  const [registeredStatus, setRegisteredStatus] = useState(false);

  useEffect(() => {
    setIsAuthenticated(false);
    setAuthChecked(false);
    setRegisteredStatus(false);
    const storedAuth = sessionStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      setAuthChecked(true); // Auth check complete
    } else {
      fetch("/.auth/me")
        .then((res) => res.json())
        .then((data) => {
          const authStatus = data.clientPrincipal ? true : false;
          sessionStorage.setItem("isAuthenticated", authStatus.toString());
          if (authStatus) {
            sessionStorage.setItem("azure_id", data.clientPrincipal.userId); // Store Azure ID
            sessionStorage.setItem("email", data.clientPrincipal.userDetails); // Store user email
          }
          setIsAuthenticated(authStatus);
          setAuthChecked(true); // Auth check complete
        })
        .catch((err) => {
          console.error("Error fetching auth data:", err);
          setIsAuthenticated(false);
          setAuthChecked(true); // Ensure auth check completes even on error
        });
    }
  }, []);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const storedAzureId = sessionStorage.getItem("azure_id");
      if (storedAzureId) {
        try {
          const response = await fetch(`/api/getUserInfo?azure_id=${encodeURIComponent(storedAzureId)}`);
          if (response.ok) {
            const data = await response.json();
            setRegisteredStatus(!!data); // If the response data exists, user is registered
          } else {
            console.error("Error checking registration status:", response.status);
            setRegisteredStatus(false); // Default to false if API call fails
          }
        } catch (error) {
          console.error("Error during API call:", error);
          setRegisteredStatus(false);
        }
      } else {
        setRegisteredStatus(false);
      }
    };
  
    if (isAuthenticated) {
      checkRegistrationStatus();
    }
  }, [isAuthenticated]);
  

  // Render nothing until authentication status is confirmed
  if (!authChecked) return null;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated 
              ? !registeredStatus
                ? <Navigate to="/auth/profile" />
                : <LandingPage />
              : <LandingPage />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/auth" /> : <AzureLoginRedirect />
          }
        />
        <Route
          path="/logout"
          element={isAuthenticated ? <AzureLogoutRedirect /> : <LandingPage />}
        />
        <Route path="/about" element={<AboutPage />} />
        {/* Protect all /auth routes */}
        <Route
          path="/auth"
          element={isAuthenticated && registeredStatus ? <Layout /> : <Navigate to="/" />}
        >
          <Route
            index
            element={isAuthenticated && registeredStatus ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="courses"
            element={isAuthenticated && registeredStatus ? <Courses /> : <Navigate to="/" />}
          />
          <Route
            path="degree-plan"
            element={isAuthenticated && registeredStatus ? <DegreePlan /> : <Navigate to="/" />}
          />
          <Route
            path="schedule"
            element={isAuthenticated && registeredStatus ? <Schedule /> : <Navigate to="/" />}
          />
          <Route
            path="grades"
            element={isAuthenticated && registeredStatus ? <Grades /> : <Navigate to="/" />}
          />
          <Route
            path="settings"
            element={isAuthenticated && registeredStatus ? <Settings /> : <Navigate to="/" />}
          />
          <Route
            path="help"
            element={isAuthenticated && registeredStatus ? <Help /> : <Navigate to="/" />}
          />
          <Route
            path="profile"
            element={isAuthenticated && registeredStatus ? <Profile /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
