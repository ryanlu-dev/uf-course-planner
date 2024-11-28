// src/pages/Schedule.js

import React, { useEffect, useState } from 'react';
import ScheduleCalendar from './ScheduleCalendar'; // Adjust the path as necessary

const Schedule = () => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        // Retrieve data from localStorage
        const storedEvents = localStorage.getItem('calendarEvents');

        if (storedEvents) {
            try {
                const parsedSections = JSON.parse(storedEvents);

                if (Array.isArray(parsedSections)) {
                    setSections(parsedSections);
                    console.log('Sections loaded from localStorage:', parsedSections);
                } else {
                    console.error('Error: calendarEvents in localStorage is not an array.', parsedSections);
                    // Optionally, handle single object case or reset data
                    setSections([]);
                }
            } catch (error) {
                console.error('Error parsing calendarEvents from localStorage:', error);
                setSections([]);
            }
        } else {
            console.warn('No calendarEvents found in localStorage.');
            setSections([]);
        }
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div>
            <h2>My Schedule</h2>
            <ScheduleCalendar sections={sections} />
        </div>
    );
};

export default Schedule;
