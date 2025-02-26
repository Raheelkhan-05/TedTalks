import React, { useEffect, useState, useRef } from 'react';
import './styles/EventsPage.css'; 
import EventsCalendar from './EventsCalendar';

import eventImage1 from './img/i1.webp';
import eventImage2 from './img/i2.jpg';
import eventImage3 from './img/i3.jpg';
import speakerImage1 from './img/i4.webp';
import speakerImage2 from './img/i4.webp';
import speakerImage3 from './img/i4.webp';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [animatedEvents, setAnimatedEvents] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const titleRef = useRef(null);

  // Sample events data
  const allEvents = [
    {
      id: 1,
      title: "TED Global 2024",
      category: "conference",
      date: "June 12-16, 2024",
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
    },
    {
      id: 2,
      title: "TEDxTech Summit",
      category: "summit",
      date: "April 8-9, 2024",
      location: "San Francisco, USA",
      description: "A focused two-day summit exploring the frontiers of technology and its implications for society. Featuring AI pioneers, digital ethics specialists, and technology innovators.",
      image: eventImage2,
      featured: false,
      status: "past",
      speakers: [
        { name: "Alex Washington", role: "AI Ethics Advocate", image: speakerImage2 },
        { name: "Sophia Lee", role: "Robotics Engineer", image: speakerImage3 }
      ],
      tickets: [
        { type: "Early Bird", price: "$350", available: true },
        { type: "Standard", price: "$550", available: true }
      ]
    },
    {
      id: 3,
      title: "TED Salon: Future of Health",
      category: "salon",
      date: "February 28, 2025",
      location: "London, UK",
      description: "An intimate evening focused on healthcare innovation and the future of medicine. Hear from leading researchers, practitioners, and healthcare innovators.",
      image: eventImage3,
      featured: false,
      status: "upcoming",
      speakers: [
        { name: "Dr. James Chen", role: "Genetic Engineering Pioneer", image: speakerImage1 }
      ],
      tickets: [
        { type: "General Admission", price: "$75", available: true }
      ]
    },
    {
      id: 4,
      title: "TEDxYouth @ Boston",
      category: "tedx",
      date: "February 22, 2025",
      location: "Boston, USA",
      description: "A day of inspiration for young thinkers and doers. Youth-focused talks and workshops designed to ignite curiosity and creative problem-solving.",
      image: eventImage2,
      featured: false,
      status: "past",
      speakers: [
        { name: "Zoe Martinez", role: "Youth Climate Activist", image: speakerImage3 },
        { name: "Tom Wilson", role: "Educational Technology Developer", image: speakerImage2 }
      ],
      tickets: [
        { type: "Student", price: "$25", available: true },
        { type: "Adult", price: "$45", available: true }
      ]
    },
    {
      id: 5,
      title: "TED2024: The Brave New Dawn",
      category: "conference",
      date: "October 12-16, 2024",
      location: "New York, USA",
      description: "Our annual global conference brought together visionaries and innovators from around the world to share ideas worth spreading.",
      image: eventImage1,
      featured: false,
      status: "past",
      speakers: [
        { name: "Dr. Eric Johnson", role: "Neuroscience Researcher", image: speakerImage1 },
        { name: "Michelle Park", role: "Sustainable Architecture Pioneer", image: speakerImage2 }
      ],
      tickets: []
    }
  ];

  // Filter events based on selected filter
  const filteredEvents = activeFilter === 'all' 
    ? allEvents 
    : allEvents.filter(event => event.status === activeFilter);

  useEffect(() => {
    // Stagger animation for event cards
    const timer = setTimeout(() => {
      setAnimatedEvents(filteredEvents);
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
  }, [filteredEvents]);
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Reset animation state
    setAnimatedEvents([]);
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const closeModal = () => {
    setShowRegisterModal(false);
  };

  // Get featured event
  const featuredEvent = allEvents.find(event => event.featured && event.status === 'upcoming');

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
      {featuredEvent && activeFilter !== 'past' && (
        <section className="events-featured-section events-section">
          <div className="section-content">
            <h2>Featured Event</h2>
            <div className="featured-event">
              <div className="featured-event-image">
                <img src={featuredEvent.image} alt={featuredEvent.title} />
                <div className="featured-event-date">
                  <span>{featuredEvent.date}</span>
                </div>
              </div>
              <div className="featured-event-content">
                <div className="featured-event-category">{featuredEvent.category}</div>
                <h3>{featuredEvent.title}</h3>
                
                <p className="featured-event-description">{featuredEvent.description}</p>
                
                <div className="featured-event-speakers">
                  <h4>Featured Speakers</h4>
                  <div className="speaker-avatars">
                    {featuredEvent.speakers.map((speaker, index) => (
                      <div key={index} className="speaker-avatar">
                        <img src={speaker.image} alt={speaker.name} />
                        <div className="speaker-info">
                          <span className="speaker-name">{speaker.name}</span>
                          <span className="speaker-role">{speaker.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="register-btn"
                  onClick={() => handleRegisterClick(featuredEvent)}
                >
                  Remainder Me
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Events Grid */}
      <section className="events-grid-section events-section">
        <div className="section-content">
          <h2>{activeFilter === 'upcoming' ? 'Upcoming Events' : 
               activeFilter === 'past' ? 'Past Events' : 'All Events'}</h2>
          
          {filteredEvents.length === 0 && (
            <div className="no-events">
              <p>No events found. Check back soon for new events!</p>
            </div>
          )}
          
          <div className="events-grid">
            {animatedEvents.map((event, index) => (
              event.id !== (featuredEvent?.id) && (
                <div key={event.id} className="event-card" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <div className="event-date">{event.date}</div>
                    <div className="event-category">{event.category}</div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    
                    <p className="event-description">{event.description.substring(0, 120)}...</p>
                    
                    {event.status === 'upcoming' && (
                      <button 
                        className="register-btn"
                        onClick={() => handleRegisterClick(event)}
                      >
                        Remainder Me
                      </button>
                    )}
                    
                    {event.status === 'past' && (
                      <button className="watch-talks-btn">
                        Watch Now
                      </button>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>
      
      {/* Calendar Section */}
      <section className="events-calendar-section events-section">
        <div className="section-content">
          <h2>Event Calendar</h2>
          <EventsCalendar events={allEvents} />
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
            <h2>{selectedEvent.title}</h2>
            <p className="modal-location">{selectedEvent.location} • {selectedEvent.date}</p>
            
            <div className="ticket-options">
              <h3>Select Ticket Type</h3>
              {selectedEvent.tickets.length > 0 ? (
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