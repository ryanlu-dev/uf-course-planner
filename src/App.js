import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
import LoadingSpinner from "./LoadingSpinner";

function App() {
  // States for global-checks
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication process
  useEffect(() => {
    setIsAuthenticated(false);
    setAuthChecked(false);
    const storedAuth = sessionStorage.getItem("isAuthenticated");
    if (storedAuth === "true") { // If the session remembers the user, they have passsed auth
      setIsAuthenticated(true);
      setAuthChecked(true);
    } else {
      fetch("/.auth/me")
        .then((res) => res.json())
        .then((data) => {
          const authStatus = data.clientPrincipal ? true : false; // clientPrincipal only returned on valid user
          sessionStorage.setItem("isAuthenticated", authStatus.toString());
          if (authStatus) {
            sessionStorage.setItem("azure_id", data.clientPrincipal.userId);
            sessionStorage.setItem("email", data.clientPrincipal.userDetails);
          }
          setIsAuthenticated(authStatus);
          setAuthChecked(true);
        })
        .catch((err) => {
          console.error("Error fetching auth data:", err);
          setIsAuthenticated(false);
          setAuthChecked(true); // Ensure auth check completes even on error
        });
    }
  }, []);


  if (!authChecked) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/auth" />: <LandingPage />
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
          element={isAuthenticated ? <Layout /> : <Navigate to="/" />
          }
        >
          <Route
            index
            element={<HomePage />}
          />
          <Route
            path="courses"
            element={<Courses />}
          />
          <Route
            path="degree-plan"
            element={<DegreePlan />}
          />
          <Route
            path="schedule"
            element={<Schedule />}
          />
          <Route
            path="grades"
            element={<Grades />}
          />
          <Route
            path="settings"
            element={<Settings />}
          />
          <Route
            path="help"
            element={<Help />}
          />
          <Route
            path="profile"
            element={<Profile />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;