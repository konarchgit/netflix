
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import requests, { POSTER_BASE_URL, IMAGE_BASE_URL } from '../api/tmdb';
import Hero from './Hero';
import MovieCard from './MovieCard';
import './Movies.css';

const Movies = ({ onPlay, onDetail }) => {
    const [movies, setMovies] = useState([]);
    const [heroMovie, setHeroMovie] = useState(null);
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [languages, setLanguages] = useState([
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ta', name: 'Tamil' },
        { code: 'te', name: 'Telugu' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'kn', name: 'Kannada' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
    ]);

    // Filters
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default english

    // Infinite Scroll Observer
    const loaderRef = useRef(null);

    // Fetch initial data (Genres) & Detect Country
    useEffect(() => {
        async function fetchInitial() {
            try {
                // Fetch Genres
                const genreResp = await axios.get(requests.fetchGenres);
                setGenres(genreResp.data.genres);

                // Detect User Country & Set Default Language
                try {
                    // Try ipapi.co first
                    // If blocked/fails, we could try another, but let's swap to ipwho.is for better CORS support on free tier
                    const ipResp = await axios.get('https://ipwho.is/');
                    // ipwho.is returns success: true/false and country_code
                    if (!ipResp.data.success) {
                        throw new Error("Geo-IP failed: " + ipResp.data.message);
                    }
                    const countryCode = ipResp.data.country_code;

                    const countryToLang = {
                        'IN': 'hi', // India -> Hindi
                        'US': 'en',
                        'GB': 'en',
                        'KR': 'ko',
                        'JP': 'ja',
                        'FR': 'fr',
                        'ES': 'es',
                        'DE': 'de',
                        'IT': 'it',
                        'RU': 'ru',
                        'CN': 'zh',
                    };

                    const detectedLang = countryToLang[countryCode] || 'en';
                    setSelectedLanguage(detectedLang);

                    // Sort Languages: Region -> English -> Rest
                    setLanguages(prev => {
                        const list = [...prev];
                        const regionObj = list.find(l => l.code === detectedLang);
                        const enObj = list.find(l => l.code === 'en');
                        const others = list.filter(l => l.code !== detectedLang && l.code !== 'en');

                        const sorted = [];
                        if (regionObj) sorted.push(regionObj);
                        if (enObj && enObj !== regionObj) sorted.push(enObj);
                        return [...sorted, ...others];
                    });
                } catch (geoError) {
                    console.error("Geo-detection failed, defaulting to English:", geoError);
                    setSelectedLanguage('en');
                }

            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        }
        fetchInitial();
    }, []);

    // Main Fetch Logic
    const fetchMovies = useCallback(async (lang, genreId, pageNum) => {
        if (isLoading) return;
        setIsLoading(true);

        let url = '';
        if (genreId) {
            if (lang) {
                url = `${requests.fetchMoviesByGenre(genreId, pageNum)}&with_original_language=${lang}`;
            } else {
                url = requests.fetchMoviesByGenre(genreId, pageNum);
            }
        } else {
            url = requests.fetchMoviesByLanguage(lang, pageNum);
        }

        try {
            const response = await axios.get(url);
            const newMovies = response.data.results.map(m => ({
                id: m.id,
                title: m.title || m.name,
                overview: m.overview,
                image: `${POSTER_BASE_URL}${m.poster_path}`,
                // For Hero:
                backdrop: `${IMAGE_BASE_URL}${m.backdrop_path}`,
                rating: m.vote_average,
                year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A',
                isTv: m.media_type === 'tv'
            }));

            if (pageNum === 1) {
                setMovies(newMovies);
                // Update Hero with the top result of the new filter
                if (newMovies.length > 0) {
                    const topMovie = newMovies[0];
                    setHeroMovie({
                        id: topMovie.id,
                        title: topMovie.title,
                        overview: topMovie.overview,
                        image: topMovie.backdrop, // Use backdrop for Hero
                        rating: topMovie.rating,
                        year: topMovie.year,
                        isTv: topMovie.isTv
                    });
                }
            } else {
                setMovies(prev => [...prev, ...newMovies]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Removed isLoading dependency here to allow fresh calls from effects

    // Trigger fetch on filter change
    useEffect(() => {
        setPage(1); // Reset page
        // We call direct fetch here for page 1 to ensure immediate update and avoid stale closures
        // passing pageNum 1 explicitly
        fetchMovies(selectedLanguage, selectedGenre, 1);
    }, [selectedLanguage, selectedGenre]);


    // Infinite Scroll Effect
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !isLoading) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchMovies(selectedLanguage, selectedGenre, nextPage);
                    return nextPage;
                });
            }
        }, { threshold: 0.5 });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [isLoading, selectedLanguage, selectedGenre, fetchMovies]);

    // Handlers
    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };



    return (
        <div className="movies-page">
            {heroMovie && (
                <Hero
                    movies={[heroMovie]}
                    onPlay={onPlay}
                    onDetail={onDetail}
                    showArrows={false}
                />
            )}

            <div className="movies-header-controls">
                <div className="movies-title-section">
                    <h1 className="page-title">Movies</h1>
                    <div className="movies-filters">
                        <select
                            className="filter-dropdown"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                        >
                            <option value="" disabled>Language</option>
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>

                        <select
                            className="filter-dropdown"
                            value={selectedGenre}
                            onChange={handleGenreChange}
                        >
                            <option value="">Genres</option>
                            {genres.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="container movies-grid-container">
                <div className="movie-grid">
                    {movies.map((movie, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={`${movie.id}-${index}`}
                        >
                            <MovieCard movie={movie} onPlay={onPlay} onDetail={onDetail} />
                        </motion.div>
                    ))}
                </div>

                {/* Infinite Scroll Loader Trigger */}
                <div ref={loaderRef} className="loading-trigger" style={{ height: '50px', textAlign: 'center', marginTop: '20px' }}>
                    {isLoading && <div className="loader small"></div>}
                </div>
            </div>
        </div>
    );
};

export default Movies;
