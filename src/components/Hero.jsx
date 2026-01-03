import React from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const Hero = ({ movies, onPlay, onDetail }) => {
    // Fallback if no movies are provided yet
    const displayMovies = movies && movies.length > 0 ? movies : [];

    if (displayMovies.length === 0) {
        return (
            <div className="hero-loading">
                <div className="loader"></div>
                <p>Loading Awesome Content...</p>
            </div>
        );
    }

    return (
        <div className="hero-slider-wrapper">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                pagination={{ clickable: true, el: '.custom-pagination' }}
                navigation={{
                    nextEl: '.swiper-btn-next',
                    prevEl: '.swiper-btn-prev',
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="hero-swiper"
            >
                {displayMovies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div className="hero-slide">
                            <div className="hero-overlay"></div>
                            <img src={movie.image} alt={movie.title} className="hero-bg" />

                            <div className="hero-content container">
                                <div className="hero-grid">
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="hero-text-area"
                                    >
                                        <span className="hero-category">TRENDING • EXCLUSIVE</span>
                                        <h1 className="hero-title distress-font">{movie.title}</h1>
                                        <div className="hero-description-container">
                                            <p className="hero-description">
                                                {movie.overview}
                                            </p>
                                            <span className="read-more">Read More</span>
                                        </div>

                                        <div className="hero-meta">
                                            <div className="stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        fill={i < Math.floor(movie.rating / 2) ? "#FFD700" : "none"}
                                                        color="#FFD700"
                                                    />
                                                ))}
                                                <span className="rating-num">{(movie.rating / 2).toFixed(1)}</span>
                                            </div>
                                            <span className="duration">🕒 2h : 15m</span>
                                        </div>

                                        <div className="hero-actions">
                                            <button className="btn btn-watch" onClick={() => onPlay(movie.id, movie.title, false, true)}>
                                                <Play size={20} fill="currentColor" /> Watch Now
                                            </button>
                                            <button className="btn btn-info" onClick={() => onDetail(movie.id)}>
                                                <Info size={20} /> More Info
                                            </button>
                                            <button className="btn btn-trailer" onClick={() => onPlay(movie.id, movie.title, false, false)}>See Trailer</button>
                                        </div>
                                    </motion.div>

                                    <div className="hero-play-center">
                                        <motion.div
                                            className="play-btn-large"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onPlay(movie.id, movie.title, false, true)}
                                        >
                                            <div className="play-ripple"></div>
                                            <Play size={40} fill="white" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation & Pagination Container */}
                <div className="hero-controls container">
                    <div className="custom-pagination"></div>
                    <div className="hero-nav-btns">
                        <button className="swiper-btn-prev"><ChevronLeft size={24} /></button>
                        <button className="swiper-btn-next"><ChevronRight size={24} /></button>
                    </div>
                </div>
            </Swiper>
        </div>
    );
};

export default Hero;
