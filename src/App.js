import React, { useEffect, useState, useCallback } from "react";
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(false);

  // Authentication process
  useEffect(() => {
    setIsAuthenticated(false);
    setAuthChecked(false);
    setIsRegistered(false);
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

  const [userInfo, setUserInfo] = useState(null);
  const fetchUserInfo = useCallback(async (a_id) => {
    try {
      setIsUserInfoLoading(true);
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

  const azure_id = sessionStorage.getItem("azure_id");
  useEffect(() => {
    const loadUserInfo = async () => {
      if (authChecked && azure_id) {
        try {
          const fetchedUserInfo = await fetchUserInfo(azure_id);
          setIsRegistered(fetchedUserInfo && Object.keys(fetchedUserInfo).length > 0);
        } catch (error) {
          console.error("Error during user info loading:", error);
        }
      }
    };
  
    loadUserInfo();
  }, [authChecked, azure_id, fetchUserInfo]);
  
  

  if (!authChecked || isUserInfoLoading) {
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
            element={isRegistered ? <HomePage /> : <Navigate to="/auth/profile" />}
          />
          <Route
            path="courses"
            element={isRegistered ? <Courses /> : <Navigate to="/auth/profile" />}
          />
          <Route
            path="degree-plan"
            element={isRegistered ? <DegreePlan /> : <Navigate to="/auth/profile" />}
          />
          <Route
            path="schedule"
            element={isRegistered ? <Schedule /> : <Navigate to="/auth/profile" />}
          />
          <Route
            path="grades"
            element={isRegistered ? <Grades /> : <Navigate to="/auth/profile" />}
          />
          <Route
            path="settings"
            element={isRegistered ? <Settings /> : <Navigate to="/auth/profile" />}
          />
          <Route
            path="help"
            element={isRegistered ? <Help /> : <Navigate to="/auth/profile" />}
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