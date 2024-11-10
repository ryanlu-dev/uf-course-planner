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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    } else {
      fetch("/.auth/me")
        .then((res) => res.json())
        .then((data) => {
          console.log("Authentication data:", data); // Log the response
          const authStatus = data.clientPrincipal ? true : false;
          sessionStorage.setItem("isAuthenticated", authStatus.toString());
          setIsAuthenticated(authStatus);
          console.log("authStatus state: ", authStatus);
        })
        .catch((err) => {
          console.error("Error fetching auth data:", err); // Handle errors
          setIsAuthenticated(false); // Default to false if there's an error
        });
    }
  }, []);

  console.log("isAuthenticated status: ", isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        
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
