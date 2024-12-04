

import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';

const AutoScheduler = () => {
    const [modelSemesterPlan, setModelSemesterPlan] = useState(null);
    const [availableSections, setAvailableSections] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [previousCourses, setPreviousCourses] = useState([]);
    const [recommendedSchedule, setRecommendedSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [courseCount, setCourseCount] = useState(4);
    const [blockedDays, setBlockedDays] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState('Spring 2025');

    const azure_id = sessionStorage.getItem("azure_id");
    const msp = localStorage.getItem("msp");
    const availableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    // Parse all courses from HTML content
    const parseCoursesFromHTML = (htmlContent) => {
        const cleanContent = htmlContent.replace(/\n/g, ' ');
        const temp = document.createElement('div');
        temp.innerHTML = DOMPurify.sanitize(cleanContent);
        const text = temp.textContent;

        const coursePattern = /([A-Z]{3})\s*(\d{4})[^\d\n]*([^\n\(\)]*?)(?:\(([^\)]*prerequisites[^\)]*)\))?/gi;
        const courses = new Map();

        let match;
        while ((match = coursePattern.exec(text)) !== null) {
            const courseCode = match[1] + match[2];
            const courseName = match[3].trim();
            const prerequisites = match[4] ? parsePrerequisites(match[4]) : [];

            if (!courses.has(courseCode)) {
                courses.set(courseCode, {
                    code: courseCode,
                    name: courseName || courseCode,
                    prerequisites: prerequisites
                });
            }
        }

        return Array.from(courses.values());
    };

    // Parse prerequisites from text
    const parsePrerequisites = (prereqText) => {
        if (!prereqText) return [];
        const courseCodePattern = /([A-Z]{3})\s*(\d{4})/g;
        const prerequisites = [];
        let match;

        while ((match = courseCodePattern.exec(prereqText)) !== null) {
            prerequisites.push(match[1] + match[2]);
        }

        return prerequisites;
    };

    // Check if prerequisites are met
    const arePrerequisitesMet = (course, completedCourses) => {
        if (!course.prerequisites || course.prerequisites.length === 0) return true;
        return course.prerequisites.every(prereq => completedCourses.includes(prereq));
    };

    // Filter sections by term
    const filterSectionsByTerm = (sections) => {
        return sections.filter(section =>
            section.term && section.term.toLowerCase() === selectedTerm.toLowerCase()
        );
    };

    // Handle day blocking toggle
    const handleDayToggle = (day) => {
        setBlockedDays(prev => {
            const newBlockedDays = prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day];
            localStorage.setItem('blockedDays', JSON.stringify(newBlockedDays));
            return newBlockedDays;
        });
    };

    // Fetch available sections
    const fetchSections = useCallback(async () => {
        try {
            const endpoint = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                ? 'http://localhost:7071/api/getSections'
                : '/api/getSections';

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch sections');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setError('Error fetching sections: ' + error.message);
            return [];
        }
    }, []);

    // Check for time conflicts
    const hasTimeConflict = (section1, section2) => {
        if (!section1.meeting_times || !section2.meeting_times ||
            section1.meeting_times === "Not listed" ||
            section2.meeting_times === "Not listed") {
            return false;
        }

        const getDays = (timeString) => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            return days.filter(day => timeString.includes(day));
        };

        const getTimeRange = (timeString) => {
            const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/g);
            if (!timeMatch || timeMatch.length !== 2) return null;

            const convertTo24Hour = (time) => {
                const [rawTime, period] = time.split(' ');
                let [hours, minutes] = rawTime.split(':');
                hours = parseInt(hours);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                return hours * 60 + parseInt(minutes);
            };

            return {
                start: convertTo24Hour(timeMatch[0]),
                end: convertTo24Hour(timeMatch[1])
            };
        };

        const days1 = getDays(section1.meeting_times);
        const days2 = getDays(section2.meeting_times);
        const time1 = getTimeRange(section1.meeting_times);
        const time2 = getTimeRange(section2.meeting_times);

        if (!time1 || !time2) return false;

        const commonDays = days1.filter(day => days2.includes(day));
        if (commonDays.length === 0) return false;

        return !(time1.end <= time2.start || time1.start >= time2.end);
    };

    // Generate schedule
    const generateSchedule = useCallback((sections, completed) => {
        const termFilteredSections = filterSectionsByTerm(sections);

        const remainingCourses = allCourses
            .filter(course => !completed.includes(course.code))
            .filter(course => arePrerequisitesMet(course, completed));

        console.log("Eligible courses to schedule:", remainingCourses);

        let recommendedSections = [];
        let totalCredits = 0;
        let coursesScheduled = 0;

        const isOnBlockedDay = (section) => {
            if (!section.meeting_times || section.meeting_times === "Not listed") return false;
            return blockedDays.some(day => section.meeting_times.includes(day));
        };

        for (const course of remainingCourses) {
            if (coursesScheduled >= courseCount) break;

            const availableSectionsForCourse = termFilteredSections.filter(
                section => section.course_code === course.code && !isOnBlockedDay(section)
            );

            if (availableSectionsForCourse.length > 0) {
                const compatibleSection = availableSectionsForCourse.find(section =>
                    !recommendedSections.some(scheduled => hasTimeConflict(scheduled, section))
                );

                if (compatibleSection) {
                    const credits = parseFloat(compatibleSection.credits) || 3;
                    if (totalCredits + credits <= 18) {
                        recommendedSections.push(compatibleSection);
                        totalCredits += credits;
                        coursesScheduled++;
                    }
                }
            }
        }

        return recommendedSections;
    }, [allCourses, courseCount, blockedDays, selectedTerm]);

    // Handle checkbox changes
    const handleCourseToggle = (courseCode) => {
        setPreviousCourses(prev => {
            const newPreviousCourses = prev.includes(courseCode)
                ? prev.filter(code => code !== courseCode)
                : [...prev, courseCode];

            localStorage.setItem('previousCourses', JSON.stringify(newPreviousCourses));
            return newPreviousCourses;
        });
    };

    // Save schedule
    const saveSchedule = useCallback(() => {
        try {
            localStorage.setItem('signedUpSections', JSON.stringify(recommendedSchedule));
            localStorage.setItem('calendarEvents', JSON.stringify(recommendedSchedule));
            window.location.reload();
            return true;
        } catch (error) {
            setError('Error saving schedule: ' + error.message);
            return false;
        }
    }, [recommendedSchedule]);
    // Handle generate schedule button click
    const handleGenerateSchedule = () => {
        const schedule = generateSchedule(availableSections, previousCourses);
        setRecommendedSchedule(schedule);
        setShowSchedule(true);
    };

    // Initialize data
    useEffect(() => {
        const initializeScheduler = async () => {
            setIsLoading(true);
            try {
                let plan = null;
                if (msp) {
                    plan = JSON.parse(msp);
                } else if (azure_id) {
                    const endpoint = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                        ? `http://localhost:7071/api/getModelSemesterPlan?azure_id=${encodeURIComponent(azure_id)}`
                        : `/api/getModelSemesterPlan?azure_id=${encodeURIComponent(azure_id)}`;

                    const response = await fetch(endpoint);
                    plan = await response.json();
                    localStorage.setItem("msp", JSON.stringify(plan));
                }
                setModelSemesterPlan(plan);

                if (plan?.html) {
                    const courses = parseCoursesFromHTML(plan.html);
                    setAllCourses(courses);
                }

                const sections = await fetchSections();
                setAvailableSections(sections);

                const savedCourses = localStorage.getItem('previousCourses');
                if (savedCourses) {
                    setPreviousCourses(JSON.parse(savedCourses));
                }

                const savedBlockedDays = localStorage.getItem('blockedDays');
                if (savedBlockedDays) {
                    setBlockedDays(JSON.parse(savedBlockedDays));
                }
            } catch (error) {
                setError('Error initializing scheduler: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        initializeScheduler();
    }, [azure_id, msp, fetchSections]);

    if (isLoading) {
        return (
            <div className="auto-scheduler-loading">
                <div className="spinner"></div>
                <p>Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="auto-scheduler">
            {!showSchedule ? (
                <div className="course-checklist">
                    <div className="term-selector">
                        <label htmlFor="termSelect">Select Term:</label>
                        <select
                            id="termSelect"
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            className="term-select"
                        >
                            <option value="Spring 2025">Spring 2025</option>
                            <option value="Summer 2025">Summer 2025</option>
                            <option value="Fall 2025">Fall 2025</option>
                        </select>
                    </div>
                    <h3>Select Courses You've Completed</h3>
                    <div className="courses-grid">
                        {allCourses.map(course => (
                            <div key={course.code} className="course-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={previousCourses.includes(course.code)}
                                        onChange={() => handleCourseToggle(course.code)}
                                    />
                                    <span className="course-code">{course.code}</span>
                                    <span className="course-name">
                                        {course.name}
                                        {course.prerequisites && course.prerequisites.length > 0 && (
                                            <span className="prerequisites">
                                                Prerequisites: {course.prerequisites.join(', ')}
                                            </span>
                                        )}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="schedule-options">
                        <div className="day-blocking-section">
                            <h4>Block Out Days</h4>
                            <div className="day-toggles">
                                {availableDays.map(day => (
                                    <label key={day} className="day-toggle">
                                        <input
                                            type="checkbox"
                                            checked={blockedDays.includes(day)}
                                            onChange={() => handleDayToggle(day)}
                                        />
                                        <span>{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="course-count-selector">
                            <label htmlFor="courseCount">Number of Courses to Schedule:</label>
                            <select
                                id="courseCount"
                                value={courseCount}
                                onChange={(e) => setCourseCount(parseInt(e.target.value))}
                                className="course-count-select"
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? 'Course' : 'Courses'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="generate-schedule-btn"
                            onClick={handleGenerateSchedule}
                        >
                            Generate Schedule for {courseCount} {courseCount === 1 ? 'Course' : 'Courses'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="schedule-view">
                    <button
                        className="back-to-courses-btn"
                        onClick={() => setShowSchedule(false)}
                    >
                        Back to Course Selection
                    </button>
                    <h3>Recommended Schedule for {selectedTerm} ({courseCount} {courseCount === 1 ? 'Course' : 'Courses'})</h3>
                    {recommendedSchedule.length > 0 ? (
                        <>
                            <div className="recommended-sections">
                                {recommendedSchedule.map((section) => {
                                    const course = allCourses.find(c => c.code === section.course_code);
                                    const isOnline = !section.meeting_times || !section.room ||
                                        section.meeting_times === "Not listed" ||
                                        section.room === "Not listed";

                                    return (
                                        <div key={section.section_id} className="section-card">
                                            <h4>{section.course_code}</h4><div className="section-details">
                                                <p><span>Course Name:</span> {course?.name || 'Unknown Course'}</p>
                                                <p><span>Instructor:</span> {section.instructor}</p>
                                                {isOnline ? (
                                                    <p><span>Format:</span> Online Course</p>
                                                ) : (
                                                    <>
                                                        <p><span>Location:</span> {section.room}</p>
                                                        <p><span>Schedule:</span> {section.meeting_times}</p>
                                                    </>
                                                )}
                                                <p><span>Credits:</span> {section.credits}</p>
                                                {course?.prerequisites && course.prerequisites.length > 0 && (
                                                    <p><span>Prerequisites:</span> {course.prerequisites.join(', ')}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="schedule-summary">
                                    <p>Total Credits: {recommendedSchedule.reduce((sum, section) =>
                                        sum + (parseFloat(section.credits) || 3), 0)}
                                    </p>
                                </div>
                            </div>
                            <button onClick={saveSchedule} className="save-schedule-btn">
                                Save Schedule & Export to Calendar
                            </button>
                        </>
                    ) : (
                        <div className="no-schedule-message">
                            <p>No schedule could be generated for {selectedTerm}. This might be due to:</p>
                            <ul>
                                <li>No available sections for this term</li>
                                <li>Prerequisite requirements not met</li>
                                <li>Time conflicts with blocked days</li>
                                <li>Credit limit restrictions</li>
                            </ul>
                            <p>Try selecting a different term or adjusting your course selection.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutoScheduler;