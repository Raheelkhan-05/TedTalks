import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Function to convert seconds to MM:SS format
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
};

const RandomTalk = () => {
    const [randomTalk, setRandomTalk] = useState(null);
    const [loading, setLoading] = useState(false);

    const getRandomTalk = () => {
        setLoading(true);
        axios.get("http://localhost:8000/api/random_talk")
            .then((res) => {
                setRandomTalk(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("API Error:", err);
                setLoading(false);
            });
    };

    return (
        <div className="explore-section-column surprise-column">
            <div className="explore-section-header">
                <h2>Feeling Adventurous?</h2>
            </div>
            <div className="explore-surprise-container">
                <button className="explore-surprise-btn" onClick={getRandomTalk} disabled={loading}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    {loading ? "Loading..." : "Surprise Me!"}
                </button>
                
                {randomTalk && (
                    
                    <div className="explore-random-talk-result">
                        <div className="explore-random-thumbnail">
                            <img src={randomTalk.url__photo__talk} alt={randomTalk.talk__name} />
                            <div className="explore-play-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            </div>
                            <div className="explore-duration-badge">{formatDuration(randomTalk.duration)}</div>
                        </div>
                        <div className="explore-random-info">
                            <h3>{randomTalk.talk__name}</h3>
                            <p>{randomTalk.speaker__name}</p>
                            <p className="explore-random-description">{randomTalk.talk__description}</p>
                            <div className="explore-random-actions">
                            <Link 
      to={`/video/${randomTalk.talk__id}`} // Use React Router's Link
      style={{ textDecoration: "none" }}
    >
                            {/* <a href={randomTalk.url__video} target="_self" rel="noopener noreferrer" key={randomTalk.talk__name} style={{textDecoration:"none"}}> */}
                                    <button className="explore-watch-now-btn">Watch Now</button>
                                {/* </a> */}
                                </Link>
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
        </div>
    );
};

export default RandomTalk;
