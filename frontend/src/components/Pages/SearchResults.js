import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./styles/SearchResults.css";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar";

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [results, setResults] = useState([]);
    const [correctedQuery, setCorrectedQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    
    const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";
    
    // New state for pagination
    const [visibleResults, setVisibleResults] = useState(10);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                // Clear previous results when starting a new search
                setResults([]);
                
                const response = await axios.get(`${BACKEND_API}/search?query=${encodeURIComponent(query)}`);
                if (response.data.results) {
                    setResults(response.data.results);
                    setCorrectedQuery(response.data.corrected_query || query);
                    setCount(response.data.count || response.data.results.length);
                    // Reset visible results to 10 for new searches
                    setVisibleResults(10);
                } else {
                    // Handle case when no results are found
                    setResults([]);
                    setCorrectedQuery(response.data.corrected_query || query);
                    setCount(0);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                // Clear results on error
                setResults([]);
                setCount(0);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]); // This ensures the effect runs when the query changes

    // Function to handle search from the results page
    const handleSearch = (newQuery) => {
        if (newQuery) {
            // Update search params which will trigger the useEffect
            setSearchParams({ query: newQuery });
        }
    };

    // Function to load more results
    const handleLoadMore = () => {
        setVisibleResults(prevVisible => prevVisible + 10);
    };

    // Function to truncate description to a certain length
    const truncateDescription = (description, maxLength = 200) => {
        if (!description) return "";
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + "...";
    };

    return (
        <>
        <div className="sr-results-container">
            <div className="sr-results-header">
                <h1 className="sr-results-title">
                    Search <span>Results</span>
                </h1>
                <div className="sr-title-underline"></div>
            </div>

            {/* Pass the handleSearch function to SearchBar */}
            <SearchBar onSearch={handleSearch} initialValue={query} />

            {loading ? (
                <div className="sr-loading">Loading results...</div>
            ) : (
                <>
                    {query && results.length > 0 && (
                        <div className="sr-results-counter">
                            Found <span>{count}</span> results for "{correctedQuery}"
                            
                        </div>
                    )}

                    {results.length === 0 ? (
                        <div className="sr-no-results">
                            <h3>No TED Talks found For "{query}"</h3>
                            <p>We couldn't find any talks matching your search. Try something else?</p>
                            <div className="sr-suggestions">
                                <h4>Popular searches:</h4>
                                <ul>
                                    <li onClick={() => handleSearch("Technology")}>Technology</li>
                                    <li onClick={() => handleSearch("Creativity")}>Creativity</li>
                                    <li onClick={() => handleSearch("Science")}>Science</li>
                                    <li onClick={() => handleSearch("Education")}>Education</li>
                                    <li onClick={() => handleSearch("Psychology")}>Psychology</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ul className="sr-results-list">
                                {results.slice(0, visibleResults).map((talk, index) => (
                                    <li key={index} className="sr-talk-item" >
                                        <img 
                                            className="sr-talk-thumbnail"
                                            src={talk.url__photo__talk} 
                                            alt={talk.talk__name} 
                                        />
                                        <div className="sr-talk-info">
                                            <h3>{talk.talk__name}</h3>
                                            <div className="sr-talk-meta">
                                                <div className="sr-talk-speaker">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                    {talk.speaker__name}
                                                </div>
                                                <div className="sr-talk-views">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                    {talk.view_count ? talk.view_count.toLocaleString() : 0} views
                                                </div>
                                            </div>
                                            <p className="sr-talk-description">
                                                {truncateDescription(talk.talk__description)}
                                            </p>
                                            <Link 
                                                className="sr-watch-button"
                                                to={`/video/${talk.talk__id}`}
                                                style={{ textDecoration: "none" }}
                                            >
                                                Watch Now
                                            </Link>
                                            {/* Horizontally Scrollable Tags */}
                                            <div className="sr-tags-container">
                                                {Array.isArray(talk.talks__tags) && talk.talks__tags.length > 0 ? (
                                                    talk.talks__tags
                                                        .filter(tag => tag !== null) // Remove `null` values
                                                        .map((tag, index) => (
                                                            <span 
                                                                key={index} 
                                                                className="sr-search-talk-category-badge"
                                                                onClick={() => handleSearch(tag)}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))
                                                ) : (
                                                    <span className="sr-category-talk-category-badge">No Tags</span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            
                            {/* "View More" button - only show if there are more results to load */}
                            {results.length > visibleResults && (
                                <div className="category-load-more">
                                    <button 
                                        className="category-load-more-btn" 
                                        onClick={handleLoadMore}
                                    >
                                        View More
                                    </button>
                                </div>

                            )}

                        </>
                    )}
                </>
            )}
        </div>
        
        {/* Decorative shapes */}
        <div className="sr-accent-shape sr-shape1"></div>
        <div className="sr-accent-shape sr-shape2"></div>
        </>
    );
};

export default SearchResults;