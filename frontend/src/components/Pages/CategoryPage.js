import React, { useEffect, useState, useRef } from 'react';
import './styles/CategoryPage.css'; // Updated CSS filename

import i1 from './img/i1.webp';
import i2 from './img/i2.jpg';
import i3 from './img/i3.jpg';
import i4 from './img/i4.webp';

const CategoryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [animatedTalks, setAnimatedTalks] = useState([]);
  const titleRef = useRef(null);
  
  // Sample categories data
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'science', name: 'Science' },
    { id: 'psychology', name: 'Psychology' },
    { id: 'business', name: 'Business' },
    { id: 'design', name: 'Design' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Health & Medicine' },
    { id: 'society', name: 'Society & Culture' }
  ];
  
  // Sample TED talks data
  const allTalks = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      speaker: "Emily Chen",
      category: "technology",
      duration: "18:24",
      date: "Feb 2025",
      views: "1.4M",
      image: "/img/i1.webp",
      description: "How AI is reshaping industries and what we can expect in the coming decade."
    },
    {
      id: 2,
      title: "Climate Solutions We Can Implement Today",
      speaker: "Marcus Green",
      category: "science",
      duration: "14:36",
      date: "Jan 2025",
      views: "842K",
      image: "/api/placeholder/400/225",
      description: "Practical approaches to combat climate change that don't require waiting for new technology."
    },
    {
      id: 3,
      title: "The Psychology of Decision Making",
      speaker: "Sophia Patel",
      category: "psychology",
      duration: "21:07",
      date: "Dec 2024",
      views: "1.2M",
      image: "/api/placeholder/400/225",
      description: "Understanding the cognitive biases that influence our everyday choices."
    },
    {
      id: 4,
      title: "Redesigning Education for the 21st Century",
      speaker: "David Washington",
      category: "education",
      duration: "16:42",
      date: "Nov 2024",
      views: "976K",
      image: "/api/placeholder/400/225",
      description: "How we can transform educational systems to prepare students for the future."
    },
    {
      id: 5,
      title: "Building Sustainable Business Models",
      speaker: "Michelle Rodriguez",
      category: "business",
      duration: "19:15",
      date: "Jan 2025",
      views: "650K",
      image: "/api/placeholder/400/225",
      description: "How companies can thrive while prioritizing environmental and social responsibility."
    },
    {
      id: 6,
      title: "The Quantum Revolution",
      speaker: "Alan Zhao",
      category: "science",
      duration: "22:48",
      date: "Feb 2025",
      views: "789K",
      image: "/api/placeholder/400/225",
      description: "How quantum computing will transform technology and solve previously impossible problems."
    },
    {
      id: 7,
      title: "Designing for Accessibility",
      speaker: "Nadia Johnson",
      category: "design",
      duration: "15:33",
      date: "Oct 2024",
      views: "542K",
      image: "/api/placeholder/400/225",
      description: "Inclusive design principles that make digital and physical spaces accessible to all."
    },
    {
      id: 8,
      title: "The Microbiome: The Hidden Key to Health",
      speaker: "Dr. James Wilson",
      category: "health",
      duration: "20:15",
      date: "Dec 2024",
      views: "892K",
      image: "/api/placeholder/400/225",
      description: "New discoveries about the crucial role gut bacteria play in overall health and wellbeing."
    },
    {
      id: 9,
      title: "Reimagining Urban Spaces",
      speaker: "Camila Fernandez",
      category: "society",
      duration: "17:52",
      date: "Nov 2024",
      views: "723K",
      image: "/api/placeholder/400/225",
      description: "How innovative urban planning can create more sustainable and human-centered cities."
    },
    {
      id: 10,
      title: "The Future of Work",
      speaker: "Thomas Lee",
      category: "business",
      duration: "19:43",
      date: "Jan 2025",
      views: "1.1M",
      image: "/api/placeholder/400/225",
      description: "How AI, automation, and changing values are reshaping careers and workplaces."
    },
    {
      id: 11,
      title: "Neuroscience of Creativity",
      speaker: "Dr. Olivia Grant",
      category: "psychology",
      duration: "18:09",
      date: "Feb 2025",
      views: "687K",
      image: "/api/placeholder/400/225",
      description: "What happens in our brains during creative processes and how to enhance creative thinking."
    },
    {
      id: 12,
      title: "Blockchain Beyond Cryptocurrency",
      speaker: "Raj Patel",
      category: "technology",
      duration: "16:27",
      date: "Dec 2024",
      views: "766K",
      image: "/api/placeholder/400/225",
      description: "How distributed ledger technology is revolutionizing industries from supply chain to healthcare."
    }
  ];
  
  // Filter talks based on selected category
  const filteredTalks = activeCategory === 'all' 
    ? allTalks 
    : allTalks.filter(talk => talk.category === activeCategory);
    
  useEffect(() => {
    // Stagger animation for talk cards
    const timer = setTimeout(() => {
      setAnimatedTalks(filteredTalks);
    }, 100);
    
    // Animation for section reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('category-section-visible');
        } else {
          entry.target.classList.remove('category-section-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.category-animate-section').forEach(section => {
      observer.observe(section);
    });
    
    // Clean up
    return () => {
      clearTimeout(timer);
      document.querySelectorAll('.category-animate-section').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, [filteredTalks]);
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    // Reset animation state
    setAnimatedTalks([]);
  };

  return (
    <>
      <div className="category-container">
        {/* Background Elements */}
        <div className="category-bg-element category-orb category-orb-1"></div>
        <div className="category-bg-element category-orb category-orb-2"></div>
        <div className="category-bg-element category-orb category-orb-3"></div>
        <div className="category-grid-background"></div>
        
        {/* Header Section */}
        <div className="category-header">
          <h1 className="category-title" ref={titleRef}>
            Explore <span className="category-highlight">Categories</span>
          </h1>
          <div className="category-title-underline"></div>
          <p className="category-subtitle">Discover inspiring TED talks organized by topic</p>
        </div>
        
        {/* Categories Navigation */}
        <section className="category-nav-section category-animate-section">
          <div className="category-nav">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'category-active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>
        
        {/* Featured Section */}
        {activeCategory === 'all' && (
          <section className="category-featured-section category-animate-section">
            <div className="category-section-content">
              <h2>Featured Talks</h2>
              <div className="category-featured-talk">
                <div className="category-featured-talk-content">
                  <div className="category-featured-talk-info">
                    <span className="category-talk-category">Technology</span>
                    <h3>The Next Frontier of Human-Computer Interaction</h3>
                    <p className="category-talk-speaker">Dr. Jessica Hernandez</p>
                    <p className="category-talk-description">
                      In this groundbreaking talk, Dr. Hernandez explores how brain-computer interfaces are evolving and what they mean for the future of communication, accessibility, and human potential.
                    </p>
                    <div className="category-talk-meta">
                      <span className="category-talk-duration">22:17</span>
                      <span className="category-talk-date">Feb 2025</span>
                      <span className="category-talk-views">2.3M views</span>
                    </div>
                    <button className="category-watch-btn">Watch Now</button>
                  </div>
                  <div className="category-featured-talk-image">
                    <img src={i1} alt="Featured TED Talk" />
                    <div className="category-play-button">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                        <path fill="#ffffff" stroke="#ffffff" strokeWidth="2" d="M5 3l14 9-14 9V3z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Talks Grid */}
        <section className="category-talks-section category-animate-section">
          <div className="category-section-content">
            <h2>{activeCategory === 'all' ? 'All Talks' : categories.find(c => c.id === activeCategory).name + ' Talks'}</h2>
            
            {filteredTalks.length === 0 && (
              <div className="category-no-talks">
                <p>No talks found in this category. Check back soon for new content!</p>
              </div>
            )}
            
            <div className="category-talks-grid">
              {animatedTalks.map((talk, index) => (
                <span className='popup'>
                <div key={talk.id} className="category-talk-card" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="category-talk-image">
                    <img src={i2} alt={talk.title} />
                    <div className="category-talk-duration">{talk.duration}</div>
                    <div className="category-play-overlay">
                      <div className="category-play-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                          <path fill="#ffffff" d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="category-talk-content">
                    <div className="category-talk-category-badge">{categories.find(c => c.id === talk.category).name}</div>
                    <h3 className="category-talk-title">{talk.title}</h3>
                    <p className="category-talk-speaker">{talk.speaker}</p>
                    <p className="category-talk-description">{talk.description}</p>
                    <div className="category-talk-meta">
                      <span className="category-talk-date">{talk.date}</span>
                      <span className="category-talk-views">{talk.views} views</span>
                    </div>
                  </div>
                </div>
                </span>
              ))}
            </div>
            
            {filteredTalks.length > 0 && (
              <div className="category-load-more">
                <button className="category-load-more-btn">Load More Talks</button>
              </div>
            )}
          </div>
        </section>
        
        {/* Browse by Topic Section */}
        <section className="category-topics-section category-animate-section">
          <div className="category-section-content">
            <h2>Browse by Topic</h2>
            <div className="category-topics-grid">
              {[
                {id: 'technology', name: 'Technology', icon: '💻', color: '#4A90E2'},
                {id: 'science', name: 'Science', icon: '🔬', color: '#50E3C2'},
                {id: 'psychology', name: 'Psychology', icon: '🧠', color: '#B8E986'},
                {id: 'business', name: 'Business', icon: '📊', color: '#F5A623'},
                {id: 'design', name: 'Design', icon: '✏️', color: '#F8E71C'},
                {id: 'education', name: 'Education', icon: '📚', color: '#9013FE'},
                {id: 'health', name: 'Health & Medicine', icon: '❤️', color: '#FF6B6B'},
                {id: 'society', name: 'Society & Culture', icon: '🌍', color: '#D0021B'}
              ].map(topic => (
                <div 
                  key={topic.id} 
                  className="category-topic-card"
                  style={{backgroundColor: `${topic.color}20`}} // 20 is hex for 12% opacity
                  onClick={() => handleCategoryChange(topic.id)}
                >
                  <div className="category-topic-icon" style={{backgroundColor: topic.color}}>{topic.icon}</div>
                  <h3>{topic.name}</h3>
                  <div className="category-topic-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="none" stroke="currentColor" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Subscribe Section */}
        <section className="category-subscribe-section category-animate-section">
          <div className="category-section-content">
            <div className="category-subscribe-card">
              <div className="category-subscribe-content">
                <h2>Stay Updated with New Talks</h2>
                <p>Get weekly recommendations and updates on the latest TED talks in your favorite categories.</p>
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
      </div>
    </>
  );
};

export default CategoryPage;