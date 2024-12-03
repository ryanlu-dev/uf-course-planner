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

    const azure_id = sessionStorage.getItem("azure_id");
    const msp = localStorage.getItem("msp");

    // Parse all courses from HTML content
    const parseCoursesFromHTML = (htmlContent) => {
        //clean up the HTML content
        const cleanContent = htmlContent.replace(/\n/g, ' ');

        // Create a temporary element to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = DOMPurify.sanitize(cleanContent);

        // Find the current semester section
        const text = temp.textContent;

        // Regular expression to match course codes (e.g., ADV 4800, MMC 4200)
        const coursePattern = /([A-Z]{3})\s*(\d{4})/g;
        const courses = [];

        // Extract all course codes
        let match;
        while ((match = coursePattern.exec(text)) !== null) {
            const courseCode = match[1] + match[2];
            // Add the course if it hasn't been added yet
            if (!courses.some(course => course.code === courseCode)) {
                courses.push({
                    code: courseCode
                });
            }
        }

        console.log("Parsed courses:", courses); // Debugging
        return courses;
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
        } catch (err) {
            setError('Error fetching sections: ' + err.message);
            console.error(error);
            return [];
        }
    }, []);

    // Handle checkbox changes for completed courses
    const handleCourseToggle = (courseCode) => {
        setPreviousCourses(prev => {
            const newPreviousCourses = prev.includes(courseCode)
                ? prev.filter(code => code !== courseCode)
                : [...prev, courseCode];

            localStorage.setItem('previousCourses', JSON.stringify(newPreviousCourses));
            return newPreviousCourses;
        });
    };

    // Check for time conflicts between sections
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

    // Generate schedule based on remaining courses
    const generateSchedule = useCallback((sections, completed) => {
        const remainingCourses = allCourses.filter(course => !completed.includes(course.code));
        console.log("Remaining courses to schedule:", remainingCourses);

        let recommendedSections = [];
        let totalCredits = 0;

        for (const course of remainingCourses) {
            const availableSectionsForCourse = sections.filter(
                section => section.course_code === course.code
            );

            if (availableSectionsForCourse.length > 0) {
                // Find a section that doesn't conflict with already scheduled sections
                const compatibleSection = availableSectionsForCourse.find(section =>
                    !recommendedSections.some(scheduled => hasTimeConflict(scheduled, section))
                );

                if (compatibleSection) {
                    const credits = parseFloat(compatibleSection.credits) || 3;
                    if (totalCredits + credits <= 18) {
                        recommendedSections.push(compatibleSection);
                        totalCredits += credits;
                    }
                }
            }
        }

        return recommendedSections;
    }, [allCourses]);

    // Save generated schedule
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
                // Load plan
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
                console.log(modelSemesterPlan);

                // Parse courses
                if (plan?.html) {
                    const courses = parseCoursesFromHTML(plan.html);
                    setAllCourses(courses);
                }

                // Load sections
                const sections = await fetchSections();
                setAvailableSections(sections);

                // Load previously saved courses
                const savedCourses = localStorage.getItem('previousCourses');
                if (savedCourses) {
                    setPreviousCourses(JSON.parse(savedCourses));
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
                                    <span className="course-name">{course.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <button
                        className="generate-schedule-btn"
                        onClick={handleGenerateSchedule}
                    >
                        Generate Schedule for Remaining Courses
                    </button>
                </div>
            ) : (
                <div className="schedule-view">
                    <button
                        className="back-to-courses-btn"
                        onClick={() => setShowSchedule(false)}
                    >
                        Back to Course Selection
                    </button>
                    <h3>Recommended Schedule</h3>
                    {recommendedSchedule.length > 0 ? (
                        <>
                            <div className="recommended-sections">
                                {recommendedSchedule.map((section) => (
                                    <div key={section.section_id} className="section-card">
                                        <h4>{section.course_code}</h4>
                                        <div className="section-details">
                                            <p><span>Instructor:</span> {section.instructor}</p>
                                            <p><span>Location:</span> {section.room === "Not listed" ? "Online Course" : section.room}</p>
                                            <p><span>Schedule:</span> {section.meeting_times === "Not listed" ? "Online Course" : section.meeting_times}</p>
                                            <p><span>Credits:</span> {section.credits}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={saveSchedule} className="save-schedule-btn">
                                Save Schedule & Export to Calendar
                            </button>
                        </>
                    ) : (
                        <p className="no-schedule-message">
                            No schedule could be generated for the remaining courses.
                            Please check course availability for the current term.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutoScheduler;