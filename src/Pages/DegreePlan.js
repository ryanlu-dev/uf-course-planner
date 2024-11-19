import React from 'react';
import './Styles/DegreePlan.css';

const degreePlan = [
    {
        semester: "Semester One",
        courses: [
            { code: "Quest 1", name: "Gen Ed Humanities", credits: 3 },
            { code: "COP 3502C", name: "Programming Fundamentals 1 (Critical Tracking)", credits: 4 },
            { code: "EGN 2020C", name: "Engineering Design & Society (or other Gen Ed Physical Sciences course)", credits: 2 },
            { code: "MAC 2311", name: "Analytic Geometry and Calculus 1 (Critical Tracking; State Core Gen Ed Mathematics)", credits: 4 }
        ],
        totalCredits: 13
    },
    {
        semester: "Semester Two",
        courses: [
            { code: "COP 3503C", name: "Programming Fundamentals 2", credits: 4 },
            { code: "COT 3100", name: "Applications of Discrete Structures", credits: 3 },
            { code: "MAC 2312", name: "Analytic Geometry and Calculus 2 (Critical Tracking; Gen Ed Mathematics)", credits: 4 },
            { code: "PHY 2048 & 2048L", name: "Physics with Calculus 1 and Laboratory (Critical Tracking; State Core Gen Ed Physical Sciences)", credits: 4 }
        ],
        totalCredits: 15
    },
    {
        semester: "Summer After Semester Two",
        courses: [
            { code: "ENC 1101 or ENC 1102", name: "Expository and Argumentative Writing or Argument and Persuasion (State Core GE Composition; Writing Requirement: 6,000 words)", credits: 3 },
            { code: "State Core Gen Ed", name: "Biological or Physical Sciences", credits: 3 },
            { code: "State Core Gen Ed", name: "Humanities", credits: 3 }
        ],
        totalCredits: 9
    },
    {
        semester: "Semester Three",
        courses: [
            { code: "CDA 3101", name: "Introduction to Computer Organization", credits: 3 },
            { code: "COP 3530", name: "Data Structures and Algorithm", credits: 3 },
            { code: "MAC 2313", name: "Analytic Geometry and Calculus 3 (Critical Tracking; Gen Ed Mathematics)", credits: 4 },
            { code: "PHY 2049 & 2049L", name: "Physics with Calculus 2 and Laboratory (Critical Tracking; Gen Ed Physical Sciences)", credits: 4 }
        ],
        totalCredits: 14
    },
    {
        semester: "Semester Four",
        courses: [
            { code: "CEN 3031", name: "Introduction to Software Engineering", credits: 3 },
            { code: "CIS 4301", name: "Information and Database Systems 1", credits: 3 },
            { code: "ENC 3246", name: "Professional Communication for Engineers (Gen Ed Composition; Writing Requirement: 6,000 words)", credits: 3 },
            { code: "MAS 3114 or MAS 4105", name: "Computational Linear Algebra or Linear Algebra 1", credits: 3 },
            { code: "Gen Ed", name: "Social and Behavioral Sciences with Diversity or International", credits: 3 }
        ],
        totalCredits: 15
    },
    {
        semester: "Semester Five",
        courses: [
            { code: "Quest 2", name: "Gen Ed Social and Behavioral Sciences OR Gen Ed Biological or Physical Sciences", credits: 3 },
            { code: "COP 4600", name: "Operating Systems", credits: 3 },
            { code: "STA 3032", name: "Engineering Statistics", credits: 3 },
            { code: "Technical elective", name: "", credits: 3 }
        ],
        totalCredits: 12
    },
    {
        semester: "Semester Six",
        courses: [
            { code: "COP 4020", name: "Programming Language Concepts", credits: 3 },
            { code: "COP 4533", name: "Algorithm Abstraction and Design", credits: 3 },
            { code: "Interdisciplinary electives", name: "", credits: 6 },
            { code: "Technical elective", name: "", credits: 3 }
        ],
        totalCredits: 15
    },
    {
        semester: "Summer After Semester Six",
        courses: [
            { code: "Internship / Co-op", name: "(if desired)", credits: 0 }
        ],
        totalCredits: 0
    },
    {
        semester: "Semester Seven",
        courses: [
            { code: "CNT 4007", name: "Computer Network Fundamentals", credits: 3 },
            { code: "EGS 4034 or CGS 3065", name: "Engineering Ethics and Professionalism or Legal and Social Issues in Computing", credits: 1 },
            { code: "Technical electives", name: "", credits: 6 },
            { code: "Interdisciplinary elective", name: "", credits: 3 }
        ],
        totalCredits: 13
    },
    {
        semester: "Semester Eight",
        courses: [
            { code: "EGN 4952 or CIS 4914", name: "Integrated Product and Process Design 2 or Senior Project", credits: 3 },
            { code: "Technical electives", name: "", credits: 6 },
            { code: "Interdisciplinary electives", name: "", credits: 5 }
        ],
        totalCredits: 14
    }
];

const DegreePlan = () => {
    return (
        <div className="degree-plan-page">
            <h2>Computer Science Degree Plan</h2>
            {degreePlan.map((semester, index) => (
                <div key={index} className="semester">
                    <h3>{semester.semester}</h3>
                    <table className="semester-table">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Credits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {semester.courses.map((course, idx) => (
                                <tr key={idx}>
                                    <td>{course.code}</td>
                                    <td>{course.name}</td>
                                    <td>{course.credits}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="2"><strong>Total Credits</strong></td>
                                <td><strong>{semester.totalCredits}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
            <div className="total-credits">
                <p><strong>Total Degree Credits: 120</strong></p>
            </div>
        </div>
    );
};

export default DegreePlan;
