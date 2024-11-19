import React, { useState, useEffect, useMemo } from 'react';
import './Styles/Courses.css';

function Courses() {
    const [searchTerm, setSearchTerm] = useState('');
    const [codeSearchTerm, setCodeSearchTerm] = useState('');
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]); // Store all fetched courses
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;

    const fetchAllCourses = async () => {
        setLoading(true);
        setError(null);
        let endpoint = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
            }/rest/courses`;
        let hasNextPage = true;

        try {
            let accumulatedCourses = [];
            while (hasNextPage) {
                const response = await fetch(endpoint);
                const data = await response.json();
                console.log('Fetched data:', data);

                if (Array.isArray(data.value)) {
                    accumulatedCourses = [...accumulatedCourses, ...data.value];
                    if (data.nextLink) {
                        endpoint = data.nextLink;
                    } else {
                        hasNextPage = false;
                    }
                } else {
                    console.error('Unexpected data format:', data);
                    throw new Error('Unexpected data format received from the API.');
                }
            }
            setAllCourses(accumulatedCourses); // Store fetched courses
            setError(null);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to fetch courses.');
            setAllCourses([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses on component mount
    useEffect(() => {
        fetchAllCourses();
    }, []);

    // Extract unique course codes
    const uniqueCourseCodes = useMemo(() => {
        if (allCourses.length === 0) return [];
        const codesSet = new Set(allCourses.map((course) => course.code));
        return Array.from(codesSet);
    }, [allCourses]);

    // Filtered course codes for dropdown
    const filteredCodes = useMemo(() => {
        if (codeSearchTerm === '' || uniqueCourseCodes.length === 0) return [];
        return uniqueCourseCodes
            .filter((code) =>
                code.toLowerCase().includes(codeSearchTerm.toLowerCase())
            )
            .slice(0, 10); // Limit to 10 codes
    }, [codeSearchTerm, uniqueCourseCodes]);

    // Filter courses based on searchTerm and codeSearchTerm
    useEffect(() => {
        // If both search bars are empty, do not display any courses
        if (searchTerm === '' && codeSearchTerm === '') {
            setCourses([]);
            return;
        }

        setCurrentPage(1); // Reset to first page on new search
        let filteredCourses = allCourses;

        // Filter by course title search term
        if (searchTerm !== '') {
            filteredCourses = filteredCourses.filter((course) =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by course code search term
        if (codeSearchTerm !== '') {
            filteredCourses = filteredCourses.filter((course) =>
                course.code.toLowerCase().includes(codeSearchTerm.toLowerCase())
            );
        }

        setCourses(filteredCourses);
    }, [searchTerm, codeSearchTerm, allCourses]);

    // Calculate indices for slicing
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    const totalPages = Math.ceil(courses.length / coursesPerPage);

    return (
        <div className="courses-page">
            <h2>Courses</h2>

            {/* Title Search Bar */}
            <input
                type="text"
                placeholder="Search for a course by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            {/* Course Code Search Bar with Dropdown */}
            <div className="code-search-container">
                <input
                    type="text"
                    placeholder="Search for a course by code..."
                    value={codeSearchTerm}
                    onChange={(e) => setCodeSearchTerm(e.target.value)}
                    className="search-input"
                />
                {codeSearchTerm && filteredCodes.length > 0 && (
                    <ul className="code-dropdown">
                        {filteredCodes.map((code) => (
                            <li
                                key={code}
                                onClick={() => {
                                    setCodeSearchTerm(code);
                                }}
                                className="code-dropdown-item"
                            >
                                {code}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {loading && <p>Loading courses...</p>}
            {error && <p>{error}</p>}

            {/* Show prompt if no search has been initiated */}
            {!error && !loading && searchTerm === '' && codeSearchTerm === '' && (
                <p>Please enter a search term to display courses.</p>
            )}

            {/* Display filtered courses */}
            {!error && currentCourses.length > 0 && (
                <>
                    <ul className="course-list">
                        {currentCourses.map((course) => (
                            <li key={course.code} className="course-item">
                                <h3>{course.title}</h3>
                                <p>
                                    <strong>Code:</strong> {course.code}
                                </p>
                                <p>
                                    <strong>Department ID:</strong> {course.department_id}
                                </p>
                                <p>
                                    <strong>Credits:</strong> {course.credits}
                                </p>
                                {course.prerequisites && (
                                    <p>
                                        <strong>Prerequisites:</strong> {course.prerequisites}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>

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
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {/* No courses found */}
            {!loading &&
                !error &&
                (searchTerm !== '' || codeSearchTerm !== '') &&
                courses.length === 0 && (
                    <p>No courses found matching your search criteria.</p>
                )}
        </div>
    );
}

export default Courses;
