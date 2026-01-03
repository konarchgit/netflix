import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import TopTenRow from './components/TopTenRow';
import UpcomingMovies from './components/UpcomingMovies';
import FeaturedBanner from './components/FeaturedBanner';
import Features from './components/Features';
import Subscription from './components/Subscription';
import FreeTrial from './components/FreeTrial';
import VideoModal from './components/VideoModal';
import Movies from './components/Movies';
import TvShows from './components/TvShows';
import Search from './components/Search';
import DetailModal from './components/DetailModal';
import { AnimatePresence } from 'framer-motion';
import requests, { POSTER_BASE_URL, IMAGE_BASE_URL, getTrailerUrl, getTvTrailerUrl } from './api/tmdb';
import './App.css';

function App() {
  const [topTenMovies, setTopTenMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  // Video Modal States
  const [playUrl, setPlayUrl] = useState(null);
  const [detailMedia, setDetailMedia] = useState(null); // { id, isTv }
  const [selectedMovieTitle, setSelectedMovieTitle] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const topRatedResp = await axios.get(requests.fetchTopRated);
        const topMovies = topRatedResp.data.results;

        setTopTenMovies(topMovies.slice(0, 10).map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          backdrop: `${IMAGE_BASE_URL}${m.backdrop_path}`,
          rating: m.vote_average,
          year: (m.release_date || m.first_air_date) ? new Date(m.release_date || m.first_air_date).getFullYear() : 'N/A'
        })));

        // Set the 11th movie as featured (to avoid duplication with Top 10)
        const featured = topMovies[10] || topMovies[0];
        setFeaturedMovie({
          id: featured.id,
          title: featured.title || featured.name,
          overview: featured.overview,
          backdrop: `${IMAGE_BASE_URL}${featured.backdrop_path}`,
          image: `${POSTER_BASE_URL}${featured.poster_path}`,
          rating: featured.vote_average,
          year: (featured.release_date || featured.first_air_date) ? new Date(featured.release_date || featured.first_air_date).getFullYear() : 'N/A'
        });

        const upcomingResp = await axios.get(requests.fetchUpcoming);
        setUpcomingMovies(upcomingResp.data.results.slice(0, 10).map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          releaseDate: m.release_date,
          rating: m.vote_average,
          year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'
        })));

        const popularResp = await axios.get(requests.fetchNetflixOriginals);
        setPopularShows(popularResp.data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
          isTv: true
        })));

        const actionResp = await axios.get(requests.fetchActionMovies);
        setActionMovies(actionResp.data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'
        })));

        const trendingResp = await axios.get(requests.fetchTrending);
        setTrendingMovies(trendingResp.data.results.slice(0, 5).map(m => ({
          id: m.id,
          title: m.title || m.name,
          overview: m.overview,
          image: `${IMAGE_BASE_URL}${m.backdrop_path}`,
          rating: m.vote_average,
          year: (m.release_date || m.first_air_date) ? new Date(m.release_date || m.first_air_date).getFullYear() : 'N/A',
          isTv: m.media_type === 'tv'
        })));
      } catch (error) {
        console.error("Error fetching data from TMDB:", error);
      }
    }
    fetchData();
  }, []);

  const handleOpenDetail = (id, isTv = false) => {
    setDetailMedia({ id, isTv });
  };

  const handlePlay = async (id, title, isTv = false, isMovie = false) => {
    if (!id) return;

    if (isMovie) {
      // For full movie playback, we use an embed service
      // isTv flag might be needed for TV shows too
      const baseUrl = isTv ? "https://vidsrc.cc/v2/embed/tv/" : "https://vidsrc.cc/v2/embed/movie/";
      setPlayUrl(`${baseUrl}${id}`);
      setSelectedMovieTitle(title);
      return;
    }

    try {
      const url = isTv ? getTvTrailerUrl(id) : getTrailerUrl(id);
      const response = await axios.get(url);
      const results = response.data.results || [];

      // Look for a YouTube trailer specifically, otherwise fall back to any video
      const trailer = results.find(vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')) || results[0];

      if (trailer && trailer.key) {
        setPlayUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0`);
        setSelectedMovieTitle(title);
      } else {
        alert(`Sorry, no trailer available for "${title}".`);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      // Try the other endpoint if one fails (sometimes ID types cross over in TMDB)
      try {
        const fallbackUrl = !isTv ? getTvTrailerUrl(id) : getTrailerUrl(id);
        const fallbackResp = await axios.get(fallbackUrl);
        const fallbackResults = fallbackResp.data.results || [];
        const fallbackTrailer = fallbackResults.find(vid => vid.site === 'YouTube') || fallbackResults[0];

        if (fallbackTrailer && fallbackTrailer.key) {
          setPlayUrl(`https://www.youtube.com/embed/${fallbackTrailer.key}?autoplay=1&modestbranding=1&rel=0`);
          setSelectedMovieTitle(title);
          return;
        }
      } catch (e) {
        // Fallback also failed
      }
      alert("Movie trailer not found or unavailable.");
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero movies={trendingMovies} onPlay={handlePlay} onDetail={handleOpenDetail} />
              <div className="main-content">
                <TopTenRow movies={topTenMovies} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <UpcomingMovies movies={upcomingMovies} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <FeaturedBanner movie={featuredMovie} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <Features />
                <Subscription />
                <MovieRow title="Only on Torin" movies={popularShows} onPlay={(id, title) => handlePlay(id, title, true)} onDetail={(id) => handleOpenDetail(id, true)} />
                <MovieRow title="Action & Adventure" movies={actionMovies} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <FAQ />
                <FreeTrial />
              </div>
            </>
          } />
          <Route path="/movies" element={<Movies onPlay={handlePlay} onDetail={handleOpenDetail} />} />
          <Route path="/tv-shows" element={<TvShows onPlay={handlePlay} onDetail={handleOpenDetail} />} />
          <Route path="/search" element={<Search onPlay={handlePlay} onDetail={handleOpenDetail} />} />
        </Routes>
        <Footer />

        <AnimatePresence>
          {playUrl && (
            <VideoModal
              videoUrl={playUrl}
              title={selectedMovieTitle}
              onClose={() => setPlayUrl(null)}
            />
          )}
          {detailMedia && (
            <DetailModal
              isOpen={!!detailMedia}
              onClose={() => setDetailMedia(null)}
              mediaId={detailMedia?.id}
              isTv={detailMedia?.isTv}
              onPlay={handlePlay}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
