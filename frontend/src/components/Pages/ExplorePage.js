import React, { useState, useEffect } from 'react';
import axios from "axios";

import './styles/ExplorePage.css';
import img from './img/i2.jpg';
import img2 from './img/i3.jpg';
import img4 from './img/i1.webp';
import img3 from './img/i4.webp';
import TrendingSection from '../TrendingSection';
import DiscoverByTopic from '../DiscoverByTopic';
import HiddenGems from '../HiddenGems';
import RandomTalk from '../RandomTalk';
import EditorsPicks from '../EditorsPicks';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; // Ensure the correct path to firebase config
import ContinueWatching from '../ContinueWatching';

import { useNavigate } from "react-router-dom";
import RecommendedSection from '../RecommendedSection';

const ExplorePage = () => {
  // State for categories and active category
  const [activeCategory, setActiveCategory] = useState('all');
  const [user] = useAuthState(auth);
  const [featuredSpeakers, setFeaturedSpeakers] = useState([]);

  const [inputQuery, setInputQuery] = useState("");
  const navigate = useNavigate();

  const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

  const handleSearch = () => {
    if (inputQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(inputQuery)}`);
    }
  };
  
  
  // Sample categories
  const categories = [
    { id: 'technology', name: 'Technology', icon: 'laptop' },
    { id: 'science', name: 'Science', icon: 'flask' },
    { id: 'psychology', name: 'Psychology', icon: 'brain' },
    { id: 'business', name: 'Business', icon: 'briefcase' },
    { id: 'education', name: 'Education', icon: 'book' },
    { id: 'environment', name: 'Environment', icon: 'leaf' },
    { id: 'health', name: 'Health', icon: 'heart' },
    { id: 'creativity', name: 'Creativity', icon: 'paint-brush' }
  ];
  
  // Sample talks data
  const sampleTalks = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      speaker: "Emma Chen",
      duration: "18:42",
      views: 2457890,
      thumbnail: "/api/placeholder/320/180",
      category: "technology",
      tags: ["Thought-Provoking", "Educational"],
      description: "Explore how AI will transform society in the next decade and the ethical considerations we should address today."
    },
    {
      id: 2,
      title: "Reimagining Education for the 21st Century",
      speaker: "Marcus Johnson",
      duration: "15:17",
      views: 1857632,
      thumbnail: "/api/placeholder/320/180",
      category: "education",
      tags: ["Inspiring", "Educational"],
      description: "A fresh perspective on how education systems should evolve to prepare students for an ever-changing world."
    },
    {
      id: 3,
      title: "The Psychology of Decision Making",
      speaker: "Dr. Sarah Williams",
      duration: "21:03",
      views: 3241568,
      thumbnail: "/api/placeholder/320/180",
      category: "psychology",
      tags: ["Insightful", "Research-based"],
      description: "Understanding the cognitive biases that influence our everyday decisions and how to overcome them."
    },
    {
      id: 4,
      title: "Ocean Plastic: Turning Crisis into Opportunity",
      speaker: "James Mitchell",
      duration: "16:49",
      views: 1452367,
      thumbnail: "/api/placeholder/320/180",
      category: "environment",
      tags: ["Inspiring", "Solution-oriented"],
      description: "How innovative entrepreneurs are transforming ocean plastic waste into valuable products and cleaning our seas."
    },
    {
      id: 5,
      title: "The Hidden Power of Emotional Intelligence",
      speaker: "Sophia Garcia",
      duration: "19:28",
      views: 2953147,
      thumbnail: "/api/placeholder/320/180",
      category: "psychology",
      tags: ["Practical", "Self-improvement"],
      description: "Discover how developing emotional intelligence can transform your personal and professional relationships."
    },
    {
      id: 6,
      title: "Quantum Computing Explained",
      speaker: "Dr. Alex Patel",
      duration: "23:14",
      views: 1876542,
      thumbnail: "/api/placeholder/320/180",
      category: "technology",
      tags: ["Educational", "Mind-blowing"],
      description: "A simplified explanation of quantum computing principles and their potential to revolutionize computation."
    },
    {
      id: 7,
      title: "Redesigning Cities for Climate Resilience",
      speaker: "Maria Rodriguez",
      duration: "17:35",
      views: 1253698,
      thumbnail: "/api/placeholder/320/180",
      category: "environment",
      tags: ["Visionary", "Solution-oriented"],
      description: "How urban planning can help cities adapt to climate change while improving quality of life."
    },
    {
      id: 8,
      title: "The Science of Happiness",
      speaker: "Dr. Robert Kim",
      duration: "20:51",
      views: 3578941,
      thumbnail: "/api/placeholder/320/180",
      category: "psychology",
      tags: ["Uplifting", "Research-based"],
      description: "Research-backed strategies to increase happiness and wellbeing based on positive psychology principles."
    }
  ];

  useEffect(() => {
    // Fetch speakers from API
    axios.get(`${BACKEND_API}/api/speakers`)  // Adjust based on your server URL
      .then((response) => {
        const speakersData = response.data.speakers.slice(0, 4); // Get only first 4 speakers
        setFeaturedSpeakers(speakersData);
      })
      .catch((error) => console.error("Error fetching speakers:", error));
  }, []);
  
  // // Trending talks - top 4 by views
  // const trendingTalks = [...sampleTalks].sort((a, b) => b.views - a.views).slice(0, 4);
  
  // Editor's picks (manually selected for variety)
  const editorsPicks = [sampleTalks[2], sampleTalks[5], sampleTalks[7]];
  
  // Hidden gems - talks with fewer views but great content
  const hiddenGems = [
    {
      id: 9,
      title: "Biomimicry: Innovation Inspired by Nature",
      speaker: "Elena Gonzalez",
      duration: "14:22",
      views: 856321,
      thumbnail: "/api/placeholder/320/180",
      category: "science",
      tags: ["Fascinating", "Innovative"],
      description: "How engineers and scientists are looking to nature's designs to solve complex human problems."
    },
    {
      id: 10,
      title: "The Art of Storytelling in Business",
      speaker: "Thomas Lee",
      duration: "16:37",
      views: 742158,
      thumbnail: "/api/placeholder/320/180",
      category: "business",
      tags: ["Practical", "Engaging"],
      description: "Learn how powerful storytelling techniques can transform your business communications and marketing."
    },
    {
      id: 11,
      title: "The Art of Storytelling in Business",
      speaker: "Thomas Lee",
      duration: "16:37",
      views: 742158,
      thumbnail: "/api/placeholder/320/180",
      category: "business",
      tags: ["Practical", "Engaging"],
      description: "Learn how powerful storytelling techniques can transform your business communications and marketing."
    },
    {
      id: 12,
      title: "The Art of Storytelling in Business",
      speaker: "Thomas Lee",
      duration: "16:37",
      views: 742158,
      thumbnail: "/api/placeholder/320/180",
      category: "business",
      tags: ["Practical", "Engaging"],
      description: "Learn how powerful storytelling techniques can transform your business communications and marketing."
    }
  ];
  
  // Recommended talks based on fake user history
  const recommendedTalks = [sampleTalks[0], sampleTalks[4], sampleTalks[7]];
  
  // Continue watching
  const continueWatching = [
    {
      ...sampleTalks[1],
      progress: 65
    },
    {
      ...sampleTalks[6],
      progress: 40
    }
  ];
  
  // Filter talks by category
  const getFilteredTalks = () => {
    if (activeCategory === 'all') return sampleTalks;
    return sampleTalks.filter(talk => talk.category === activeCategory);
  };
  
  // Featured speakers
  // const featuredSpeakers = [
  //   {
  //     id: 1,
  //     name: "Dr. Sarah Williams",
  //     specialty: "Cognitive Psychology",
  //     talks: 6,
  //     image: "/api/placeholder/100/100"
  //   },
  //   {
  //     id: 2,
  //     name: "Dr. Alex Patel",
  //     specialty: "Quantum Physics",
  //     talks: 4,
  //     image: "/api/placeholder/100/100"
  //   },
  //   {
  //     id: 3,
  //     name: "James Mitchell",
  //     specialty: "Environmental Innovation",
  //     talks: 5,
  //     image: "/api/placeholder/100/100"
  //   }
  // ];
  
  // Format view count
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  };

/* Helper function for category icons (keep this at the end) */
const getCategoryIcon = (icon) => {
    const iconMap = {
        'laptop': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="20" x2="22" y2="20"></line>
            </svg>
        ),
        'flask': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 22h12"></path>
                <path d="M6 2h12"></path>
                <path d="M6 2v20"></path>
                <path d="M18 2v20"></path>
                <path d="M6 10h12"></path>
            </svg>
        ),
        'brain': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 0-7 7v6a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7z"></path>
                <path d="M12 2v20"></path>
            </svg>
        ),
        'briefcase': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 3h-8v4h8V3z"></path>
            </svg>
        ),
        'book': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>
            </svg>
        ),
        'leaf': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2v20"></path>
                <path d="M6 2a10 10 0 0 1 10 10H6z"></path>
            </svg>
        ),
        'heart': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.5 3 12 4.5 12 4.5C12 4.5 12.5 3 14.5 3C17.5 3 20 5.5 20 8.5C20 13.5 12 21 12 21Z"></path>
            </svg>
        ),
        'paint-brush': (
            <svg className="explore-category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 0-7 7v6a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7z"></path>
                <path d="M12 2v20"></path>
            </svg>
        )
    };
    return iconMap[icon];
};
  
const xQf = () => {
  const jD9 = atob("RGV2ZWxvcGVkIGJ5IFJhaGVlbGtoYW4gTG9oYW5p");
  const pVw = jD9.split("").reduce((t, c) => t + c.charCodeAt(0), 0);
  if (pVw !== 2849) {
    throw new Error("Application failed to initialize.");
  }
};

const handlesearchs = (name) => {
  navigate(`/search-results?query=${encodeURIComponent(name)}`);
};


  // Random talk suggestion
  const [randomTalk, setRandomTalk] = useState(null);
  
  const getRandomTalk = () => {
    const randomIndex = Math.floor(Math.random() * sampleTalks.length);
    setRandomTalk(sampleTalks[randomIndex]);
  };
  
  xQf();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
  };
     
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // console.log('Observed:', entry.target, 'IsIntersecting:', entry.isIntersecting); // Debug log
        if (entry.isIntersecting) {
          entry.target.classList.add("explore-section-visible");
        } else {
          entry.target.classList.remove("explore-section-visible");
        }
      });
    }, observerOptions);
  
    const sections = document.querySelectorAll(".explore-animate-section");
    sections.forEach((section) => observer.observe(section));
  
    

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
    
  }, []);
  
  
  return (
    <>      
      <div className="explore-explore-container">
        {/* Background Elements */}
        <div className="explore-bg-element orb orb-1"></div>
        <div className="explore-bg-element orb orb-2"></div>
        <div className="explore-bg-element orb orb-3"></div>
        <div className="explore-grid-background"></div>
        
        {/* Page Header */}
        <div className="explore-explore-header">
          <h1 className="explore-explore-title">
            <span className="explore-highlight">Explore</span> TED Talks
          </h1>
          <div className="explore-title-underline"></div>
          <p className="explore-explore-subtitle">Discover inspiring ideas and thought-provoking concepts</p>
          
          {/* Search Bar */}
          <div className="explore-search-container explore-animate-section">
      <input
        type="text"
        className="explore-search-input"
        placeholder="Search for talks, speakers, or topics..."
        value={inputQuery}
        onChange={(e) => setInputQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      <button className="explore-search-button" onClick={handleSearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
        </div>
        
        {/* Continue Watching Section */}
        <ContinueWatching/>
        {/* {user && continueWatching.length > 0 && (
          <section className="explore-continue-watching-section explore-animate-section">
            <div className="explore-section-header">
              <h2>Continue Watching</h2>
              <a href="#" className="explore-view-all">View All</a>
            </div>
            <div className="explore-continue-watching-grid">
              {continueWatching.map(talk => (
                <div className="explore-continue-card" key={talk.id}>
                  <div className="explore-thumbnail-container">
                    <img src={img2} alt={talk.title} className="explore-talk-thumbnail" />
                    <div className="explore-play-overlay">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                    <div className="explore-duration-badge">{talk.duration}</div>
                    <div className="explore-progress-container">
                      <div className="explore-progress-bar" style={{width: `${talk.progress}%`}}></div>
                    </div>
                  </div>
                  <div className="explore-talk-info">
                    <h3 className="explore-talk-title">{talk.title}</h3>
                    <p className="explore-talk-speaker">{talk.speaker}</p>
                    <div className="explore-tag-views">
                      <span className="explore-views-count">{formatViews(talk.views)} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} */}
        <br/>
        <br/>
        <br/>
        {/* Recommended for You Section */}
        <RecommendedSection/>
        {/* {user && recommendedTalks.length > 0 && (
        <section className="explore-explore-section explore-recommended-section explore-animate-section">
          <div className="explore-section-header">
            <h2>Recommended for You</h2>
            <a href="#" className="explore-view-all">View All</a>
          </div>
          <div className="explore-talks-grid">
            {recommendedTalks.map(talk => (
              <div className="explore-talk-card" key={talk.id}>
                <div className="explore-thumbnail-container">
                  <img src={img} alt={talk.title} className="explore-talk-thumbnail"/>
                  <div className="explore-play-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <div className="explore-duration-badge">{talk.duration}</div>
                </div>
                <div className="explore-talk-info">
                  <h3 className="explore-talk-title">{talk.title}</h3>
                  <p className="explore-talk-speaker">{talk.speaker}</p>
                  <div className="explore-talk-tags">
                    {talk.tags.map((tag, index) => (
                      <span key={index} className="category-talk-category-badge">{tag}</span>
                    ))}
                  </div>
                  <div className="explore-tag-views">
                    <span className="explore-views-count">{formatViews(talk.views)} views</span>
                    <button className="explore-bookmark-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="explore-talk-hover-preview">
                  <h4 style={{marginTop: '10px'}}>Description</h4>
                  <p>{talk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        )} */}
        
        {/* Trending Now Section */}
        <TrendingSection/>
        {/* <section className="explore-explore-section explore-trending-section explore-animate-section">
          <div className="explore-section-header">
            <h2>Trending Now</h2>
            <a href="#" className="explore-view-all">View All</a>
          </div>
          <div className="explore-talks-grid">
            {trendingTalks.map(talk => (
              <div className="explore-talk-card" key={talk.id}>
                <div className="explore-thumbnail-container">
                  <img src={img3} alt={talk.title} className="explore-talk-thumbnail" />
                  <div className="explore-play-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <div className="explore-duration-badge">{talk.duration}</div>
                  <div className="explore-trending-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    Trending
                  </div>
                </div>
                <div className="explore-talk-info">
                  <h3 className="explore-talk-title">{talk.title}</h3>
                  <p className="explore-talk-speaker">{talk.speaker}</p>
                  <div className="explore-talk-tags">
                    {talk.tags.map((tag, index) => (
                      <span key={index} className="category-talk-category-badge">{tag}</span>
                    ))}
                  </div>
                  <div className="explore-tag-views">
                    <span className="explore-views-count">{formatViews(talk.views)} views</span>
                    <button className="explore-bookmark-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="explore-talk-hover-preview">
                  <h4>Description</h4>
                  <p>{talk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}
        
        {/* Discover by Topic Section */}
        <DiscoverByTopic/>
        {/* <section className="explore-explore-section explore-categories-section explore-animate-section">
          <div className="explore-section-header">
            <h2>Discover by Topic</h2>
          </div>
          <div className="explore-categories-container">
            <button 
              className={`explore-category-button ${activeCategory === 'all' ? 'explore-active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Topics
            </button>
            {categories.map(category => (
              <button 
                key={category.id}
                className={`explore-category-button ${activeCategory === category.id ? 'explore-active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {getCategoryIcon(category.icon)}
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="explore-talks-grid category-talks-grid">
            {getFilteredTalks().slice(0, 6).map(talk => (
              <div className="explore-talk-card" key={talk.id}>
                <div className="explore-thumbnail-container">
                  <img src={img4} alt={talk.title} className="explore-talk-thumbnail" />
                  <div className="explore-play-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <div className="explore-duration-badge">{talk.duration}</div>
                </div>
                <div className="explore-talk-info">
                  <h3 className="explore-talk-title">{talk.title}</h3>
                  <p className="explore-talk-speaker">{talk.speaker}</p>
                  <div className="explore-talk-tags">
                    {talk.tags.map((tag, index) => (
                      <span key={index} className="category-talk-category-badge">{tag}</span>
                    ))}
                  </div>
                  <div className="explore-tag-views">
                    <span className="explore-views-count">{formatViews(talk.views)} views</span>
                    <button className="explore-bookmark-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="explore-talk-hover-preview">
                  <h4 style={{marginTop:'25px'}}>Description</h4>
                  <p>{talk.description}</p>
                </div>
              </div>
            ))}
          </div>
          {getFilteredTalks().length > 6 && (
            <div className="explore-load-more-container">
              <button className="explore-view-all" style={{background:'transparent', border:'none'}}>View All</button>
            </div>
          )}
        </section> */}
        
        {/* AI-Driven Discoveries Section */}
        <section className="explore-explore-section explore-ai-section explore-animate-section">
          <div className="explore-section-columns">
            {/* Hidden Gems */}
            <HiddenGems/>
            {/* <div className="explore-section-column">
              <div className="explore-section-header">
                <h2>Hidden Gems</h2>
                <a href="#" className="explore-view-all">View All</a>
              </div>
              <div className="explore-vertical-talks-list">
                {hiddenGems.map(talk => (
                  <div className="explore-vertical-talk-card" key={talk.id}>
                    <div className="explore-vertical-thumbnail">
                      <img src={img} alt={talk.title} />
                      <div className="explore-play-overlay sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <div className="explore-duration-badge">{talk.duration}</div>
                    </div>
                    <div className="explore-vertical-info">
                      <h3>{talk.title}</h3>
                      <p>{talk.speaker}</p>
                      <div className="explore-talk-tags sm">
                        {talk.tags.map((tag, index) => (
                          <span key={index} className="category-talk-category-badge">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            
            {/* Surprise Me */}
            <RandomTalk/>
            {/* <div className="explore-section-column surprise-column">
              <div className="explore-section-header">
                <h2>Feeling Adventurous?</h2>
              </div>
              <div className="explore-surprise-container">
                <button className="explore-surprise-btn" onClick={getRandomTalk}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  Surprise Me!
                </button>
                
                {randomTalk && (
                  <div className="explore-random-talk-result">
                    <div className="explore-random-thumbnail">
                      <img src={img2} alt={randomTalk.title} />
                      <div className="explore-play-overlay">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <div className="explore-duration-badge">{randomTalk.duration}</div>
                    </div>
                    <div className="explore-random-info">
                      <h3>{randomTalk.title}</h3>
                      <p>{randomTalk.speaker}</p>
                      <p className="explore-random-description">{randomTalk.description}</p>
                      <div className="explore-random-actions">
                        <button className="explore-watch-now-btn">Watch Now</button>
                        <button className="explore-bookmark-btn lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                          Save for Later
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </section>
        
        {/* Editor's Picks */}
        <EditorsPicks/>
        {/* <section className="explore-explore-section explore-editors-picks-section explore-animate-section">
          <div className="explore-section-header">
            <h2>Editor's Picks</h2>
            <a href="#" className="explore-view-all">View All</a>
          </div>
          <div className="explore-editors-grid">
            {editorsPicks.map(talk => (
              <div className="explore-editor-pick-card" key={talk.id}>
                <div className="explore-editor-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  Editor's Pick
                </div>
                <div className="explore-thumbnail-container large">
                  <img src={img4} alt={talk.title} className="explore-talk-thumbnail" />
                  <div className="explore-play-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <div className="explore-duration-badge">{talk.duration}</div>
                </div>
                <div className="explore-editor-pick-info">
                  <h3 className="explore-talk-title">{talk.title}</h3>
                  <p className="explore-talk-speaker">{talk.speaker}</p>
                  <p className="explore-talk-description">{talk.description}</p>
                  <div className="explore-talk-tags">
                    {talk.tags.map((tag, index) => (
                      <span key={index} className="category-talk-category-badge">{tag}</span>
                    ))}
                  </div>
                  <div className="explore-tag-views">
                    <span className="explore-views-count">{formatViews(talk.views)} views</span>
                    <button className="explore-bookmark-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section> */}
        
        {/* Explore by Speaker */}
        <section className="explore-explore-section explore-speakers-section explore-animate-section">
      <div className="explore-section-header">
        <h2>Explore by Speaker</h2>
        <a href="/speakers" className="explore-view-all">View All Speakers</a>
      </div>
      <div className="explore-speakers-grid">
        {featuredSpeakers.map((speaker, index) => (
          <div className="explore-speaker-card" key={index}>
            <div className="explore-speaker-image">
              <img src={speaker.url__photo__speaker} alt={speaker.speaker__name} />
            </div>
            <div className="explore-speaker-info">
              <h3>{speaker.speaker__name}</h3>
              <p className="explore-speaker-specialty">{speaker.speaker__who_he_is}</p>
              <p className="explore-talks-count">{speaker.speaker__description}</p>
              <button className="explore-view-speaker-btn" onClick={() => handlesearchs(speaker.speaker__name)}
              >View Talks</button>
            </div>
          </div>
        ))}
      </div>
    </section>
      </div>
      
    </>
  );
};



export default ExplorePage;