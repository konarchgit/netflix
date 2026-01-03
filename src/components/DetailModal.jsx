import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Info, Calendar, Globe, Star, Camera, Film } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import requests, { IMAGE_BASE_URL, POSTER_BASE_URL } from '../api/tmdb';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

import './DetailModal.css';

const DetailModal = ({ isOpen, onClose, mediaId, isTv, onPlay }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!isOpen || !mediaId) return;
            setLoading(true);
            try {
                const endpoint = isTv
                    ? requests.fetchTvDetails(mediaId)
                    : requests.fetchMovieDetails(mediaId);
                const resp = await axios.get(endpoint);
                setDetails(resp.data);
            } catch (error) {
                console.error("Error fetching media details:", error);
            }
            setLoading(false);
        };

        fetchDetails();
    }, [isOpen, mediaId, isTv]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay" onClick={onClose}>
                    <motion.div
                        className="detail-modal-container"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="modal-close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>

                        {loading ? (
                            <div className="modal-loader-container">
                                <div className="loader"></div>
                            </div>
                        ) : details && (
                            <div className="detail-modal-content">
                                <div className="detail-modal-banner">
                                    <img
                                        src={`${IMAGE_BASE_URL}${details.backdrop_path || details.poster_path}`}
                                        alt={details.title || details.name}
                                        className="modal-banner-img"
                                    />
                                    <div className="modal-banner-overlay"></div>
                                    <div className="modal-banner-actions">
                                        <h1 className="modal-title">{details.title || details.name}</h1>
                                        <div className="modal-primary-actions">
                                            <button className="btn btn-watch" onClick={() => onPlay(details.id, details.title || details.name, isTv, true)}>
                                                <Play size={20} fill="currentColor" /> Watch Now
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-modal-body">
                                    <div className="modal-info-grid">
                                        <div className="modal-info-left">
                                            <div className="metadata-row">
                                                <span className="metadata-item rating">
                                                    {(details.vote_average * 10).toFixed(0)}% Match
                                                </span>
                                                <span className="metadata-item">
                                                    <Calendar size={14} /> {new Date(details.release_date || details.first_air_date).getFullYear()}
                                                </span>
                                                <span className="metadata-item">
                                                    {isTv ? `${details.number_of_seasons} Seasons` : `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
                                                </span>
                                                <span className="hd-tag">4K ULTRA HD</span>
                                            </div>

                                            <p className="modal-overview">{details.overview}</p>
                                        </div>

                                        <div className="modal-info-right">
                                            <div className="info-group">
                                                <span className="info-label">Cast: </span>
                                                <span className="info-value">
                                                    {details.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')}
                                                </span>
                                            </div>

                                            <div className="info-group">
                                                <span className="info-label">Genres: </span>
                                                <span className="info-value">
                                                    {details.genres?.map(g => g.name).join(', ')}
                                                </span>
                                            </div>

                                            <div className="info-group">
                                                <span className="info-label">Available Audio: </span>
                                                <span className="info-value">
                                                    <Globe size={14} className="inline-icon" /> {details.spoken_languages?.map(l => l.english_name).join(', ')}
                                                </span>
                                            </div>

                                            <div className="info-group">
                                                <span className="info-label">Original Title: </span>
                                                <span className="info-value">{details.original_title || details.original_name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media Gallery Section */}
                                    <div className="modal-gallery-section">
                                        {/* Photo Gallery */}
                                        {details.images?.backdrops?.length > 0 && (
                                            <div className="gallery-group">
                                                <div className="gallery-header">
                                                    <Camera size={20} />
                                                    <h3>PHOTOS</h3>
                                                </div>
                                                <Swiper
                                                    modules={[Navigation, FreeMode]}
                                                    navigation
                                                    spaceBetween={10}
                                                    slidesPerView={1.5}
                                                    freeMode={true}
                                                    breakpoints={{
                                                        640: { slidesPerView: 2.2 },
                                                        768: { slidesPerView: 3.2 },
                                                    }}
                                                    className="photo-swiper"
                                                >
                                                    {details.images.backdrops.slice(0, 12).map((img, idx) => (
                                                        <SwiperSlide key={idx}>
                                                            <div className="gallery-photo-card">
                                                                <img src={`${IMAGE_BASE_URL}${img.file_path}`} alt="Still" />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        )}

                                        {/* Video Gallery */}
                                        {details.videos?.results?.length > 0 && (
                                            <div className="gallery-group">
                                                <div className="gallery-header">
                                                    <Film size={20} />
                                                    <h3>TRAILERS & VIDEOS</h3>
                                                </div>
                                                <div className="video-grid">
                                                    {details.videos.results.slice(0, 6).map((video) => (
                                                        <div
                                                            key={video.id}
                                                            className="gallery-video-card"
                                                            onClick={() => onPlay(details.id, `${details.title || details.name} - ${video.name}`, isTv, false)}
                                                        >
                                                            <div className="video-thumbnail-wrapper">
                                                                <img
                                                                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                                                    alt={video.name}
                                                                />
                                                                <div className="video-play-overlay">
                                                                    <Play size={32} fill="white" />
                                                                </div>
                                                            </div>
                                                            <div className="video-info">
                                                                <span className="video-type">{video.type}</span>
                                                                <p className="video-name">{video.name}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DetailModal;
