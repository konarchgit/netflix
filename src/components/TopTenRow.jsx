import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Info, Youtube } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import './TopTenRow.css';

const TopTenRow = ({ movies, onPlay, onDetail }) => {
    return (
        <div className="top-ten-section section-padding">
            <div className="container">
                <h2 className="section-title">Top 10 Today</h2>
                <Swiper
                    modules={[Navigation, Pagination, EffectCoverflow]}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    initialSlide={4}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    className="top-ten-swiper"
                >
                    {movies.slice(0, 10).map((movie, index) => (
                        <SwiperSlide key={movie.id} className="top-ten-slide">
                            <div className="top-ten-card">
                                <div className="rank-number">{index + 1}</div>
                                <div className="card-image-wrap">
                                    <img src={movie.image} alt={movie.title} />
                                    <div className="card-overlay">
                                        <h3 className="card-title">{movie.title}</h3>
                                        <div className="overlay-actions-row">
                                            <button className="action-circle play" onClick={() => onPlay(movie.id, movie.title, false, true)} title="Watch Now">
                                                <Play size={18} fill="white" />
                                            </button>
                                            <button className="action-circle trailer" onClick={() => onPlay(movie.id, movie.title, false, false)} title="Watch Trailer">
                                                <Youtube size={18} />
                                            </button>
                                            <button className="action-circle info" onClick={(e) => { e.stopPropagation(); onDetail(movie.id); }} title="View Detail">
                                                <Info size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default TopTenRow;
