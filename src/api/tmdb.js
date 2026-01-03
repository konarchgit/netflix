const API_KEY = 'b2aa91ce2080244606eb044aa2de7080';
const BASE_URL = 'https://api.tmdb.org/3';

export const requests = {
    fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
    fetchUpcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US`,
    fetchBollywood: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi|te|kn|ml|ta&sort_by=primary_release_date.desc`,
    fetchHollywood: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=en&region=US&sort_by=primary_release_date.desc`,
    fetchGenres: `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    fetchTvGenres: `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`,
    fetchMoviesByGenre: (genreId, page = 1) => `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
    fetchTvByGenre: (genreId, page = 1) => `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
    fetchMoviesByLanguage: (lang, page = 1) => `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}`,
    fetchTvByLanguage: (lang, page = 1) => `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}`,
    fetchSearch: (query) => `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`,
    fetchMovieSearch: (query) => `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`,
    fetchTvSearch: (query) => `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`,
    fetchMovieDetails: (id) => `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,images`,
    fetchTvDetails: (id) => `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos,images`,
    fetchKoreanDramas: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&with_genres=18&sort_by=popularity.desc`,
    fetchMoviesByCountry: (countryCode) => `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=${countryCode}&sort_by=popularity.desc`,
    fetchUSTvShows: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_origin_country=US&language=en-US&sort_by=popularity.desc`,
    fetchAdventureMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=12&sort_by=popularity.desc`,
    fetchAnime: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
    fetchRealityShows: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10764&sort_by=popularity.desc`,
    fetchRealityShowsByCountry: (countryCode) => `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10764&with_origin_country=${countryCode}&sort_by=popularity.desc`,
};

export const getTrailerUrl = (movieId) => `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
export const getTvTrailerUrl = (tvId) => `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`;

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original/';
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500/';

export default requests;
