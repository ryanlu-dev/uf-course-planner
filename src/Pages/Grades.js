import React from 'react';
import './Styles/Grades.css';

const Grades = () => {
    const grades = [
        { course: 'Introduction to Programming', grade: 'A' },
        { course: 'Calculus II', grade: 'B+' },
        { course: 'World History', grade: 'A-' },
        // Additional placeholder grades...
    ];

    return (
        <div className="grades-page">
            <h2>Your Grades</h2>
            <p>Track your academic performance below:</p>

            <table className="grades-table">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map((grade, index) => (
                        <tr key={index}>
                            <td>{grade.course}</td>
                            <td className={`grade ${getGradeClass(grade.grade)}`}>{grade.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function getGradeClass(grade) {
    if (grade.startsWith('A')) return 'grade-a';
    if (grade.startsWith('B')) return 'grade-b';
    if (grade.startsWith('C')) return 'grade-c';
    if (grade.startsWith('D')) return 'grade-d';
    return 'grade-f';
}

export default Grades;
