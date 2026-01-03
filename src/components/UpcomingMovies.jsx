import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Play, Share2, Info, Youtube } from 'lucide-react';
import './UpcomingMovies.css';

const UpcomingMovies = ({ movies, onPlay, onDetail }) => {
    return (
        <div className="upcoming-section section-padding">
            <div className="container">
                <h2 className="section-title">UPCOMING MOVIES</h2>
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                    }}
                    className="upcoming-swiper"
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id} className="upcoming-slide">
                            <div className="upcoming-card">
                                <div className="card-top">
                                    <img src={movie.image} alt={movie.title} />
                                    <div className="card-hover-overlay">
                                        <div className="action-buttons-wrap">
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
                                        <div className="watchlist-action">
                                            <span>Add To Watchlist</span>
                                            <button className="share-btn"><Share2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-bottom">
                                    <h3 className="upcoming-title">{movie.title}</h3>
                                    <p className="release-date">Release Date: {movie.releaseDate}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default UpcomingMovies;
