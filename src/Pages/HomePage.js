import React, { useState } from 'react';
import './Styles/HomePage.css';
import AutoScheduler from './AutoScheduler';

const HomePage = () => {
    const [showAutoScheduler, setShowAutoScheduler] = useState(false);
    const signedUpSections = JSON.parse(localStorage.getItem('signedUpSections') || '[]');
    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

    const getTimeFromString = (timeString) => {
        const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!timeMatch) return 0;

        let [_, hours, minutes, period] = timeMatch;
        hours = parseInt(hours);
        if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

        return hours * 60 + parseInt(minutes);
    };

    const sortedEvents = (day) => {
        return calendarEvents
            .filter(event => event.meeting_times.includes(day))
            .sort((a, b) => {
                const timeA = getTimeFromString(a.meeting_times);
                const timeB = getTimeFromString(b.meeting_times);
                return timeA - timeB;
            });
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the <span className="highlight">UF Course Planner</span></h1>
                <p>Your academic dashboard</p>
                <div className="auto-schedule-button-container">
                    <button
                        onClick={() => setShowAutoScheduler(!showAutoScheduler)}
                        className="auto-schedule-button"
                    >
                        {showAutoScheduler ? 'Hide Auto Scheduler' : '✨ Auto Schedule My Semester'}
                    </button>
                </div>
            </header>

            <main className="home-main">
                {showAutoScheduler && (
                    <div className="auto-scheduler-container">
                        <AutoScheduler />
                    </div>
                )}

                <div className="dashboard-grid">
                    <div className="dashboard-item current-courses">
                        <h3>Current Courses</h3>
                        {signedUpSections.length > 0 ? (
                            <div className="courses-list">
                                {signedUpSections.map(section => (
                                    <div key={section.section_id} className="course-card">
                                        <div className="course-header">
                                            <h4>{section.courseTitle}</h4>
                                            <span className="credits">{section.credits} Credits</span>
                                        </div>
                                        <div className="course-title">{section.course_code}</div>
                                        <p><strong>Instructor:</strong> {section.instructor}</p>
                                        <p><strong>Room:</strong> {section.room}</p>
                                        <p><strong>Time:</strong> {section.meeting_times}</p>
                                        {section.prerequisites && (
                                            <p><strong>Prerequisites:</strong> {section.prerequisites}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-state">
                                No courses registered yet. Try using the Auto Schedule feature above!
                            </p>
                        )}
                    </div>

                    <div className="dashboard-item schedule">
                        <h3>Weekly Schedule</h3>
                        <div className="schedule-grid">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                <div key={day} className="schedule-day">
                                    <h5>{day}</h5>
                                    <div className="day-events">
                                        {sortedEvents(day).map(event => (
                                            <div key={event.section_id} className="schedule-event">
                                                <span>{event.course_code}</span>
                                                <small>{event.meeting_times}</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;