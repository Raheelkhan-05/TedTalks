import React, { useState, useEffect } from 'react';
import './styles/ViewAllSpeakers.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewAllSpeakers = () => {

  const [speakers, setSpeakers] = useState([]);
  const [visibleSpeakers, setVisibleSpeakers] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSpeakers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/speakers");
            setSpeakers(response.data.speakers);
        } catch (error) {
            console.error("Error fetching speakers:", error);
        }
    };
    fetchSpeakers();
}, []);

const loadMoreSpeakers = () => {
  setVisibleSpeakers((prev) => prev + 6);
};

const handlesearchs = (name) => {
  navigate(`/search-results?query=${encodeURIComponent(name)}`);
};
const handleSearch = () => {
  if (searchTerm.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
  }
};

const filteredSpeakers = speakers.filter((speaker) =>
  speaker.speaker__name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  speaker.speaker__who_he_is.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <>
    <div className="speakers-container">
            <div className="speakers-header">
                <h1 className="speakers-title">
                    Explore <span className="highlight">TED Speakers</span>
                </h1>
                <div className="title-underline"></div>
            </div>

            <div className="explore-search-container search-section">
                <input
                    type="text"
                    placeholder="Search speakers by name or domain"
                    className="speaker-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className='explore-search-button' onClick={handleSearch}><svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
            </div>

            <div className="speakers-grid">
                {filteredSpeakers.slice(0, visibleSpeakers).map((speaker, index) => (
                    <div key={index} className="speaker-card">
                        <div className="speaker-image-container">
                            <img
                                src={speaker.url__photo__speaker}
                                alt={speaker.speaker__name}
                                className="speaker-image"
                            />
                        </div>
                        <div className="speaker-details">
                            <h3>{speaker.speaker__name}</h3>
                            <p className="explore-speaker-specialty">{speaker.speaker__who_he_is}</p>
                            <p className="explore-talks-count">{speaker.speaker__description}</p>

                            <button className="view-talks-btn" onClick={() => handlesearchs(speaker.speaker__name)}>View Talks</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredSpeakers.length > visibleSpeakers && (
                <div className="category-load-more">
                    <button className="category-load-more-btn" onClick={loadMoreSpeakers}>
                        Load More
                    </button>
                </div>
            )}

            {filteredSpeakers.length === 0 && (
                <div className="no-results">
                    <p>No speakers found matching your search.</p>
                </div>
            )}
        </div>
    <div className="accent-shape shape1"></div>
    <div className="accent-shape shape2"></div>
    </>
  );
};

export default ViewAllSpeakers;