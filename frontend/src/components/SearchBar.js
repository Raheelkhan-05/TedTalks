import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [inputQuery, setInputQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (inputQuery.trim()) {
            navigate(`/search-results?query=${encodeURIComponent(inputQuery)}`);
        }
    };

    return (
        <div className="sr-search-bar-container">
            <input
                type="text"
                placeholder="Search for inspiring TED Talks..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Explore Now</button>
        </div>
    );
};

export default SearchBar;