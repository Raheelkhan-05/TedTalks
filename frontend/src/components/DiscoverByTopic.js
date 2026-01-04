import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Function to convert seconds to MM:SS format
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
};

// Function to format view count (e.g., 1.5M, 120K)
const formatViews = (views) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
    if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
    return views;
};

const DiscoverByTopic = () => {
    const [topCategories, setTopCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [talks, setTalks] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

    // Fetch top topics & all topics
    useEffect(() => {
        axios.get(`${BACKEND_API}/api/top_topics`)
            .then((res) => {
                setTopCategories(res.data.top_topics);
                setAllCategories(res.data.all_topics);
            })
            .catch((err) => console.error("API Error:", err));
    }, []);

    // Fetch talks by topic
    useEffect(() => {
        axios.get(`${BACKEND_API}/api/talks_by_topic?topic=${activeCategory}`)
            .then((res) => setTalks(res.data))
            .catch((err) => console.error("API Error:", err));
    }, [activeCategory]);

    return (
        <section className="explore-explore-section explore-categories-section explore-animate-section">
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
                {(showAll ? allCategories : topCategories).map((category, index) => (
                    <button 
                        key={index}
                        className={`explore-category-button ${activeCategory === category ? 'explore-active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="explore-talks-grid category-talks-grid">
                {Array.isArray(talks) && talks.length > 0 ? (
                    talks.slice(0, 6).map((talk, index) => (
                        <Link 
                        to={`/video/${talk.talk__id}`} // Use React Router's Link
                        key={index} 
                        style={{ textDecoration: "none" }}
                      >
                        {/* <a href={talk.url__video} target="_self" rel="noopener noreferrer" key={talk.talk__name} style={{textDecoration:"none"}}> */}
                        <div className="explore-talk-card" key={talk.talk__id}>
                            <div className="explore-thumbnail-container">
                                <img src={talk.url__photo__talk} alt={talk.talk__name} className="explore-talk-thumbnail" />
                                <div className="explore-play-overlay">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div className="explore-duration-badge">{formatDuration(talk.duration)}</div>
                            </div>
                            <div className="explore-talk-info">
                                <h3 className="explore-talk-title">{talk.talk__name}</h3>
                                <p className="explore-talk-speaker">{talk.speaker__name}</p>
                                <div className="explore-talk-tags">
                                {Array.isArray(talk.talks__tags) ? (
                                // Ensure the selected topic is always displayed, but exclude "all"
                                [...new Set([activeCategory !== "all" ? activeCategory : null, ...talk.talks__tags])]
                                    .filter(tag => tag !== null)  // Remove `null` values
                                    .slice(0, 4)
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
                                <div className="explore-tag-views">
                                    <span className="explore-views-count">{formatViews(talk.view_count)} views</span>
                                </div>
                            </div>
                        </div>
                        {/* </a> */}
                    </Link>
                    ))
                ) : (
                    <p>Loading talks...</p>
                )}
            </div>
        </section>
    );
};

export default DiscoverByTopic;
