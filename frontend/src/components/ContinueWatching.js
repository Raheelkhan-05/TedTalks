import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./Pages/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import axios from "axios";

// Format seconds to MM:SS
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
};

// Format views count
const formatViews = (views) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
    if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
    return views;
};

// Shorten description to 15 words
const shortenDescription = (desc) => {
    if (!desc) return "";
    const words = desc.split(" ");
    return words.length > 15 ? words.slice(0, 15).join(" ") + "..." : desc;
};

const ContinueWatching = () => {
    const [user] = useAuthState(auth);
    const [continueWatching, setContinueWatching] = useState([]);

    const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

    useEffect(() => {
        if (!user) return;

        const fetchContinueWatching = async () => {
            try {
                const userEmail = user.email.replace(/\./g, "_");
                console.log("Fetching history for user:", userEmail);

                const historyRef = collection(db, `users/${userEmail}/history`);
                const historySnapshot = await getDocs(historyRef);

                if (historySnapshot.empty) {
                    console.log("No watch history found.");
                    return;
                }

                const { data } = await axios.get(`${BACKEND_API}/api/all_talks`);
                const allTalks = data.talks || [];

                console.log("Fetched TED Talks:", allTalks.length);

                let watchingList = historySnapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        const talk = allTalks.find((t) => String(t.talk__id) === String(data.talkId));

                        if (!talk) {
                            console.warn(`⚠️ Talk ID ${data.talkId} not found in API.`);
                            return null;
                        }

                        if (data.watchedDuration < 0.9 * talk.duration) {
                            return {
                                ...talk,
                                progress: (data.watchedDuration / talk.duration) * 100,
                                lastUpdated: data.lastUpdated, // Timestamp when the user last watched
                            };
                        }

                        return null;
                    })
                    .filter(Boolean); // Remove null values

                // 🔥 Sort by latest watched timestamp (most recent first)
                watchingList.sort((a, b) => b.lastUpdated - a.lastUpdated);

                console.log("Sorted Continue Watching List:", watchingList);
                setContinueWatching(watchingList);
            } catch (error) {
                console.error("Error fetching watch history:", error);
            }
        };

        fetchContinueWatching();
    }, [user]);

    return (
        <section className="explore-explore-section explore-continue-watching-section explore-animate-section">
        {continueWatching.length > 0 && (
            <>
            <div className="explore-section-header">
                <h2>Continue Watching</h2>
                <a href="#" className="explore-view-all">View All</a>
            </div>
            
            <div className="explore-talks-grid">
                {continueWatching.map((talk, index) => (
                    <Link 
                        to={`/video/${talk.talk__id}`} 
                        key={index} 
                        style={{ textDecoration: "none" }}
                    >
                        <div className="explore-talk-card" style={{ height: "320px" }}>
                            <div className="explore-thumbnail-container">
                                <img 
                                    src={talk.url__photo__talk} 
                                    alt={talk.talk__title} 
                                    className="explore-talk-thumbnail" 
                                    style={{ width: "320px", height: "180px" }}
                                />
                                <div className="explore-play-overlay">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div className="explore-duration-badge">{formatDuration(talk.duration)}</div>
                                <div className="explore-progress-container">
                                    <div className="explore-progress-bar" style={{ width: `${talk.progress}%` }}></div>
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
                            <div className="explore-talk-hover-preview" style={{ paddingTop: "10px" }}>
                                <h4>Description</h4>
                                <p>{shortenDescription(talk.talk__description)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            </>
        )}
        </section>
    );
};

export default ContinueWatching;
