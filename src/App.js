import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SplashScreen from "./Pages/SplashScreen";
import HomePage from "./Pages/HomePage";
import Courses from "./Pages/Courses";
import DegreePlan from "./Pages/DegreePlan";
import Schedule from "./Pages/Schedule";
import Grades from "./Pages/Grades";
import Settings from "./Pages/Settings";
import Help from "./Pages/Help";
import Layout from "./Layout";
import AzureLoginRedirect from "./Pages/AzureLoginRedirect";
import AzureLogoutRedirect from "./Pages/AzureLogoutRedirect";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Check if auth status has been determined

  useEffect(() => {
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

  // Render nothing until authentication status is confirmed
  if (!authChecked) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/auth" /> : <SplashScreen />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/auth" /> : <AzureLoginRedirect />} />
        <Route path="/logout" element={isAuthenticated ? <AzureLogoutRedirect /> : <SplashScreen />} />
        {/* Protect all /auth routes */}
        <Route
          path="/auth"
          element={isAuthenticated ? <Layout /> : <Navigate to="/" />}
        >
          <Route index element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />
          <Route path="courses" element={isAuthenticated ? <Courses /> : <Navigate to="/" />} />
          <Route path="degree-plan" element={isAuthenticated ? <DegreePlan /> : <Navigate to="/" />} />
          <Route path="schedule" element={isAuthenticated ? <Schedule /> : <Navigate to="/" />} />
          <Route path="grades" element={isAuthenticated ? <Grades /> : <Navigate to="/" />} />
          <Route path="settings" element={isAuthenticated ? <Settings /> : <Navigate to="/" />} />
          <Route path="help" element={isAuthenticated ? <Help /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
