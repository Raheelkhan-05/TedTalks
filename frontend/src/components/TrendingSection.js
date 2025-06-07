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

// Function to shorten description (30 words + "...")
const shortenDescription = (desc) => {
    if (!desc) return "";
    const words = desc.split(" ");
    return words.length > 15 ? words.slice(0,15).join(" ") + "..." : desc;
};

const TrendingSection = () => {
    const [trendingTalks, setTrendingTalks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/trending")
            .then((res) => {
                console.log("API Response:", res.data);
                setTrendingTalks(res.data.talks || []);
            })
            .catch((err) => console.error("API Error:", err));
    }, []);

    return (
        <section className="explore-explore-section explore-trending-section explore-animate-section">
            <div className="explore-section-header">
                <h2>Trending Now</h2>
                <a href="#" className="explore-view-all">View All</a>
            </div>
            <div className="explore-talks-grid">
                {trendingTalks.map((talk, index) => (
                     <Link 
                     to={`/video/${talk.talk__id}`} // Use React Router's Link
                     key={index} 
                     style={{ textDecoration: "none" }}
                   >
                    {/* <a href={talk.url__video} target="_self" rel="noopener noreferrer" key={talk.talk__name} style={{textDecoration:"none"}}> */}
                        <div className="explore-talk-card" style={{height:"320px"}}>
                            <div className="explore-thumbnail-container">
                                <img src={talk.url__photo__talk} alt={talk.talk__title} className="explore-talk-thumbnail" style={{width:"320px", height:"180px"}}/>
                                <div className="explore-play-overlay">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div className="explore-duration-badge">{formatDuration(talk.duration)}</div>
                                <div className="explore-trending-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                        <polyline points="17 6 23 6 23 12"></polyline>
                                    </svg>
                                    Trending
                                </div>
                            </div>
                            <div className="explore-talk-info">
                                <h3 className="explore-talk-title">{talk.talk__name}</h3>
                                <p className="explore-talk-speaker">{talk.speaker__name}</p>
                                <div className="explore-talk-tags">
                                    {talk.tags?.map((tag, index) => (
                                        <span key={index} className="category-talk-category-badge">{tag}</span>
                                    ))}
                                </div>
                                <div className="explore-tag-views">
                                    <span className="explore-views-count">{formatViews(talk.view_count)} views</span>
                                    <button className="explore-bookmark-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="explore-talk-hover-preview" style={{paddingTop:"10px"}}>
                                <h4>Description</h4>
                                <p>{shortenDescription(talk.talk__description)}</p>
                            </div>
                        </div>
                    {/* </a> */}
                </Link>
                ))}
            </div>
        </section>
    );
};

export default TrendingSection;
