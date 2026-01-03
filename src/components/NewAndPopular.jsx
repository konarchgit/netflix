
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import requests, { POSTER_BASE_URL } from '../api/tmdb';
import MovieRow from './MovieRow';
import TopTenRow from './TopTenRow'; // Reusing existing Top 10 row
import './NewAndPopular.css';

const NewAndPopular = ({ onPlay, onDetail }) => {
    const [newMovies, setNewMovies] = useState([]);
    const [topMovies, setTopMovies] = useState([]);
    const [topShows, setTopShows] = useState([]);
    const [upcomingWeek, setUpcomingWeek] = useState([]);
    const [upcomingNextWeek, setUpcomingNextWeek] = useState([]);
    const [userCountry, setUserCountry] = useState('India'); // Default
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Detect Country
                try {
                    const ipResp = await axios.get('https://ipwho.is/');
                    if (ipResp.data.success) {
                        setUserCountry(ipResp.data.country || 'India');
                    }
                } catch (e) {
                    console.error("Geo-detect failed", e);
                }

                // 1. New on Netflix (Mix of Movies/TV or just Movies?)
                // User asked for "New on Netflix". Let's show New Movies for now.
                const newResp = await axios.get(requests.fetchNewReleases);
                setNewMovies(newResp.data.results.map(mapData));

                // 2. Top 10 Shows Today
                const topTvResp = await axios.get(requests.fetchTrendingTvDay);
                setTopShows(topTvResp.data.results.slice(0, 10).map(mapDataTv));

                // 3. Top 10 Movies Today
                const topMovResp = await axios.get(requests.fetchTrendingMoviesDay);
                setTopMovies(topMovResp.data.results.slice(0, 10).map(mapData));

                // 4. Coming This Week
                const weekResp = await axios.get(requests.fetchUpcomingWeek);
                setUpcomingWeek(weekResp.data.results.map(mapData));

                // 5. Coming Next Week
                const nextWeekResp = await axios.get(requests.fetchUpcomingNextWeek);
                setUpcomingNextWeek(nextWeekResp.data.results.map(mapData));

            } catch (error) {
                console.error("Error fetching New & Popular data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const mapData = (m) => ({
        id: m.id,
        title: m.title || m.name,
        overview: m.overview,
        image: `${POSTER_BASE_URL}${m.poster_path}`,
        backdrop: `${POSTER_BASE_URL}${m.backdrop_path}`,
        rating: m.vote_average,
        year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A',
        isTv: false
    });

    const mapDataTv = (m) => ({
        ...mapData(m),
        isTv: true,
        year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A'
    });

    if (isLoading) {
        return <div className="loading-screen"><div className="loader"></div></div>;
    }

    return (
        <div className="new-popular-page">
            <div className="new-popular-header">
                <h1>New & Popular</h1>
            </div>

            <div className="new-popular-content">
                {/* 1. New on Netflix */}
                <MovieRow
                    title="New on Netflix"
                    movies={newMovies}
                    onPlay={onPlay}
                    onDetail={onDetail}
                    isNewBadge={true}
                />

                {/* 2. Top 10 Shows */}
                <TopTenRow
                    title={`Top 10 Shows in ${userCountry} Today`}
                    movies={topShows}
                    onPlay={onPlay}
                    onDetail={onDetail}
                />

                {/* 3. Top 10 Movies */}
                <TopTenRow
                    title={`Top 10 Movies in ${userCountry} Today`}
                    movies={topMovies}
                    onPlay={onPlay}
                    onDetail={onDetail}
                />

                {/* 4. Coming This Week */}
                <MovieRow
                    title="Coming This Week"
                    movies={upcomingWeek}
                    onPlay={onPlay}
                    onDetail={onDetail}
                />

                {/* 5. Worth the Wait (We can use next week or generic upcoming) */}
                <MovieRow
                    title="Worth the Wait"
                    movies={upcomingNextWeek}
                    onPlay={onPlay}
                    onDetail={onDetail}
                />

                {/* 6. Coming Next Week */}
                <MovieRow
                    title="Coming Next Week"
                    movies={upcomingNextWeek}
                    onPlay={onPlay}
                    onDetail={onDetail}
                />
            </div>
        </div>
    );
};

export default NewAndPopular;
