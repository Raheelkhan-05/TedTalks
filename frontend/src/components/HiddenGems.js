import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Function to format duration (seconds → MM:SS)
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

const HiddenGems = () => {
    const [hiddenGems, setHiddenGems] = useState([]);
    const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

    useEffect(() => {
        axios.get(`${BACKEND_API}/api/hidden_gems`)
            .then((res) => setHiddenGems(res.data))
            .catch((err) => console.error("API Error:", err));
    }, []);

    return (
        <div className="explore-section-column">
            <div className="explore-section-header">
                <h2>Hidden Gems</h2>
                <a href="#" className="explore-view-all">View All</a>
            </div>
            <div className="explore-vertical-talks-list">
                {Array.isArray(hiddenGems) && hiddenGems.length > 0 ? (
                    hiddenGems.map((talk, index) => (
                        <Link 
                        to={`/video/${talk.talk__id}`} // Use React Router's Link
                        key={index} 
                        style={{ textDecoration: "none" }}
                      >
                        {/* <a href={talk.url__video} target="_self" rel="noopener noreferrer" key={talk.talk__name} style={{textDecoration:"none"}}> */}
                        <div className="explore-vertical-talk-card" key={talk.talk__name}>
                            <div className="explore-vertical-thumbnail">
                                <img src={talk.url__photo__talk} alt={talk.talk__name} />
                                <div className="explore-play-overlay sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div className="explore-duration-badge">{formatDuration(talk.duration)}</div>
                            </div>
                            <div className="explore-vertical-info">
                                <h3>{talk.talk__name}</h3>
                                <p>{talk.speaker__name}</p>
                                <div className="explore-talk-tags sm">
                                    {Array.isArray(talk.talks__tags) ? (
                                        talk.talks__tags.slice(0, 4).map((tag, index) => (
                                            <span key={index} className="category-talk-category-badge">{tag}</span>
                                        ))
                                    ) : (
                                        <span className="category-talk-category-badge">No Tags</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* </a> */}
                        </Link>
                    ))
                ) : (
                    <p>Loading hidden gems...</p>
                )}
            </div>
        </div>
    );
};

export default HiddenGems;
