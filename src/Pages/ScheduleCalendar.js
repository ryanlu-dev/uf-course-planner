// src/components/ScheduleCalendar.js

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Styles/ScheduleCalendar.css'; // Ensure this path is correct

const localizer = momentLocalizer(moment);

// Bind modal to appElement for accessibility
Modal.setAppElement('#root');

const ScheduleCalendar = ({ sections }) => {
    const [classEvents, setClassEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * Convert sections to calendar events.
     */
    const convertSectionsToEvents = useCallback((sectionsArray) => {
        const events = [];

        sectionsArray.forEach((section) => {
            const meetingTimes = parseMeetingTimes(section.meeting_times, section.term);

            console.log(`Parsing section: ${section.course_code} - ${section.section_id}`);
            console.log('Meeting Times Parsed:', meetingTimes);

            meetingTimes.forEach((time) => {
                const event = {
                    id: section.section_id, // Unique identifier for the event
                    course_code: section.course_code,
                    courseTitle: section.courseTitle,
                    instructor: section.instructor,
                    room: section.room,
                    meeting_times: `${moment(time.start).format('h:mm A')} - ${moment(time.end).format('h:mm A')}`,
                    title: `${section.course_code}`, // Display only course code on the calendar
                    start: time.start.toDate(),
                    end: time.end.toDate(),
                    allDay: false,
                    credits: section.credits,
                    prerequisites: section.prerequisites,
                };
                events.push(event);
            });
        });

        console.log('Final Events:', events);
        return events;
    }, []);

    /**
     * Helper function to parse meeting times string into structured data.
     * Handles format "Mon/Wed/Fri: 11:45 AM - 12:35 PM | Thu: 1:55 PM - 4:55 PM"
     * 
     * @param {string} meetingTimesStr - The meeting times string.
     * @param {string} term - The academic term (e.g., "Fall 2024").
     * @returns {Array} - An array of meeting time objects.
     */
    const parseMeetingTimes = (meetingTimesStr, term) => {
        if (!meetingTimesStr || meetingTimesStr === "Not listed") return [];

        const daysMap = {
            Mon: 'Monday',
            Tue: 'Tuesday',
            Wed: 'Wednesday',
            Thu: 'Thursday',
            Fri: 'Friday',
            Sat: 'Saturday',
            Sun: 'Sunday',
        };

        const result = [];

        // Split by pipe to handle multiple meeting segments
        const meetingSegments = meetingTimesStr.split('|').map(segment => segment.trim());

        //  use the current week's start
        const currentWeekStart = moment().startOf('isoWeek'); // Start of current week (Monday)

        meetingSegments.forEach(segment => {
            // Find the index of the first colon
            const colonIndex = segment.indexOf(':');
            if (colonIndex === -1) {
                console.warn(`Invalid segment format: "${segment}"`);
                return;
            }

            // Extract daysPart and timesPart using substring
            const daysPart = segment.substring(0, colonIndex).trim();
            const timesPart = segment.substring(colonIndex + 1).trim();

            // Split days and times
            const days = daysPart.split('/').map(day => day.trim());
            const [startTimeStr, endTimeStr] = timesPart.split(' - ').map(t => t.trim());
            if (!startTimeStr || !endTimeStr) return;

            days.forEach((dayAbbr) => {
                const day = daysMap[dayAbbr];
                if (day) {
                    const startTime = moment(startTimeStr.trim(), 'h:mm A');
                    const endTime = moment(endTimeStr.trim(), 'h:mm A');
                    if (startTime.isValid() && endTime.isValid()) {
                        // Set the date to the current week's day
                        const start = currentWeekStart.clone().day(day).set({
                            hour: startTime.hour(),
                            minute: startTime.minute(),
                            second: 0,
                            millisecond: 0,
                        });

                        const end = currentWeekStart.clone().day(day).set({
                            hour: endTime.hour(),
                            minute: endTime.minute(),
                            second: 0,
                            millisecond: 0,
                        });

                        // Adjust for cases where the end time is before the start time
                        if (end.isBefore(start)) {
                            end.add(1, 'day');
                        }

                        result.push({
                            day,
                            start,
                            end,
                        });
                    } else {
                        console.warn(`Invalid time format in meeting times: "${timesPart}"`);
                    }
                } else {
                    console.warn(`Unknown day abbreviation "${dayAbbr}" in meeting times`);
                }
            });
        });

        console.log(`Parsed Meeting Times for Term ${term}:`, result);
        return result;
    };

    useEffect(() => {
        if (sections && Array.isArray(sections) && sections.length > 0) {
            const events = convertSectionsToEvents(sections);
            setClassEvents(events);
        } else {
            console.warn('No sections available to display on the calendar.');
            setClassEvents([]);
        }
    }, [sections, convertSectionsToEvents]);

    /**
     * Custom Event Component to display only course code, meeting times, and room
     */
    const Event = ({ event }) => (
        <div>
            <div><strong>{event.course_code}</strong></div>
            <div>{event.meeting_times}</div>
            <div>Room: {event.room}</div>
        </div>
    );

    /**
     * Handle event selection to display modal with detailed info
     */
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    /**
     * Close the modal
     */
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div className="schedule-calendar-container">
            <Calendar
                localizer={localizer}
                events={classEvents}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                views={['week']}
                toolbar={true}
                step={50}
                timeslots={1}
                min={moment().set({ hour: 7, minute: 0 }).toDate()}
                max={moment().set({ hour: 19, minute: 0 }).toDate()}
                defaultDate={moment().startOf('isoWeek').toDate()}
                style={{ height:'50%', width: '100%' }} //adjustments to be made
                components={{
                    event: Event,
                }}
                onSelectEvent={handleSelectEvent} // Add event selection handler
            />

            {/* Modal for displaying detailed event information */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Course Details"
                className="event-modal"
                overlayClassName="event-modal-overlay"
            >
                {selectedEvent && (
                    <div>
                        <h2>{selectedEvent.course_code} - {selectedEvent.courseTitle}</h2>
                        <p><strong>Instructor:</strong> {selectedEvent.instructor}</p>
                        <p><strong>Meeting Times:</strong> {selectedEvent.meeting_times}</p>
                        <p><strong>Room:</strong> {selectedEvent.room}</p>
                        <p><strong>Credits:</strong> {selectedEvent.credits || 'N/A'}</p>
                        <p><strong>Prerequisites:</strong> {selectedEvent.prerequisites || 'N/A'}</p>
                        {/* Add more details as needed */}
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );

};

export default ScheduleCalendar;
