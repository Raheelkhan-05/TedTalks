import React, { useState, useEffect } from 'react';
import './styles/EventsCalendar.css';
import axios from 'axios';

const EventsCalendar = ({ event }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [animationDirection, setAnimationDirection] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = React.useRef();
  const [events, setEvents] = useState([]); // Store all events for calendar display
  const FLASK_API = "http://127.0.0.1:5000";  // Flask server URL
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get(`${FLASK_API}/events?type=all&all=true`);
        console.log('Events -----:', response);
        setEvents(response.data.events); // store all events for calendar display
        console.log('Events Cal:', events);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    }
  
    fetchEvents();
  }, []);
  

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 100 }, (_, i) => 1970 + i); // Change range if needed

useEffect(() => {
  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setAnimationDirection('slide-right');
    setTimeout(() => {
      setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
      setAnimationDirection(null);
    }, 300);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setAnimationDirection('slide-left');
    setTimeout(() => {
      setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
      setAnimationDirection(null);
    }, 300);
  };

  // Format date for display
  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Check if a date has an event
  const hasEvent = (year, month, day) => {
    if (!events) return false;
    return events.some(event => {
      const eventDate = new Date(event.recording_date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };
  // Get events for a specific day
  const getEventsForDay = (year, month, day) => {
    if (!events) return null;
    return events.filter(event => {
      const date = new Date(event.recording_date);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };
  

  // Check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const renderDates = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
    const dates = [];
  
    // Add empty spaces before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push(<div key={`empty-${i}`} className="calendar-date empty"></div>);
    }
  
    // Loop through all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayIsToday = isToday(year, month, day);
      const events = getEventsForDay(year, month, day); // Returns an array now
      const dayHasEvent = events.length > 0;
  
      dates.push(
        <div 
          key={`date-${day}`} 
          className={`calendar-date ${dayHasEvent ? 'has-event' : ''} ${dayIsToday ? 'is-today' : ''}`}
        >
          <span className="date-number">{day}</span>
  
          {dayHasEvent && (
            <div className="calendar-event-indicator">
              {/* <span className='event-num'> {events.length}</span> */}
              {events.map((event, idx) => (
                <div key={idx} className="event-tooltip-wrapper">
                  <span className="event-dot">{events.length}</span>

  <div className="event-tooltip">
    {events.map((event, index) => (
      <div key={index} className="tooltip-item">{event.talk__name}</div>
    ))}
  </div>

                  {/* <div className="event-tooltip">{event.talk__name}</div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  
    return dates;
  };
  

  return (
    <div className="events-calendar">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        <div className="month-selector" onClick={() => setShowPicker(!showPicker)}>
    {formatMonth(displayDate)}
    {showPicker && (
      <div className="picker-popup">
        <select
          value={displayDate.getMonth()}
          onChange={(e) =>
            setDisplayDate(new Date(displayDate.getFullYear(), parseInt(e.target.value), 1))
          }
        >
          {months.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>
        <select
          value={displayDate.getFullYear()}
          onChange={(e) =>
            setDisplayDate(new Date(parseInt(e.target.value), displayDate.getMonth(), 1))
          }
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    )}
  </div>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      <div className={`calendar-grid ${animationDirection}`}>
        <div className="calendar-days">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        <div className="calendar-dates">
          {renderDates()}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;