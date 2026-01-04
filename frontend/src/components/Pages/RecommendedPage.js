import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/HistoryPage.css"; // Make sure this import exists or create a shared loading style

const RecommendedPage = () => {
    const [user, userLoading] = useAuthState(auth); // Get loading state from useAuthState
    const [recommendedTalks, setRecommendedTalks] = useState([]);
    const [visibleTalks, setVisibleTalks] = useState(8);
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingState, setLoadingState] = useState({
        user: true,          // Initially true, will be updated by useAuthState
        history: false,      // Will be true when checking history
        recommendations: false // Will be true when fetching recommendations
    });
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

    const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

    // Show loading message based on current loading state
    const getLoadingMessage = () => {
        if (loadingState.user) return "Verifying your account...";
        if (loadingState.history) return "Checking your watch history...";
        if (loadingState.recommendations) return "Finding recommendations for you...";
        return "Loading...";
    };
    
    // Update user loading state when useAuthState updates
    useEffect(() => {
        setLoadingState(prev => ({ ...prev, user: userLoading }));
    }, [userLoading]);
    
    useEffect(() => {
        // If location already has recommendations data
        if (location.state && location.state.recommendedTalks) {
            setRecommendedTalks(location.state.recommendedTalks);
            setLoadingState({ user: false, history: false, recommendations: false });
            return;
        }
        
        // Skip if still loading user
        if (loadingState.user) return;
        
        // If user doesn't exist, navigate to home
        if (!user) {
            navigate("/");
            return;
        }

        const fetchRecommendations = async () => {
            try {
                // Set history loading state
                setLoadingState(prev => ({ ...prev, history: true }));
                
                const userEmail = user.email.replace(/\./g, "_");
                console.log("📜 Fetching watched history for:", userEmail);

                const historyRef = collection(db, `users/${userEmail}/history`);
                const historySnapshot = await getDocs(historyRef);

                // Reset history loading state
                setLoadingState(prev => ({ ...prev, history: false }));

                if (historySnapshot.empty) {
                    console.warn("📭 No watch history found.");
                    navigate("/");
                    return;
                }

                const watchedTalks = historySnapshot.docs.map(doc => doc.data().talkId);
                console.log("✅ Watched Talks IDs:", watchedTalks);

                if (watchedTalks.length === 0) {
                    console.warn("❌ No watched talks available.");
                    navigate("/");
                    return;
                }

                // Set recommendations loading state
                setLoadingState(prev => ({ ...prev, recommendations: true }));

                const { data } = await axios.post(`${BACKEND_API}/api/recommendations`, {
                    watched_talks: watchedTalks
                });

                console.log("🎯 API Response:", data);

                setRecommendedTalks(data.talks || []);
                
                // Reset recommendations loading state
                setLoadingState(prev => ({ ...prev, recommendations: false }));
            } catch (error) {
                console.error("⚠️ Error fetching recommendations:", error);
                // Reset all loading states on error
                setLoadingState({ user: false, history: false, recommendations: false });
                navigate("/");
            }
        };

        fetchRecommendations();
    }, [user, location.state, navigate, loadingState.user]);

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
    
        const isLoading = loadingState.user || loadingState.history || loadingState.recommendations;
        
        if (!isLoading) {
            const sections = document.querySelectorAll(".explore-animate-section");
            sections.forEach((section) => observer.observe(section));
        
            return () => {
                sections.forEach((section) => observer.unobserve(section));
            };
        }
    }, [recommendedTalks, loadingState]);
    
    const formatViews = (views) => {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
        if (views >= 1000) return (views / 1000).toFixed(1) + "K";
        return views;
    };

    const loadMoreTalks = () => {
        setIsLoadMoreLoading(true);
        // Simulate network delay for smoother UX
        setTimeout(() => {
            setVisibleTalks(prevCount => prevCount + 8);
            setIsLoadMoreLoading(false);
        }, 500);
    };

    const goBack = () => {
        navigate(-1);
    };

    // Check if any loading state is active
    const isLoading = loadingState.user || loadingState.history || loadingState.recommendations;

    // Show loading spinner when any loading state is active
    if (isLoading) {
        return (
            <div className="hist-loading">
                <div className="hist-loading-spinner"></div>
                <p>{getLoadingMessage()}</p>
            </div>
        );
    }
    
    return (
        <div className="explore-explore-container">
            <div className="explore-explore-header">
                <h1 className="explore-explore-title">
                    <span className="explore-highlight">Recommended</span> For You
                </h1>
                <div className="explore-title-underline"></div>
                <p className="explore-explore-subtitle">Personalized content based on your viewing history</p>
            </div>
        
            <div className="explore-back-button" onClick={goBack} style={{cursor: "pointer", marginBottom: "20px", marginLeft: "20px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span style={{marginLeft: "8px"}}>Back</span>
            </div>
            
            <section className="explore-explore-section explore-animate-section">
                <div className="explore-talks-grid" style={{padding:"20px"}}>
                    {recommendedTalks.slice(0, visibleTalks).map((talk, index) => (
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
                
                {visibleTalks < recommendedTalks.length && (
                    <div className="category-load-more">
                        <button 
                            onClick={loadMoreTalks}
                            className={`category-load-more-btn load-more-btn ${isLoadMoreLoading ? 'loading' : ''}`}
                            disabled={isLoadMoreLoading}
                        >
                            {isLoadMoreLoading ? 'Loading...' : 'View More'}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default RecommendedPage;