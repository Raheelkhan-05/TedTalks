import React, { useState, useEffect } from 'react';
import './styles/EventsCalendar.css';

const EventsCalendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const [animationDirection, setAnimationDirection] = useState(null);

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
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  // Get event for a specific date
  const getEvent = (year, month, day) => {
    if (!events) return null;
    return events.find(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  // Check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  // Render calendar dates
  const renderDates = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const dates = [];
    
    // Add empty spaces for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push(<div key={`empty-${i}`} className="calendar-date empty"></div>);
    }
    
    // Add dates for current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayHasEvent = hasEvent(year, month, day);
      const dayIsToday = isToday(year, month, day);
      const event = getEvent(year, month, day);
      
      dates.push(
        <div 
          key={`date-${day}`} 
          className={`calendar-date ${dayHasEvent ? 'has-event' : ''} ${dayIsToday ? 'is-today' : ''}`}
        >
          <span className="date-number">{day}</span>
          {dayHasEvent && (
            <div className="calendar-event-indicator">
              <span className="event-dot"></span>
              <div className="event-tooltip">{event?.title}</div>
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
        <h3>{formatMonth(displayDate)}</h3>
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