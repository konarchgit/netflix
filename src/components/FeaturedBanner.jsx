import React from 'react';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import './FeaturedBanner.css';

const FeaturedBanner = ({ movie, onPlay, onDetail }) => {
    if (!movie) {
        return (
            <section className="featured-banner-loading">
                <div className="loader"></div>
            </section>
        );
    }

    return (
        <section className="featured-banner">
            <div className="banner-overlay"></div>
            <img
                src={movie.backdrop || movie.image}
                alt={movie.title}
                className="banner-bg"
            />

            <div className="banner-content container">
                <div className="banner-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="banner-text"
                    >
                        <span className="banner-label">TOP RATED TODAY</span>
                        <h2 className="banner-title distress-font">{movie.title}</h2>
                        <p className="banner-description">
                            {movie.overview} <span className="read-more">Read More</span>
                        </p>

                        <div className="banner-actions">
                            <button className="featured-btn play" onClick={() => onPlay(movie.id, movie.title, false, true)}>
                                <Play size={20} fill="currentColor" /> Watch Now
                            </button>
                            <button className="featured-btn info" onClick={() => onDetail(movie.id)}>
                                <Info size={20} /> More Info
                            </button>
                        </div>
                    </motion.div>

                    <div className="banner-play-area">
                        <motion.div
                            className="large-play-icon"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onPlay(movie.id, movie.title, false, true)}
                        >
                            <div className="ripple"></div>
                            <Play size={48} fill="white" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedBanner;
