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
import NewAndPopular from './components/NewAndPopular';
import { AnimatePresence } from 'framer-motion';
import requests, { POSTER_BASE_URL, IMAGE_BASE_URL, getTrailerUrl, getTvTrailerUrl } from './api/tmdb';
import './App.css';

function App() {
  const [topTenMovies, setTopTenMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [realityShows, setRealityShows] = useState([]);
  const [countryRealityShows, setCountryRealityShows] = useState([]);
  const [adventureMovies, setAdventureMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [documentaries, setDocumentaries] = useState([]);
  const [animeShows, setAnimeShows] = useState([]);
  const [usTvShows, setUsTvShows] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [koreanDramas, setKoreanDramas] = useState([]);
  const [countryMovies, setCountryMovies] = useState([]);
  const [userCountry, setUserCountry] = useState('');
  const [featuredMovie, setFeaturedMovie] = useState(null);

  // Video Modal States
  const [videoPlayerState, setVideoPlayerState] = useState(null); // { mode: 'full' | 'trailer', url: string, id, type: 'movie'|'tv', season, episode, title }
  const [detailMedia, setDetailMedia] = useState(null); // { id, isTv }

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



        const trendingResp = await axios.get(requests.fetchTrending);
        setTrendingMovies(trendingResp.data.results.slice(0, 5).map(m => ({
          id: m.id,
          title: m.title || m.name,
          overview: m.overview,
          image: `${IMAGE_BASE_URL}${m.backdrop_path}`,
          rating: m.vote_average,
          rating: m.vote_average,
          year: (m.release_date || m.first_air_date) ? new Date(m.release_date || m.first_air_date).getFullYear() : 'N/A',
          isTv: m.media_type === 'tv'
        })));

        const koreanResp = await axios.get(requests.fetchKoreanDramas);
        setKoreanDramas(koreanResp.data.results.map(m => ({
          id: m.id,
          title: m.name || m.title,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
          isTv: true
        })));

        // Fetch User Country and Movies from that Country
        try {
          const ipResp = await axios.get('https://ipapi.co/json/');
          const countryCode = ipResp.data.country_code;
          const countryName = ipResp.data.country_name;
          setUserCountry(countryName);

          if (countryCode) {
            const countryMoviesResp = await axios.get(requests.fetchMoviesByCountry(countryCode));
            setCountryMovies(countryMoviesResp.data.results.map(m => ({
              id: m.id,
              title: m.title || m.name,
              image: `${POSTER_BASE_URL}${m.poster_path}`,
              rating: m.vote_average,
              year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'
            })));
          }

          if (countryCode) {
            const countryRealityResp = await axios.get(requests.fetchRealityShowsByCountry(countryCode));
            setCountryRealityShows(countryRealityResp.data.results.map(m => ({
              id: m.id,
              title: m.name || m.title,
              image: `${POSTER_BASE_URL}${m.poster_path}`,
              rating: m.vote_average,
              year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
              isTv: true
            })));
          }
        } catch (error) {
          console.error("Error fetching country data:", error);
          // Fallback to India if detection fails (optional)
          setUserCountry('India');
          const fallbackResp = await axios.get(requests.fetchMoviesByCountry('IN'));
          setCountryMovies(fallbackResp.data.results.map(m => ({
            id: m.id,
            title: m.title || m.name,
            image: `${POSTER_BASE_URL}${m.poster_path}`,
            rating: m.vote_average,
            year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'
          })));

          const fallbackRealityResp = await axios.get(requests.fetchRealityShowsByCountry('IN'));
          setCountryRealityShows(fallbackRealityResp.data.results.map(m => ({
            id: m.id,
            title: m.name || m.title,
            image: `${POSTER_BASE_URL}${m.poster_path}`,
            rating: m.vote_average,
            year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
            isTv: true
          })));
        }

        const realityResp = await axios.get(requests.fetchRealityShows);
        setRealityShows(realityResp.data.results.map(m => ({
          id: m.id,
          title: m.name || m.title,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
          isTv: true
        })));

        const usTvResp = await axios.get(requests.fetchUSTvShows);
        setUsTvShows(usTvResp.data.results.map(m => ({
          id: m.id,
          title: m.name || m.title,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
          isTv: true
        })));

        const adventureResp = await axios.get(requests.fetchAdventureMovies);
        setAdventureMovies(adventureResp.data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'
        })));

        const comedyResp = await axios.get(requests.fetchComedyMovies);
        setComedyMovies(comedyResp.data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'
        })));

        const docResp = await axios.get(requests.fetchDocumentaries);
        setDocumentaries(docResp.data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'
        })));

        const animeResp = await axios.get(requests.fetchAnime);
        setAnimeShows(animeResp.data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          image: `${POSTER_BASE_URL}${m.poster_path}`,
          rating: m.vote_average,
          year: m.first_air_date ? new Date(m.first_air_date).getFullYear() : 'N/A',
          isTv: true
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

  const handlePlay = async (id, title, isTv = false, isFullVideo = false, season = null, episode = null) => {
    if (!id) return;

    // Full Video Playback (Movie or TV Episode)
    if (isFullVideo) {
      setVideoPlayerState({
        mode: 'full',
        id: id,
        type: isTv ? 'tv' : 'movie',
        season: season || 1,
        episode: episode || 1,
        title: title
      });
      return;
    }

    // Trailer Playback logic
    try {
      const url = isTv ? getTvTrailerUrl(id) : getTrailerUrl(id);
      const response = await axios.get(url);
      const results = response.data.results || [];

      const trailer = results.find(vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')) || results[0];

      if (trailer && trailer.key) {
        setVideoPlayerState({
          mode: 'trailer',
          url: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0`,
          title: title
        });
      } else {
        alert(`Sorry, no trailer available for "${title}".`);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      // Fallback logic
      try {
        const fallbackUrl = !isTv ? getTvTrailerUrl(id) : getTrailerUrl(id);
        const fallbackResp = await axios.get(fallbackUrl);
        const fallbackResults = fallbackResp.data.results || [];
        const fallbackTrailer = fallbackResults.find(vid => vid.site === 'YouTube') || fallbackResults[0];

        if (fallbackTrailer && fallbackTrailer.key) {
          setVideoPlayerState({
            mode: 'trailer',
            url: `https://www.youtube.com/embed/${fallbackTrailer.key}?autoplay=1&modestbranding=1&rel=0`,
            title: title
          });
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
                {countryMovies.length > 0 && (
                  <MovieRow title={`Made in ${userCountry}`} movies={countryMovies} onPlay={handlePlay} onDetail={handleOpenDetail} />
                )}
                <MovieRow title="US TV Shows" movies={usTvShows} onPlay={(id, title) => handlePlay(id, title, true)} onDetail={(id) => handleOpenDetail(id, true)} />
                <FeaturedBanner movie={featuredMovie} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <Features />
                <MovieRow title="Epic World" movies={adventureMovies} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <MovieRow title="Laughter Session" movies={comedyMovies} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <MovieRow title="Documentary" movies={documentaries} onPlay={handlePlay} onDetail={handleOpenDetail} />
                <MovieRow title="Anime" movies={animeShows} onPlay={(id, title) => handlePlay(id, title, true)} onDetail={(id) => handleOpenDetail(id, true)} />
                <Subscription />
                <MovieRow title="Only on Torin" movies={popularShows} onPlay={(id, title) => handlePlay(id, title, true)} onDetail={(id) => handleOpenDetail(id, true)} />
                <MovieRow title={`Reality Shows in ${userCountry}`} movies={countryRealityShows} onPlay={(id, title) => handlePlay(id, title, true)} onDetail={(id) => handleOpenDetail(id, true)} />
                <MovieRow title="Popular Reality Shows Worldwide" movies={realityShows} onPlay={(id, title) => handlePlay(id, title, true)} onDetail={(id) => handleOpenDetail(id, true)} />
                <MovieRow title="K-Dramas (Korean Series)" movies={koreanDramas} onPlay={(id, title) => handlePlay(id, title, true)} onDetail={(id) => handleOpenDetail(id, true)} />
                <FAQ />
                <FreeTrial />
              </div>
            </>
          } />
          <Route path="/movies" element={<Movies onPlay={handlePlay} onDetail={handleOpenDetail} />} />
          <Route path="/tv-shows" element={<TvShows onPlay={handlePlay} onDetail={handleOpenDetail} />} />
          <Route path="/search" element={<Search onPlay={handlePlay} onDetail={handleOpenDetail} />} />
          <Route path="/new-popular" element={<NewAndPopular onPlay={handlePlay} onDetail={handleOpenDetail} />} />
        </Routes>
        <Footer />

        <AnimatePresence>
          {videoPlayerState && (
            <VideoModal
              playerState={videoPlayerState}
              onClose={() => setVideoPlayerState(null)}
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
