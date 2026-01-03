
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import requests, { POSTER_BASE_URL, IMAGE_BASE_URL } from '../api/tmdb';
import Hero from './Hero';
import MovieCard from './MovieCard';
import './TvShows.css';

const TvShows = ({ onPlay, onDetail }) => {
    const [shows, setShows] = useState([]);
    const [heroShow, setHeroShow] = useState(null);
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
                const genreResp = await axios.get(requests.fetchTvGenres);
                setGenres(genreResp.data.genres);

                // Detect User Country & Set Default Language
                try {
                    const ipResp = await axios.get('https://ipwho.is/');
                    if (!ipResp.data.success) {
                        throw new Error("Geo-IP failed: " + ipResp.data.message);
                    }
                    const countryCode = ipResp.data.country_code;

                    const countryToLang = {
                        'IN': 'hi',
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
    const fetchShows = useCallback(async (lang, genreId, pageNum) => {
        if (isLoading) return;
        setIsLoading(true);

        let url = '';
        if (genreId) {
            if (lang) {
                url = `${requests.fetchTvByGenre(genreId, pageNum)}&with_original_language=${lang}`;
            } else {
                url = requests.fetchTvByGenre(genreId, pageNum);
            }
        } else {
            url = requests.fetchTvByLanguage(lang, pageNum);
        }

        try {
            const response = await axios.get(url);
            const newShows = response.data.results.map(m => ({
                id: m.id,
                title: m.name || m.title,
                overview: m.overview,
                image: `${POSTER_BASE_URL}${m.poster_path}`,
                // For Hero:
                backdrop: `${IMAGE_BASE_URL}${m.backdrop_path}`,
                rating: m.vote_average,
                year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
                isTv: true // IMPORTANT: This is TV Shows page
            }));

            if (pageNum === 1) {
                setShows(newShows);


                if (newShows.length > 0) {
                    const topShow = newShows[0];
                    setHeroShow({
                        id: topShow.id,
                        title: topShow.title,
                        overview: topShow.overview,
                        image: topShow.backdrop, // Use backdrop for Hero
                        rating: topShow.rating,
                        year: topShow.year,
                        isTv: true
                    });
                }
            } else {
                setShows(prev => [...prev, ...newShows]);
            }
        } catch (error) {
            console.error("Error fetching TV shows:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Trigger fetch on filter change
    useEffect(() => {
        setPage(1);
        fetchShows(selectedLanguage, selectedGenre, 1);
    }, [selectedLanguage, selectedGenre]);


    // Infinite Scroll Effect
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !isLoading) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchShows(selectedLanguage, selectedGenre, nextPage);
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
    }, [isLoading, selectedLanguage, selectedGenre, fetchShows]);

    // Handlers
    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };



    return (
        <div className="tv-shows-page">
            {heroShow && (
                <Hero
                    movies={[heroShow]}
                    onPlay={onPlay}
                    onDetail={onDetail}
                    showArrows={false}
                />
            )}

            <div className="tv-shows-header-controls">
                <div className="tv-shows-title-section">
                    <h1 className="page-title">TV Shows</h1>
                    <div className="tv-shows-filters">
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

            <div className="container tv-shows-grid-container">
                <div className="movie-grid">
                    {shows.map((show, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={`${show.id}-${index}`}
                        >
                            <MovieCard movie={show} onPlay={onPlay} onDetail={onDetail} />
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

export default TvShows;
