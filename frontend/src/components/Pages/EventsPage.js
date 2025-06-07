import React, { useEffect, useState, useRef } from 'react';
import './styles/EventsPage.css'; 
import EventsCalendar from './EventsCalendar';
import axios from 'axios';

import eventImage1 from './img/i1.webp';
import eventImage2 from './img/i2.jpg';
import eventImage3 from './img/i3.jpg';
import speakerImage1 from './img/i4.webp';
import speakerImage2 from './img/i4.webp';
import speakerImage3 from './img/i4.webp';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [animatedEvents, setAnimatedEvents] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const titleRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const FLASK_API = "http://127.0.0.1:5000"; // Flask API endpoint
  
  // This effect only runs when the filter changes, not when page changes
  useEffect(() => {
    // Reset pagination and events when filter changes
    setPage(1);
    setEvents([]);
    fetchEvents(true); // true = reset list
  }, [activeFilter]);

  // This effect only runs when page changes (for pagination)
  useEffect(() => {
    // Only fetch more data when page increases (for "View More")
    if (page > 1) {
      fetchMoreEvents();
    }
  }, [page]);

  // Format date to "Mon, 22 Jun 2020" format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Initial fetch that replaces current events
  const fetchEvents = async (resetList = true) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${FLASK_API}/events?type=${activeFilter}&page=1`);
      
      // Process the received events to format dates
      const processedEvents = response.data.events.map(event => ({
        ...event,
        formattedDate: formatDate(event.recording_date)
      }));
      
      // Always replace the list on filter change
      setEvents(processedEvents);
      setHasMore(response.data.has_more);

      // Set featured event only on initial load or filter change
      if (activeFilter === "upcoming" && processedEvents.length > 0) {
        // Fetch a dedicated featured talk
        try {
          const featuredResponse = await axios.get(`${FLASK_API}/featured_talk`);
          if (featuredResponse.data) {
            setFeaturedEvent({
              ...featuredResponse.data,
              formattedDate: formatDate(featuredResponse.data.recording_date)
            });
          } else {
            setFeaturedEvent(processedEvents[0]);
          }
        } catch (featuredError) {
          console.error("Error fetching featured talk:", featuredError);
          setFeaturedEvent(processedEvents[0]);
        }
      } else if (activeFilter === "all" && processedEvents.length > 0) {
        const upcomingEvents = processedEvents.filter(event => 
          new Date(event.recording_date) >= new Date()
        );
        
        if (upcomingEvents.length > 0) {
          setFeaturedEvent(upcomingEvents[0]);
        } else {
          setFeaturedEvent(null);
        }
      } else {
        setFeaturedEvent(null);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate function for loading more events (pagination)
  const fetchMoreEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${FLASK_API}/events?type=${activeFilter}&page=${page}`);
      
      // Process the received events to format dates
      const processedEvents = response.data.events.map(event => ({
        ...event,
        formattedDate: formatDate(event.recording_date)
      }));
      
      // Append to existing list for "View More"
      setEvents(prevEvents => [...prevEvents, ...processedEvents]);
      setHasMore(response.data.has_more);
    } catch (error) {
      console.error("Error fetching more events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    if (activeFilter !== filter) {
      setActiveFilter(filter);
      // The useEffect will handle resetting page and events
    }
  };

  // Handle "View More" button click
  const handleViewMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Sample events data for fallback
  const allEvents = [
    {
      id: 1,
      title: "TED Global 2024",
      category: "conference",
      date: "June 16, 2025",
      location: "Vancouver, Canada",
      description: "Join us for our flagship conference featuring over 70 speakers across technology, entertainment, and design. Experience breakthrough talks, immersive workshops, and connect with global thought leaders.",
      image: eventImage1,
      featured: true,
      status: "past",
      speakers: [
        { name: "Dr. Maya Rodriguez", role: "Quantum Computing Researcher", image: speakerImage1 },
        { name: "Kevin Chen", role: "Climate Innovation Expert", image: speakerImage2 },
        { name: "Priya Mehta", role: "Neural Interface Designer", image: speakerImage3 }
      ],
      tickets: [
        { type: "Standard", price: "$1,200", available: true },
        { type: "Premium", price: "$2,500", available: true },
        { type: "VIP Experience", price: "$5,000", available: false }
      ]
    }
  ];

  useEffect(() => {
    // Stagger animation for event cards
    const timer = setTimeout(() => {
      setAnimatedEvents(events);
    }, 100);
    
    // Animation for section reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.events-section').forEach(section => {
      observer.observe(section);
    });
    
    // Clean up
    return () => {
      clearTimeout(timer);
      document.querySelectorAll('.events-section').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, [events]);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const closeModal = () => {
    setShowRegisterModal(false);
  };
  
  // Extract event name from tags (e.g., "TED2006", "TEDGlobal", etc.)
  const getEventName = (tags) => {
    if (!tags) return null;
    
    // Parse tags if it's a string
    const tagsList = typeof tags === 'string' ? 
      tags.split(',').map(tag => tag.trim()) : 
      (Array.isArray(tags) ? tags : []);
    
    // Look for event identifiers
    const eventPatterns = [
      /^TED\d{4}$/,        // TED2006, TED2016, etc.
      /^TEDGlobal/,        // TEDGlobal, TEDGlobal 2012, TEDGlobal>Geneva, etc.
      /^TEDx[A-Za-z]+/     // TEDxHouston, TEDxPuget Sound, etc.
    ];
    
    for (const pattern of eventPatterns) {
      const match = tagsList.find(tag => pattern.test(tag));
      if (match) return match;
    }
    
    return null;
  };

  return (
    <div className="events-container">
      {/* Background Elements */}
      <div className="accent-shape shape1"></div>
      <div className="accent-shape shape2"></div>
      <div className="accent-shape shape3"></div>
      
      {/* Header Section */}
      <div className="events-header">
        <h1 className="events-title" ref={titleRef}>
          TED <span className="highlight">Events</span>
        </h1>
        <div className="title-underline"></div>
        <p className="events-subtitle">Join inspiring gatherings where ideas come to life</p>
      </div>
      
      {/* Events Filters */}
      <section className="events-filter-section events-section">
        <div className="events-filters">
          <button
            className={`filter-btn ${activeFilter === 'upcoming' ? 'filter-active' : ''}`}
            onClick={() => handleFilterChange('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`filter-btn ${activeFilter === 'past' ? 'filter-active' : ''}`}
            onClick={() => handleFilterChange('past')}
          >
            Past Events
          </button>
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'filter-active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Events
          </button>
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (activeFilter === 'upcoming' || activeFilter === 'all') && (
        <section className="events-featured-section events-section">
          <div className="section-content">
            <h2>Featured Event</h2>
            <div className="featured-event">
              <div className="featured-event-image">
                {/* <img src={featuredEvent.url__photo__talk} alt={featuredEvent.talk__name} /> */}
                <div className="featured-event-date">
                  {/* <span>{featuredEvent.formattedDate}</span> */}
                </div>
              </div>
              <div className="featured-event-content">
                <h3>{featuredEvent.talk__name}</h3>
                <p className="speaker-name">by {featuredEvent.speaker__name}</p>
                <p className="featured-event-description">{featuredEvent.talk__description}</p>
                <button className="register-btn">Reminder Me</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="events-grid-section events-section">
        <div className="section-content">
          <h2>{activeFilter === 'upcoming' ? 'Upcoming Events' : activeFilter === 'past' ? 'Past Events' : 'All Events'}</h2>

          {isLoading && events.length === 0 && (
            <div className="no-events">
              <p>Loading events...</p>
            </div>
          )}

          {!isLoading && events.length === 0 && (
            <div className="no-events">
              <p>No events found. Check back soon for new events!</p>
            </div>
          )}

          <div className="events-grid">
            {events.map((event, index) => (
              (!featuredEvent || event.talk__id !== featuredEvent.talk__id) && (
                <div key={`${event.talk__id || index}-${index}`} className="event-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="event-image">
                    <img src={event.url__photo__talk} alt={event.talk__name} />
                    <div className="event-date">{event.formattedDate}</div>
                    {event.event && (
                      <div className="event-tag">
                        {event.event}
                      </div>
                    )}
                  </div>
                  
                  <div className="event-content">
                    <h3 className="event-title">{event.talk__name}</h3>
                    <p className="speaker-name">by {event.speaker__name}</p>
                    <p className="event-description">
                      {event.talk__description && event.talk__description.length > 120 
                        ? `${event.talk__description.substring(0, 120)}...` 
                        : event.talk__description}
                    </p>
                    {activeFilter === 'upcoming' && (
                      <button className="register-btn">Reminder Me</button>
                    )}
                    {(activeFilter === 'past' || activeFilter === 'all') && event.url__video && (
                      <Link 
                      to={`/video/${event.talk__id}`} // Use React Router's Link
                
                      style={{ textDecoration: "none" }}
                    >
                      {/* <a href={event.url__video} target="_blank" rel="noopener noreferrer"> */}
                        <button className="watch-talks-btn">Watch Now</button>
                      {/* </a> */}
                      </Link>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Pagination Button with Loading State */}
          {hasMore && (
            <div className="category-load-more">
              <button 
                className={`category-load-more-btn load-more-btn ${isLoading ? 'loading' : ''}`} 
                onClick={handleViewMore}
                disabled={isLoading}
              >
                {isLoading && page > 1 ? 'Loading...' : 'View More'}
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Calendar Section */}
      <section className="events-calendar-section events-section">
        <div className="section-content">
          <h2>Event Calendar</h2>
          {console.log("Events:", events.length)}
          <EventsCalendar events={events.length > 0 ? events : allEvents} />
        </div>
      </section>
      
      {/* Subscribe Section */}
      <section className="category-subscribe-section events-section">
          <div className="category-section-content">
            <div className="category-subscribe-card">
              <div className="category-subscribe-content">
                <h2>Get Event Updates</h2>
                <p>Be the first to know about upcoming TED events and get early access to ticket sales.</p>
                <form className="category-subscribe-form">
                  <input type="email" placeholder="Your email address" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
              <div className="category-subscribe-decoration">
                <div className="category-decoration-circle"></div>
                <div className="category-decoration-line"></div>
              </div>
            </div>
          </div>
        </section>
      
      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="register-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
            <h2>{selectedEvent.talk__name || selectedEvent.title}</h2>
            <p className="modal-location">
              {getEventName(selectedEvent.talks__tags) || selectedEvent.category || "TED Event"} • {selectedEvent.formattedDate || selectedEvent.date}
            </p>
            
            <div className="ticket-options">
              <h3>Select Ticket Type</h3>
              {selectedEvent.tickets && selectedEvent.tickets.length > 0 ? (
                <div className="ticket-list">
                  {selectedEvent.tickets.map((ticket, index) => (
                    <div key={index} className={`ticket-option ${!ticket.available ? 'sold-out' : ''}`}>
                      <div className="ticket-info">
                        <span className="ticket-type">{ticket.type}</span>
                        <span className="ticket-price">{ticket.price}</span>
                      </div>
                      {ticket.available ? (
                        <button className="select-ticket-btn">Select</button>
                      ) : (
                        <span className="sold-out-label">Sold Out</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-tickets">Registration is not currently open for this event.</p>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="secondary-btn" onClick={closeModal}>Cancel</button>
              <button className="primary-btn">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;