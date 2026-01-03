import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import requests, { POSTER_BASE_URL } from '../api/tmdb';
import './Search.css';

const Search = ({ onPlay, onDetail }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const resp = await axios.get(requests.fetchSearch(query));
                // Filter only movies and tv shows, and ensure they have images
                const filteredResults = resp.data.results
                    .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
                    .map(item => ({
                        id: item.id,
                        title: item.title || item.name,
                        image: `${POSTER_BASE_URL}${item.poster_path}`,
                        rating: item.vote_average,
                        year: (item.release_date || item.first_air_date) ? new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
                        isTv: item.media_type === 'tv'
                    }));
                setResults(filteredResults);
            } catch (error) {
                console.error("Search error:", error);
            }
            setLoading(false);
        };

        const timer = setTimeout(() => {
            fetchResults();
        }, 500); // 500ms debounce for smoother typing

        return () => clearTimeout(timer);
    }, [query]);

    if (loading) {
        return (
            <div className="search-page-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="search-page-wrapper">
            <div className="container search-container">
                <header className="search-header">
                    <h1 className="search-results-title">
                        {query ? `Results for "${query}"` : "Search for movies or shows"}
                    </h1>
                    <p className="results-count">{results.length} results found</p>
                </header>

                {results.length > 0 ? (
                    <div className="search-grid">
                        {results.map(item => (
                            <MovieCard
                                key={item.id}
                                movie={item}
                                onPlay={(id, title) => onPlay(id, title, item.isTv, true)}
                                onDetail={onDetail}
                            />
                        ))}
                    </div>
                ) : query && (
                    <div className="no-results">
                        <h2>No matches found for "{query}"</h2>
                        <p>Try different keywords or browse our categories.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
