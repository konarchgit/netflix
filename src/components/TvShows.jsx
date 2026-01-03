import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import MovieRow from './MovieRow';
import MovieCard from './MovieCard';
import requests, { POSTER_BASE_URL, IMAGE_BASE_URL } from '../api/tmdb';
import { Filter, Play, ChevronDown, ChevronUp, Search } from 'lucide-react';
import './TvShows.css';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ru', name: 'Russian' },
    { code: 'pl', name: 'Polish' },
    { code: 'ko', name: 'Korean' },
    { code: 'ja', name: 'Japanese' },
];

const TvShows = ({ onPlay, onDetail }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [genreShows, setGenreShows] = useState([]);
    const [languageShows, setLanguageShows] = useState([]);
    const [trendingShows, setTrendingShows] = useState([]);
    const [netflixOriginals, setNetflixOriginals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isAudioOpen, setIsAudioOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchTerm.trim()) {
                setSearchResults([]);
                return;
            }
            try {
                const resp = await axios.get(requests.fetchTvSearch(searchTerm));
                setSearchResults(resp.data.results.map(m => ({
                    id: m.id,
                    title: m.name || m.title,
                    image: `${POSTER_BASE_URL}${m.poster_path}`,
                    rating: m.vote_average
                })));
            } catch (error) {
                console.error("Error searching TV shows:", error);
            }
        };

        const timer = setTimeout(() => {
            fetchSearchResults();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [genreList, trending, originals] = await Promise.all([
                    axios.get(requests.fetchTvGenres),
                    axios.get(requests.fetchTrending),
                    axios.get(requests.fetchNetflixOriginals)
                ]);

                setGenres(genreList.data.genres);

                // Filter only TV shows from trending
                setTrendingShows(trending.data.results.filter(m => m.media_type === 'tv').map(m => ({
                    id: m.id,
                    title: m.name || m.title,
                    image: `${POSTER_BASE_URL}${m.poster_path}`,
                    rating: m.vote_average,
                    year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
                    isTv: true
                })));

                setNetflixOriginals(originals.data.results.map(m => ({
                    id: m.id,
                    title: m.name || m.title,
                    image: `${POSTER_BASE_URL}${m.poster_path}`,
                    rating: m.vote_average,
                    year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
                    isTv: true
                })));

                setLoading(false);
            } catch (error) {
                console.error("Error fetching TV show data:", error);
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleLanguageSelect = async (lang) => {
        if (selectedLanguage?.code === lang.code) {
            setSelectedLanguage(null);
            setLanguageShows([]);
            return;
        }

        setSelectedLanguage(lang);
        setSelectedGenre(null); // Reset genre filter when language is selected
        setLoading(true);
        try {
            const resp = await axios.get(requests.fetchTvByLanguage(lang.code));
            setLanguageShows(resp.data.results.map(m => ({
                id: m.id,
                title: m.name || m.title,
                image: `${POSTER_BASE_URL}${m.poster_path}`,
                rating: m.vote_average
            })));
        } catch (error) {
            console.error("Error fetching language shows:", error);
        }
        setLoading(false);
    };

    const handleGenreSelect = async (genre) => {
        if (selectedGenre?.id === genre.id) {
            setSelectedGenre(null);
            setGenreShows([]);
            return;
        }

        setSelectedGenre(genre);
        setSelectedLanguage(null); // Reset language filter when genre is selected
        setLoading(true);
        try {
            const resp = await axios.get(requests.fetchTvByGenre(genre.id));
            setGenreShows(resp.data.results.map(m => ({
                id: m.id,
                title: m.name || m.title,
                image: `${POSTER_BASE_URL}${m.poster_path}`,
                rating: m.vote_average
            })));
        } catch (error) {
            console.error("Error fetching genre shows:", error);
        }
        setLoading(false);
    };

    if (loading && !selectedGenre) {
        return (
            <div className="tv-page-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="tv-page-wrapper">
            {/* TV Hero */}
            <section className="tv-hero">
                <div className="hero-overlay-v2"></div>
                <div className="container hero-content-v2">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-text-v2"
                    >
                        <h1 className="tv-title distress-font">EPIC SERIES</h1>
                        <p className="tv-subtitle">Binge-worthy series and world-class storytelling, all in one place.</p>
                    </motion.div>
                </div>
            </section>

            <div className="container tv-main-content">
                {/* Search & Filter Bar */}
                <div className="filter-controls-container">
                    <div className="in-page-search-section">
                        <div className="filter-header">
                            <Search size={18} />
                            <span>Quick Search</span>
                        </div>
                        <div className="in-page-search-box">
                            <input
                                type="text"
                                placeholder="Search series..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value) {
                                        setSelectedGenre(null);
                                        setSelectedLanguage(null);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="genre-filter-section">
                        <div className="filter-header clickable" onClick={() => setIsGenreOpen(!isGenreOpen)}>
                            <div className="filter-header-left">
                                <Filter size={18} />
                                <span>Filter by Category</span>
                            </div>
                            {isGenreOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        <AnimatePresence>
                            {isGenreOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="genre-list pt-1">
                                        {genres.map(genre => (
                                            <button
                                                key={genre.id}
                                                className={`genre-chip ${selectedGenre?.id === genre.id ? 'active' : ''}`}
                                                onClick={() => handleGenreSelect(genre)}
                                            >
                                                {genre.name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="language-filter-section">
                        <div className="filter-header clickable" onClick={() => setIsAudioOpen(!isAudioOpen)}>
                            <div className="filter-header-left">
                                <Play size={18} className="rotate-icon" />
                                <span>Filter by Audio</span>
                            </div>
                            {isAudioOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        <AnimatePresence>
                            {isAudioOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="genre-list pt-1">
                                        {LANGUAGES.map(lang => (
                                            <button
                                                key={lang.code}
                                                className={`genre-chip ${selectedLanguage?.code === lang.code ? 'active' : ''}`}
                                                onClick={() => handleLanguageSelect(lang)}
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Filter & Search Results */}
                <AnimatePresence mode="wait">
                    {searchTerm && searchResults.length > 0 && (
                        <motion.section
                            key="search-results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="genre-results-section"
                        >
                            <h2 className="section-title">Search Results for "{searchTerm}"</h2>
                            <div className="shows-grid">
                                {searchResults.map(show => (
                                    <MovieCard key={show.id} movie={show} onPlay={(id, title) => onPlay(id, title, true, true)} onDetail={() => onDetail(show.id, true)} />
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {selectedGenre && (
                        <motion.section
                            key={selectedGenre.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="genre-results-section"
                        >
                            <h2 className="section-title">Latest in {selectedGenre.name}</h2>
                            <div className="shows-grid">
                                {genreShows.map(show => (
                                    <MovieCard key={show.id} movie={show} onPlay={(id, title) => onPlay(id, title, true, true)} onDetail={() => onDetail(show.id, true)} />
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {selectedLanguage && (
                        <motion.section
                            key={selectedLanguage.code}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="genre-results-section"
                        >
                            <h2 className="section-title">{selectedLanguage.name} Audio Content</h2>
                            <div className="shows-grid">
                                {languageShows.map(show => (
                                    <MovieCard key={show.id} movie={show} onPlay={(id, title) => onPlay(id, title, true, true)} onDetail={() => onDetail(show.id, true)} />
                                ))}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Default Sections */}
                {!selectedGenre && !selectedLanguage && !searchTerm && (
                    <>
                        <MovieRow title="Netflix Originals" movies={netflixOriginals} onPlay={(id, title) => onPlay(id, title, true, true)} onDetail={(id) => onDetail(id, true)} />
                        <MovieRow title="Trending TV Shows" movies={trendingShows} onPlay={(id, title) => onPlay(id, title, true, true)} onDetail={(id) => onDetail(id, true)} />
                    </>
                )}
            </div>
        </div>
    );
};

export default TvShows;
