import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Styles/Courses.css'; // Custom styling

function Courses() {
    // State variables for course code search
    const [codeSearchTerm, setCodeSearchTerm] = useState('');
    const [debouncedCodeSearchTerm, setDebouncedCodeSearchTerm] = useState(codeSearchTerm);

    // State variables for fetched data
    const [allCourses, setAllCourses] = useState([]);     // All fetched courses
    const [allSections, setAllSections] = useState([]);   // All fetched sections
    const [sections, setSections] = useState([]);         // Sections to display based on search

    // State variables for loading and error handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State variables for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const sectionsPerPage = 20;

    // State for selected courses
    const [selectedCourses, setSelectedCourses] = useState([]);

    // State for signed-up sections
    const [signedUpSections, setSignedUpSections] = useState([]);

    // State for validation errors
    const [validationErrors, setValidationErrors] = useState([]);

    // Base URLs for API endpoints
    const COURSES_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? `http://localhost:7071/api/getCourses` : `/api/getCourses`;
    const SECTIONS_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? `http://localhost:7071/api/getSections` : `/api/getSections`;

    /**
     * Fetch all courses and sections, then merge them based on course_code.
     */
    const fetchAllData = useCallback(async () => {
        /**
         * Fetch all courses from the API, handling pagination via nextLink.
         * Implement localStorage caching.
         */
        const fetchAllCourses = async () => {
            // Check if courses data exists in localStorage
            const storedCourses = localStorage.getItem('coursesData');
            if (storedCourses) {
                console.log('Using cached courses data from localStorage.');
                return JSON.parse(storedCourses);
            }

            let fetchedCourses = [];
            let endpoint = COURSES_URL;
            let hasNextPage = true;

            while (hasNextPage) {
                try {
                    const response = await fetch(endpoint);
                    if (!response.ok) {
                        throw new Error(`Error fetching courses: ${response.statusText}`);
                    }
                    const data = await response.json();
                    console.log(data);
                    if (Array.isArray(data)) {
                        fetchedCourses = [...fetchedCourses, ...data];
                    } else {
                        throw new Error('Invalid data format received from the courses API.');
                    }

                    // Check for nextLink to fetch subsequent pages
                    if (data.nextLink) {
                        const nexturl = new URL(data.nextLink);
                        const afterParam = nexturl.searchParams.get('$after');
                        endpoint = `${COURSES_URL}?$after=${afterParam}`;
                    } else {
                        hasNextPage = false;
                    }
                } catch (err) {
                    throw err;
                }
            }

            // Store fetched courses in localStorage
            localStorage.setItem('coursesData', JSON.stringify(fetchedCourses));
            return fetchedCourses;
        };

        /**
         * Fetch all sections from the API, handling pagination via nextLink.
         * Implement localStorage caching.
         */
        const fetchAllSections = async () => {
            // Check if sections data exists in localStorage
            const storedSections = localStorage.getItem('sectionsData');
            if (storedSections) {
                console.log('Using cached sections data from localStorage.');
                return JSON.parse(storedSections);
            }

            let fetchedSections = [];
            let endpoint = SECTIONS_URL;
            let hasNextPage = true;

            while (hasNextPage) {
                try {
                    const response = await fetch(endpoint);
                    if (!response.ok) {
                        throw new Error(`Error fetching sections: ${response.statusText}`);
                    }
                    const data = await response.json();

                    if (Array.isArray(data)) {
                        fetchedSections = [...fetchedSections, ...data];
                    } else {
                        throw new Error('Invalid data format received from the sections API.');
                    }

                    // Check for nextLink to fetch subsequent pages
                    if (data.nextLink) {
                        const nexturl = new URL(data.nextLink);
                        const afterParam = nexturl.searchParams.get('$after');
                        endpoint = `${SECTIONS_URL}?$after=${afterParam}`;
                    } else {
                        hasNextPage = false;
                    }
                } catch (err) {
                    throw err;
                }
            }

            // Store fetched sections in localStorage
            localStorage.setItem('sectionsData', JSON.stringify(fetchedSections));
            return fetchedSections;
        };


        setLoading(true);
        setError(null);
        try {
            // Fetch all courses
            const courses = await fetchAllCourses();
            setAllCourses(courses);

            // Fetch all sections
            const sectionsData = await fetchAllSections();
            setAllSections(sectionsData);

            // Create a Map for courses for efficient lookup
            const coursesMap = new Map();
            courses.forEach(course => {
                // Trim and convert course code to uppercase for consistent matching
                const courseCode = course.code ? course.code.trim().toUpperCase() : '';
                coursesMap.set(courseCode, course);
            });

            // Merge sections with course information
            const mergedSections = sectionsData.map(section => {
                // Trim and convert section's course_code to uppercase
                const sectionCourseCode = section.course_code ? section.course_code.trim().toUpperCase() : '';
                const course = coursesMap.get(sectionCourseCode);

                if (course) {
                    return {
                        ...section,
                        courseTitle: course.title || 'No Title',
                        department_id: course.department_id || 'N/A',
                        credits: course.credits || 'N/A',
                        prerequisites: course.prerequisites || 'N/A',
                    };
                } else {
                    console.warn(`No matching course found for course_code: "${section.course_code}" in section ${section.section_id}`);
                    return {
                        ...section,
                        courseTitle: 'Unknown Course',
                        department_id: 'N/A',
                        credits: 'N/A',
                        prerequisites: 'N/A',
                    };
                }
            });

            setSections(mergedSections);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Failed to fetch data.');
            setAllCourses([]);
            setAllSections([]);
            setSections([]);
        } finally {
            setLoading(false);
        }
    }, [COURSES_URL, SECTIONS_URL]);

    /**
     * Handle selection of a course.
     */
    const handleSelectCourse = (courseCode) => {
        const upperCaseCode = courseCode.trim().toUpperCase();
        if (!selectedCourses.includes(upperCaseCode)) {
            setSelectedCourses([...selectedCourses, upperCaseCode]);
        }
        setCodeSearchTerm(''); // Clear search term after selection
    };

    /**
     * Handle removal of a selected course.
     */
    const handleRemoveSelectedCourse = (courseCode) => {
        setSelectedCourses(selectedCourses.filter(code => code !== courseCode));
    };

    /**
     * Handle selection of a section (e.g., sign-up).
     */
    const handleSignUp = (section) => {
        // Check if the section is already signed up
        const isAlreadySignedUp = signedUpSections.some(
            (signedUpSection) => signedUpSection.section_id === section.section_id
        );
        if (!isAlreadySignedUp) {
            const newSignedUpSections = [...signedUpSections, section];
            setSignedUpSections(newSignedUpSections);

            // Save to localStorage
            localStorage.setItem('signedUpSections', JSON.stringify(newSignedUpSections));
        }
    };

    /**
     * Handle removal of a signed-up section.
     */
    const handleRemoveSignedUpSection = (sectionId) => {
        const updatedSignedUpSections = signedUpSections.filter(
            (section) => section.section_id !== sectionId
        );
        setSignedUpSections(updatedSignedUpSections);

        // Update localStorage
        localStorage.setItem('signedUpSections', JSON.stringify(updatedSignedUpSections));
    };

    /**
     * Handle exporting courses to the calendar.
     */
    const handleExportToCalendar = () => {
        const errors = [];

        // Calculate total credits
        const totalCredits = signedUpSections.reduce((sum, section) => {
            const credits = parseFloat(section.credits) || 0;
            return sum + credits;
        }, 0);

        if (totalCredits > 18) {
            errors.push(`Total credits exceed 18 (Current: ${totalCredits})`);
        }

        if (errors.length > 0) {
            console.log('Validation Errors:', errors);
            setValidationErrors(errors);
        } else {
            setValidationErrors([]);
            // Save signed-up sections to localStorage for the calendar to access
            localStorage.setItem('calendarEvents', JSON.stringify(signedUpSections));
            console.log('Courses exported to calendar successfully!');
            alert('Courses exported to calendar successfully!');
        }
    };

    /**
     * Create a Map for courses to enable quick lookup by course_code.
     */
    const coursesMap = useMemo(() => {
        const map = new Map();
        allCourses.forEach(course => {
            const courseCode = course.code ? course.code.trim().toUpperCase() : '';
            map.set(courseCode, course);
        });
        return map;
    }, [allCourses]);

    /**
     * Extract unique course codes for the dropdown in the course code search bar.
     */
    const uniqueCourseCodes = useMemo(() => {
        if (allCourses.length === 0) return [];
        const codesSet = new Set(allCourses.map(course => course.code.trim().toUpperCase()));
        return Array.from(codesSet);
    }, [allCourses]);

    /**
     * Handle changes in the search input.
     */
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setCodeSearchTerm(value); // Update immediately
    };

    /**
     * Debounce the search term for expensive operations.
     */
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCodeSearchTerm(codeSearchTerm);
        }, 300); // 300ms delay

        // Cleanup function
        return () => {
            clearTimeout(handler);
        };
    }, [codeSearchTerm]);

    /**
     * Filter course codes based on user input for the dropdown.
     */
    const filteredCodes = useMemo(() => {
        if (debouncedCodeSearchTerm.trim() === '' || uniqueCourseCodes.length === 0) return [];
        return uniqueCourseCodes
            .filter(code => code.includes(debouncedCodeSearchTerm.trim().toUpperCase()))
            .slice(0, 10); // Limit to 10 suggestions
    }, [debouncedCodeSearchTerm, uniqueCourseCodes]);

    /**
     * Filter sections based on selected courses or course code search term.
     */
    useEffect(() => {
        // If no selected courses and search input is empty, do not display any sections
        if (selectedCourses.length === 0 && debouncedCodeSearchTerm.trim() === '') {
            setSections([]);
            return;
        }

        // Reset to first page on new search
        setCurrentPage(1);

        let filteredSections = [];

        // If selected courses exist, filter by them
        if (selectedCourses.length > 0) {
            filteredSections = allSections.filter(section =>
                section.course_code &&
                selectedCourses.includes(section.course_code.trim().toUpperCase())
            );
        } else {
            // Else, filter by course code search term
            const searchTermUpper = debouncedCodeSearchTerm.trim().toUpperCase();

            filteredSections = allSections.filter(section =>
                section.course_code &&
                section.course_code.trim().toUpperCase().includes(searchTermUpper)
            );
        }

        // Merge filtered sections with course information
        const mergedFilteredSections = filteredSections.map(section => {
            const sectionCourseCode = section.course_code.trim().toUpperCase();
            const course = coursesMap.get(sectionCourseCode);

            if (course) {
                return {
                    ...section,
                    courseTitle: course.title || 'No Title',
                    department_id: course.department_id || 'N/A',
                    credits: course.credits || 'N/A',
                    prerequisites: course.prerequisites || 'N/A',
                };
            } else {
                console.warn(`No matching course found for course_code: "${section.course_code}" in section ${section.section_id}`);
                return {
                    ...section,
                    courseTitle: 'Unknown Course',
                    department_id: 'N/A',
                    credits: 'N/A',
                    prerequisites: 'N/A',
                };
            }
        });

        setSections(mergedFilteredSections);
    }, [debouncedCodeSearchTerm, selectedCourses, allSections, coursesMap]);

    /**
     * Calculate the sections to display on the current page.
     */
    const indexOfLastSection = currentPage * sectionsPerPage;
    const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
    const currentSections = sections.slice(indexOfFirstSection, indexOfLastSection);

    const totalPages = Math.ceil(sections.length / sectionsPerPage);

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllData();

        // Load signed-up sections from localStorage
        const storedSignedUpSections = localStorage.getItem('signedUpSections');
        if (storedSignedUpSections) {
            setSignedUpSections(JSON.parse(storedSignedUpSections));
        }
    }, [fetchAllData]); // Include fetchAllData in the dependency array

    return (
        <div className="courses-page">
            <h2>Available Sections</h2>

            <div className="courses-container">
                {/* Search Section */}
                <div className="search-section">
                    {/* Course Code Search Bar with Dropdown */}
                    <div className="code-search-container">
                        <div className="search-dropdown-wrapper">
                            <input
                                type="text"
                                placeholder="Search for a course by code..."
                                onChange={handleSearchChange}
                                className="search-input"
                                aria-label="Course Code Search"
                                aria-autocomplete="list"
                                aria-controls="course-code-dropdown"
                                role="combobox"
                                aria-expanded={filteredCodes.length > 0}
                                value={codeSearchTerm}
                            />
                            {codeSearchTerm.trim() !== '' && filteredCodes.length > 0 && (
                                <ul className="code-dropdown" id="course-code-dropdown" role="listbox">
                                    {filteredCodes.map((code) => (
                                        <li
                                            key={code}
                                            onClick={() => handleSelectCourse(code)}
                                            className="code-dropdown-item"
                                            role="option"
                                            aria-selected={code === codeSearchTerm.trim().toUpperCase()}
                                            tabIndex="0"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSelectCourse(code);
                                                }
                                            }}
                                        >
                                            {code}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Selected Courses Display */}
                    {selectedCourses.length > 0 && (
                        <div className="selected-courses">
                            <h4>Selected Courses</h4>
                            <ul>
                                {selectedCourses.map(code => (
                                    <li key={code}>
                                        {code}
                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemoveSelectedCourse(code)}
                                            aria-label={`Remove ${code}`}
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* List Section */}
                <div className="list-section">
                    {/* Loading Indicator */}
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading sections...</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            <button onClick={fetchAllData} className="retry-button">
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Show prompt if no search or selection has been initiated */}
                    {!error && !loading && selectedCourses.length === 0 && codeSearchTerm.trim() === '' && (
                        <p>Please select a course code to display available sections.</p>
                    )}

                    {/* Display filtered sections */}
                    {!error && !loading && currentSections.length > 0 && (
                        <>
                            <ul className="section-list">
                                {currentSections.map((section) => (
                                    <li key={section.section_id} className="section-item">
                                        <div className="section-details">
                                            <h3>{section.courseTitle} - Section {section.section_id}</h3>
                                            <p><strong>Course Code:</strong> {section.course_code}</p>
                                            <p><strong>Department ID:</strong> {section.department_id}</p>
                                            <p><strong>Credits:</strong> {section.credits}</p>
                                            {section.prerequisites && (
                                                <p><strong>Prerequisites:</strong> {section.prerequisites}</p>
                                            )}
                                            <p><strong>Term:</strong> {section.term}</p>
                                            <p><strong>Instructor:</strong> {section.instructor}</p>
                                            <p><strong>Room:</strong> {section.room}</p>
                                            <p><strong>Meeting Times:</strong> {section.meeting_times}</p>
                                            {/* Add more section-specific details as needed */}
                                        </div>
                                        {/* Sign Up Button */}
                                        <button
                                            className="signup-button"
                                            onClick={() => handleSignUp(section)}
                                        >
                                            Sign Up
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Pagination Controls */}
                            <div className="pagination-controls">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {/* No sections found */}
                    {!loading &&
                        !error &&
                        (selectedCourses.length > 0 || debouncedCodeSearchTerm.trim() !== '') &&
                        sections.length === 0 && (
                            <p>No sections found for the selected course code(s).</p>
                        )}
                </div>

                {/* Signed-Up Sections */}
                <div className="signed-up-section">
                    {/* Signed-Up Sections Display */}
                    {signedUpSections.length > 0 && (
                        <div className="signed-up-sections">
                            <h4>Signed-Up Sections</h4>
                            <ul>
                                {signedUpSections.map(section => (
                                    <li key={section.section_id} className="signed-up-item">
                                        <div className="signed-up-details">
                                            <h5>{section.course_code} - Section {section.section_id}</h5>
                                            <p><strong>Instructor:</strong> {section.instructor}</p>
                                            <p><strong>Term:</strong> {section.term}</p>
                                            <p><strong>Credits:</strong> {section.credits}</p>
                                            <p><strong>Meeting Times:</strong> {section.meeting_times}</p>
                                            {/* Add more details if needed */}
                                        </div>
                                        <button
                                            className="remove-signedup-button"
                                            onClick={() => handleRemoveSignedUpSection(section.section_id)}
                                            aria-label={`Remove section ${section.section_id}`}
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Export to Calendar Button */}
                    {signedUpSections.length > 0 && (
                        <>
                            <button
                                className="export-button"
                                onClick={handleExportToCalendar}
                            >
                                Export to Calendar
                            </button>

                            {/* Validation Errors Display */}
                            {validationErrors.length > 0 && (
                                <div className="validation-errors">
                                    <h4>Export Failed Due to the Following Issues:</h4>
                                    <ul>
                                        {validationErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Courses;
