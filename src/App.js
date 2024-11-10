import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { redirect } from "react-router-dom";
import SplashScreen from "./Pages/SplashScreen";
import HomePage from "./Pages/HomePage";
import Courses from "./Pages/Courses";
import DegreePlan from "./Pages/DegreePlan";
import Schedule from "./Pages/Schedule";
import Grades from "./Pages/Grades";
import Settings from "./Pages/Settings";
import Help from "./Pages/Help";
import LoginPage from "./LoginPage/Login";
import RegisterPage from "./LoginPage/Register";
import Layout from "./Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/.auth/me")
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.clientPrincipal ? true : false));
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SplashScreen />} />
        
        {/* Layout route that wraps all the pages */}
        <Route path="/auth" render={() =>isAuthenticated ? <Layout /> : <redirect to="/" />}>
          <Route index render={() =>isAuthenticated ? <HomePage /> : <redirect to="/" />}/>
          <Route path="courses" render={() =>isAuthenticated ? <Courses /> : <redirect to="/" />}/>
          <Route path="degree-plan" render={() =>isAuthenticated ? <DegreePlan /> : <redirect to="/" />}/>
          <Route path="schedule" render={() =>isAuthenticated ? <Schedule /> : <redirect to="/" />}/>
          <Route path="grades" render={() =>isAuthenticated ? <Grades /> : <redirect to="/" />}/>
          <Route path="settings" render={() =>isAuthenticated ? <Settings /> : <redirect to="/" />}/>
          <Route path="help" render={() =>isAuthenticated ? <Help /> : <redirect to="/" />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
