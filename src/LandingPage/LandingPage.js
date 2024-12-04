import React from "react";
import "./LandingPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="landing-header">
        <div className="logo-container">
          <h2>
            <span className="highlight">UF Course Planner</span>
          </h2>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">How it Works</Link>
          <a
            href="https://github.com/bquintopng/uf-course-planner"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="landing-main">
        <div className="main-content">
          <h1 className="main-title">The All-In-One Scheduling Tool</h1>
          <p className="description">
            Tired of struggling to make sense of what classes to take with which
            professor at some time?
            <br />
            Introducing the UF Course Planner:
            <br />
            Your personalized platform for academic planning and progress
            tracking.
          </p>
          <div className="cta-buttons">
            <button
              className="cta-button primary"
              onClick={() => navigate("/login")}
            >
              Sign in with Microsoft <FaMicrosoft className="shift-logo" />
            </button>
          </div>
        </div>
        <div className="demo-image">
          <img src="demoimg.png" alt="UF Course Planner demo" />
        </div>
      </main>

      {/* Team Section */}
      <section className="team-section">
        <h2>Our Lovely Team</h2>
        <div className="team-cards">
          {[
            {
              name: "Ryan",
              title: "Scrum Master & Developer",
              linkedin: "https://www.linkedin.com/in/-ryan-lu-/",
            },
            {
              name: "Connor",
              title: "Frontend Developer",
              linkedin: "https://www.linkedin.com/in/connorcurcio/",
            },
            {
              name: "Donovan",
              title: "Backend Developer",
              linkedin: "https://www.linkedin.com/in/donovanspall/",
            },
            {
              name: "Ben",
              title: "Project Manager & Developer",
              linkedin: "https://www.linkedin.com/in/benqr",
            },
          ].map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-photo">
                <img
                  src={"pfps/" + member.name + ".jpeg"}
                  alt={`${member.name}`}
                />
              </div>
              <h3>{member.name}</h3>
              <p>{member.title}</p>
              <div className="social-icons">
                <Link to={member.linkedin} target="_blank">
                  <FaLinkedin className="linkedin-icon" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
