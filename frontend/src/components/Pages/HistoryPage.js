import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
} from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/HistoryPage.css"; // Import the new CSS file

const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
};

const formatViews = (views) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
    if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
    return views;
};

const shortenDescription = (desc) => {
    if (!desc) return "";
    const words = desc.split(" ");
    return words.length > 15 ? words.slice(0, 15).join(" ") + "..." : desc;
};

const HistoryPage = () => {
    const [user] = useAuthState(auth);
    const [historyTalks, setHistoryTalks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userEmail = user.email.replace(/\./g, "_");
                const historyRef = collection(db, `users/${userEmail}/history`);
                const historySnapshot = await getDocs(historyRef);

                const watchedTalkIds = historySnapshot.docs.map((doc) => doc.id);
                console.log("Fetched watched talk IDs:", watchedTalkIds);
                const { data } = await axios.get(`${BACKEND_API}/api/all_talks`);
                const allTalks = data.talks || [];

                const filteredTalks = allTalks.filter((talk) =>
                    watchedTalkIds.includes(talk.talk__id.toString())
                );
                
                console.log("Filtered talks:", filteredTalks);

                setHistoryTalks(filteredTalks);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching history:", error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, navigate]);

    // Animation observer
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hist-section-visible');
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [loading]);

    const handleRemove = async (talkId) => {
        try {
            const userEmail = user.email.replace(/\./g, "_");
            console.log("Removing talk ID:", talkId);
            console.log("Document path:", `users/${userEmail}/history/${talkId.toString()}`);

            await deleteDoc(doc(db, `users/${userEmail}/history`, talkId.toString()));
            setHistoryTalks((prev) => prev.filter((talk) => talk.talk__id.toString() !== talkId.toString()));
        } catch (error) {
            console.error("Error removing talk from history:", error);
        }
    };

    if (loading) {
        return (
            <div className="hist-loading">
                <div className="hist-loading-spinner"></div>
                <p>Loading your history...</p>
            </div>
        );
    }

    return (
        <>{/* Decorative elements */}
        <div className="hist-accent hist-accent-1"></div>
        <div className="hist-accent hist-accent-2"></div>
        
        <div className="hist-container">
            
            {/* Header */}
            <div className="hist-header">
                <h1 className="hist-title">
                    Watch <span className="hist-highlight">History</span>
                </h1>
                <div className="hist-title-underline"></div>
            </div>
            
            {/* Content */}
            <div className="hist-section" ref={sectionRef}>
                {historyTalks.length === 0 ? (
                    <div className="hist-empty-state">
                        <div className="hist-empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="hist-empty-text">No History Found</h2>
                        <p className="hist-empty-subtext">
                            Start watching TED Talks to see them appear in your history.
                        </p>
                    </div>
                ) : (
                    <div className="hist-grid">
                        {historyTalks.map((talk) => (
                            <div key={talk.talk__id} className="hist-card">
                                <div style={{ overflow: 'hidden' }}>
                                    <img
                                        src={talk.url__photo__talk}
                                        alt={talk.talk__name}
                                        className="hist-card-image"
                                    />
                                </div>
                                <div className="hist-card-content">
                                    <h2 className="hist-card-title">{talk.talk__name}</h2>
                                    <p className="hist-card-description">
                                        {shortenDescription(talk.talk__description)}
                                    </p>
                                    <div className="hist-card-meta">
                                        <div className="hist-card-duration">
                                            <span className="hist-card-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                            </span>
                                            {formatDuration(talk.duration)}
                                        </div>
                                        <div className="hist-card-views">
                                            <span className="hist-card-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </span>
                                            {formatViews(talk.view_count)} views
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(talk.talk__id)}
                                        className="hist-remove-btn"
                                    >
                                        <span className="hist-remove-btn-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                            </svg>
                                        </span>
                                        Remove from History
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default HistoryPage;