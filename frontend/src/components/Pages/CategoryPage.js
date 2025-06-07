import React, { useEffect, useState, useRef } from 'react';
import './styles/CategoryPage.css';
import axios from 'axios';
import { useParams } from "react-router-dom";
import i1 from './img/i1.webp';
import i2 from './img/i2.jpg';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const location = useLocation();
  const selectedCategory = location.state?.selectedCategory || "all";
  const queryParams = new URLSearchParams(location.search);
  const tagFromURL = queryParams.get("tag") || "all";
  const FLASK_API = "http://localhost:8000";
  const { categoryId } = useParams();
  const [topCategories, setTopCategories] = useState([]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredTalks, setFilteredTalks] = useState([]);
  const [featuredTalk, setFeaturedTalk] = useState(null);
  const [animatedTalks, setAnimatedTalks] = useState([]);
  const [visibleTalks, setVisibleTalks] = useState(6); // Initial number of talks to show
  const titleRef = useRef(null);

  // Format Duration (seconds → MM:SS)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Format View Count (e.g., 1.5M, 120K)
  const formatViews = (views) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
    if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
    return views;
  };

  

  // Fetch TED Talks by Topic
  useEffect(() => {
    axios.get(`http://localhost:8000/api/talks_by_topic?topic=${activeCategory}`)
      .then((res) => setFilteredTalks(res.data))
      .catch((err) => console.error("API Error:", err));
  }, [activeCategory]);

  // Fetch Featured Talk when "All" is selected
  useEffect(() => {
    if (activeCategory === "all") {
      axios.get("http://localhost:8000/api/featured_talk")
        .then((res) => setFeaturedTalk(res.data))
        .catch((err) => console.error("API Error:", err));
    }
  }, [activeCategory]);

    // Fetch Top Categories
    useEffect(() => {
      axios.get("http://localhost:8000/api/top_topics")
        .then((res) => setTopCategories(res.data.top_topics))
        .catch((err) => console.error("API Error:", err));
    }, []);

    useEffect(() => {
      setActiveCategory(tagFromURL); // Update state when category changes
  
      axios.get(`${FLASK_API}/talks_by_topic?topic=${selectedCategory}`)
        .then((res) => setFilteredTalks(res.data))
        .catch((err) => console.error("API Error:", err));
    }, [tagFromURL]);

  // Apply animation delay to talks
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedTalks(filteredTalks);
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredTalks]);

  // Handle "View More" button click
  const handleViewMore = () => {
    setVisibleTalks((prev) => prev + 6); // Show 6 more talks each time
  };

  
  useEffect(() => {
    // Stagger animation for talk cards
    const timer = setTimeout(() => {
      setAnimatedTalks(filteredTalks);
    }, 100);
    
    // Animation for section reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px 50px 0px"
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
    setAnimatedTalks([]);
    setVisibleTalks(6); // Reset visible talks when changing category
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
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'category-active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Topics
            </button>
            {topCategories.map((category, index) => (
              <button 
                key={index}
                style={{textTransform:"capitalize"}}
                className={`category-btn ${activeCategory === category ? 'category-active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        
         {/* Featured Section */}
         {activeCategory === 'all' && featuredTalk && (
          <section className="category-featured-section category-animate-section">
            <div className="category-section-content">
              <h2>Featured Talks</h2>
              <div className="category-featured-talk">
                <div className="category-featured-talk-content">
                  <div className="category-featured-talk-info">
                    <span className="category-talk-category">{featuredTalk.talks__tags[0]}</span>
                    <h3>{featuredTalk.talk__name}</h3>
                    <p className="category-talk-speaker">{featuredTalk.speaker__name}</p>
                    <p className="category-talk-description">{featuredTalk.talk__description}</p>
                    <div className="category-talk-meta">
                      <span className="category-talk-duration">{formatDuration(featuredTalk.duration)}</span>
                      <span className="category-talk-views">{formatViews(featuredTalk.view_count)} views</span>
                    </div>
                    <Link 
                      to={`/video/${featuredTalk.talk__id}`} // Use React Router's Link
                
                      style={{ textDecoration: "none" }}
                    >
                    <button className="category-watch-btn">
                      Watch Now
                    </button>
                    </Link>
                  </div>
                  <div className="category-featured-talk-image">
                    <img src={featuredTalk.url__photo__talk || i1} alt="Featured TED Talk" />
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
            <h2 style={{textTransform:"capitalize"}}>{activeCategory === 'all' ? 'All Talks' : `${activeCategory} Talks`}</h2>

            {filteredTalks.length === 0 && (
              <div className="category-no-talks">
                <p>No talks found in this category. Check back soon for new content!</p>
              </div>
            )}

            <div className="category-talks-grid">
              {animatedTalks.slice(0, visibleTalks).map((talk, index) => (
                 <Link 
                 to={`/video/${talk.talk__id}`} // Use React Router's Link
                 key={index} 
                 style={{ textDecoration: "none" }}
               >
                {/* <a href={talk.url__video} target="_self" rel="noopener noreferrer" key={talk.talk__name} style={{textDecoration:"none"}}> */}
                  <div className="explore-editor-pick-card">
                    <div className="explore-thumbnail-container large">
                      <img src={talk.url__photo__talk || i2} alt={talk.talk__name} className="explore-talk-thumbnail" />
                      <div className="explore-play-overlay">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <div className="explore-duration-badge">{formatDuration(talk.duration)}</div>
                    </div>
                    <div className="explore-editor-pick-info">
                      <h3 className="explore-talk-title">{talk.talk__name}</h3>
                      <p className="explore-talk-speaker">{talk.speaker__name}</p>
                      <p className="explore-talk-description">{talk.talk__description}</p>
                      {/* <div className="explore-talk-tags">
                        {[activeCategory, ...talk.talks__tags.slice(0, 2)].map((tag, index) => (
                          <span key={index} className="category-talk-category-badge">{tag}</span>
                        ))}
                      </div> */}
                      <div className="explore-talk-tags">
                                {Array.isArray(talk.talks__tags) ? (
                                // Ensure the selected topic is always displayed, but exclude "all"
                                [...new Set([activeCategory !== "all" ? activeCategory : null, ...talk.talks__tags])]
                                    .filter(tag => tag !== null)  // Remove `null` values
                                    .slice(0, 3)
                                    .map((tag, index) => (
                                        <span 
                                            key={index} 
                                            className={`category-talk-category-badge ${tag === activeCategory ? "explore-active-tag" : ""}`}
                                        >
                                            {tag}
                                        </span>
                                    ))
                            ) : (
                                <span className="category-talk-category-badge">No Tags</span>
                            )}

                                </div>
                      <span className="explore-views-count">{formatViews(talk.view_count)} views</span>
                    </div>
                  </div>
                {/* </a> */}
                </Link>
              ))}
            </div>

            {visibleTalks < filteredTalks.length && (
              <div className="category-load-more">
                <button className="category-load-more-btn" onClick={handleViewMore}>View More</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryPage;
