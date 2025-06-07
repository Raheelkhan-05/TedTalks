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

const EditorsPicks = () => {
    const [editorsPicks, setEditorsPicks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/editors_picks")
            .then((res) => setEditorsPicks(res.data))
            .catch((err) => console.error("API Error:", err));
    }, []);

    return (
        <section className="explore-explore-section explore-editors-picks-section explore-animate-section">
            <div className="explore-section-header">
                <h2>Editor's Picks</h2>
                <a href="#" className="explore-view-all">View All</a>
            </div>
            <div className="explore-editors-grid">
                {Array.isArray(editorsPicks) && editorsPicks.length > 0 ? (
                    editorsPicks.map((talk, index) => (
                        <Link 
                        to={`/video/${talk.talk__id}`} // Use React Router's Link
                        key={index} 
                        style={{ textDecoration: "none" }}
                      >
                        {/* <a href={talk.url__video} target="_self" rel="noopener noreferrer" key={talk.talk__name} style={{textDecoration:"none"}}> */}
                        <div className="explore-editor-pick-card" key={talk.talk__name}>
                            <div className="explore-editor-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                Editor's Pick
                            </div>
                            <div className="explore-thumbnail-container large">
                                <img src={talk.url__photo__talk} alt={talk.talk__name} className="explore-talk-thumbnail" />
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
                                <div className="explore-talk-tags">
                                    {Array.isArray(talk.talks__tags) ? (
                                        talk.talks__tags.slice(0, 4).map((tag, index) => (
                                            <span key={index} className="category-talk-category-badge">{tag}</span>
                                        ))
                                    ) : (
                                        <span className="category-talk-category-badge">No Tags</span>
                                    )}
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
                        </div>
                        {/* </a> */}
                        </Link>
                    ))
                ) : (
                    <p>Loading editor's picks...</p>
                )}
            </div>
        </section>
    );
};

export default EditorsPicks;
