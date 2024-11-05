import React, { useState } from 'react';
import './Styles/Courses.css';

const Courses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);

    const courses = [
        { id: 1, name: 'Introduction to Programming', description: 'Basics of programming in Python.' },
        { id: 2, name: 'Calculus II', description: 'Advanced calculus concepts and applications.' },
        { id: 3, name: 'World History', description: 'Exploring history from a global perspective.' },
        // More placeholder courses...
    ];

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        const filtered = courses.filter(course =>
            course.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    return (
        <div className="courses-page">
            <h2>Courses Page</h2>
            <p>View and manage your courses.</p>

            <input
                type="text"
                placeholder="Search for a course..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />

            <ul className="course-list">
                {(searchTerm ? filteredCourses : courses).map(course => (
                    <li key={course.id} className="course-item">
                        <h3>{course.name}</h3>
                        <p>{course.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Courses;
