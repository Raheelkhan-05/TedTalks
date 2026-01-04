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

    const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";
    
    useEffect(() => {
        axios.get(`${BACKEND_API}/api/trendinghome`)
            .then((res) => {
                console.log("API Response:", res.data);
                setTrendingTalks(res.data.talks || []);
            })
            .catch((err) => console.error("API Error:", err));
    }, []);

    return (
        <section className="trending-section tos-animate-section">
        <div className="section-header">
            <h2>Trending Talks</h2>
            <p>Discover the most influential ideas spreading globally</p>
        </div>
        <div className="trending-cards">
  {trendingTalks.map((talk, index) => (
    <Link 
      to={`/video/${talk.talk__id}`} // Use React Router's Link
      key={index} 
      style={{ textDecoration: "none" }}
    >
      <div className="talk-card">
        <span className="talk-time">{formatDuration(talk.duration)}</span>
        <img 
          src={talk.url__photo__talk} 
          height={400} 
          width={300} 
          alt={talk.talk__name} 
        />
        <div className="play-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="talk-info">
          <h3>{talk.talk__name}</h3>
          <p>{talk.speaker__name}</p>
        </div>
      </div>
    </Link>
  ))}
</div>
    </section>
    );
};

export default TrendingSection;
