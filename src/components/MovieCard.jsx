import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Info, Youtube, Heart, Eye, Star } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie, onPlay, onDetail }) => {
    return (
        <motion.div
            className="movie-grid-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            onClick={() => onDetail(movie.id, movie.isTv || false)}
        >
            <div className="card-image-container">
                <img src={movie.image} alt={movie.title} className="movie-card-img" />
                <div className="card-hover-overlay">
                    <div className="hover-actions-row">
                        <button className="icon-btn-v2 play" onClick={(e) => { e.stopPropagation(); onPlay(movie.id, movie.title, movie.isTv || false, true); }} title="Watch Now">
                            <Play size={16} fill="white" />
                        </button>
                        <button className="icon-btn-v2" onClick={(e) => { e.stopPropagation(); onPlay(movie.id, movie.title, movie.isTv || false, false); }} title="Watch Trailer">
                            <Youtube size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-content-bottom">
                <h4 className="movie-title-v2">{movie.title}</h4>
                <div className="movie-meta-v2">
                    <span className="movie-year-v2">{movie.year || '2018'}</span>
                    <div className="meta-stats-v2">
                        <Heart size={14} className="icon-heart" fill="#E50914" />
                        <Eye size={14} className="icon-eye" />
                    </div>
                    <div className="movie-rating-v2">
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                        <span>{movie.rating ? movie.rating.toFixed(1) : '4.7'}</span>
                    </div>
                </div>
            </div>

            {movie.rank && (
                <div className="movie-rank-v2">
                    {movie.rank}
                </div>
            )}
        </motion.div>
    );
};

export default MovieCard;
