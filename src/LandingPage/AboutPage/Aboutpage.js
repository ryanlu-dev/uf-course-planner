import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMicrosoft } from "react-icons/fa";

import "./AboutPage.css";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <>
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
      <div className="about-container">
        <h2 className="about-subtitle">How It Works</h2>

        <section className="about-section">
          <h3>Problem Statement</h3>
          <p>
            Academic planning is a critical yet overwhelming process,
            particularly for freshmen and transfer students. The unnecessary
            complexity of this process often creates stress and can lead to
            confusion about degree requirements.
          </p>
        </section>

        <section className="about-section">
          <h3>Our Solution</h3>
          <p>UF Course Planner simplifies academic planning by providing:</p>
          <ul>
            <li>
              A centralized hub for tracking requirements and visualizing
              progress.
            </li>
            <li>
              Interactive scheduling to help students manage their semester with
              ease.
            </li>
            <li>
              User-friendly features designed to enhance the overall experience.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h3>Current Features</h3>
          <ul>
            <li>
              <strong>Profile Management:</strong> Input essential details such
              as your major and graduation date to personalize your planning
              experience.
            </li>
            <li>
              <strong>Course Search & Add:</strong> Easily search for courses,
              browse sections, and build your schedule.
            </li>
            <li>
              <strong>Degree Plan Tracking:</strong> Visualize your progress
              through your major’s degree requirements and make informed
              academic decisions.
            </li>
            <li>
              <strong>Schedule Visualization:</strong> View a complete,
              customizable weekly schedule to keep track of your classes.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h3>Software Architecture</h3>
          <ul>
            <li>
              <strong>User Authentication:</strong> Microsoft Azure Active
              Directory ensures secure login, with session-based persistence
              using local storage.
            </li>
            <li>
              <strong>Backend API:</strong> Built with Azure Functions and
              Node.js, our backend uses RESTful APIs for seamless data
              interactions. SQL queries are processed and results are retrieved
              from Azure PostgreSQL databases.
            </li>
            <li>
              <strong>Frontend Development:</strong> Built with HTML, CSS, and
              JavaScript for a responsive user experience.
            </li>
          </ul>
        </section>

        <section class="cta-section">
          <h3>Ready to Simplify Your Academic Planning?</h3>
          <p>
            Sign up today and take control of your academic journey with UF
            Course Planner!
          </p>
          <button
            className="cta-button primary"
            onClick={() => navigate("/login")}
          >
            Sign in with Microsoft <FaMicrosoft className="shift-logo" />
          </button>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
