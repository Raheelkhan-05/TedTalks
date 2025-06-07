import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./Pages/firebase";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RecommendedSection = () => {
    const [user] = useAuthState(auth);
    const [recommendedTalks, setRecommendedTalks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔥 useEffect triggered!");

        if (!user) {
            console.warn("❌ User not logged in.");
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const userEmail = user.email.replace(/\./g, "_");
                console.log("📜 Fetching watched history for:", userEmail);

                const historyRef = collection(db, `users/${userEmail}/history`);
                const historySnapshot = await getDocs(historyRef);

                if (historySnapshot.empty) {
                    console.warn("📭 No watch history found.");
                    return;
                }

                const watchedTalks = historySnapshot.docs.map(doc => doc.data().talkId);
                console.log("✅ Watched Talks IDs:", watchedTalks);

                if (watchedTalks.length === 0) {
                    console.warn("❌ No watched talks available.");
                    return;
                }

                const { data } = await axios.post("http://localhost:8000/api/recommendations", {
                    watched_talks: watchedTalks
                });

                console.log("🎯 API Response:", data);

                setRecommendedTalks(data.talks || []);
            } catch (error) {
                console.error("⚠️ Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [user]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
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
    }, [recommendedTalks]);
    
    const formatViews = (views) => {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
        if (views >= 1000) return (views / 1000).toFixed(1) + "K";
        return views;
    };

    const handleViewAllClick = () => {
        navigate("/recommended", { state: { recommendedTalks } });
    };

    return (
        <>
            {(recommendedTalks.length === 0) ? 
                <section className="explore-animate-section explore-explore-section">
                    <div className="explore-section-header">
                        <h2>Recommended for You</h2>
                    </div>
                    <div>
                        <h3 style={{color:"lightgray", marginBottom:"50px"}}>Start Watching Ted Talks to Build Personalized Recommendations :-)</h3>
                    </div>
                </section>
                : 
                <></>
            }
            {user && recommendedTalks.length > 0 && (
                <section className="explore-explore-section explore-animate-section">
                    <div className="explore-section-header">
                        <h2>Recommended for You</h2>
                        <a onClick={handleViewAllClick} className="explore-view-all" style={{cursor: "pointer"}}>
                            View All
                        </a>
                    </div>
                    <div className="explore-talks-grid">
                        {recommendedTalks.slice(0, 8).map((talk, index) => (
                            <Link 
                                to={`/video/${talk.talk__id}`} 
                                key={index} 
                                style={{ textDecoration: "none" }}
                            >
                                <div className="explore-talk-card" key={talk.talk__id}>
                                    <div className="explore-thumbnail-container">
                                        <img 
                                            src={talk.url__photo__talk} 
                                            alt={talk.talk__name} 
                                            className="explore-talk-thumbnail"
                                        />
                                        <div className="explore-play-overlay">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                        </div>
                                        <div className="explore-duration-badge">
                                            {Math.floor(talk.duration / 60)}:{(talk.duration % 60).toString().padStart(2, "0")}
                                        </div>
                                    </div>
                                    <div className="explore-talk-info">
                                        <h3 className="explore-talk-title">{talk.talk__name}</h3>
                                        <p className="explore-talk-speaker">{talk.speaker__name}</p>
                
                                        <div className="tags-container">
                                            {Array.isArray(talk.talks__tags) && talk.talks__tags.length > 0 ? (
                                                talk.talks__tags
                                                    .filter(tag => tag !== null)
                                                    .map((tag, index) => (
                                                        <span key={index} className="category-talk-category-badge">
                                                            {tag}
                                                        </span>
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
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
};

export default RecommendedSection;