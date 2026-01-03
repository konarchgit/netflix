
import axios from 'axios';

const API_KEY = 'b2aa91ce2080244606eb044aa2de7080';
const BASE_URL = 'https://api.tmdb.org/3';

const endpoints = {
    fetchAdventureMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=12&sort_by=popularity.desc`,
    fetchAnime: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
    fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
    fetchRealityShows: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10764&sort_by=popularity.desc`,
    fetchRealityShowsIN: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10764&with_origin_country=IN&sort_by=popularity.desc`,
};

async function testEndpoints() {
    for (const [name, url] of Object.entries(endpoints)) {
        try {
            console.log(`Testing ${name}...`);
            const response = await axios.get(url);
            const results = response.data.results;
            console.log(`✅ ${name}: Found ${results.length} items.`);
            if (results.length > 0) {
                console.log(`   Sample: ${results[0].title || results[0].name} (ID: ${results[0].id})`);
            }
        } catch (error) {
            console.error(`❌ ${name}: FAILED`, error.message);
        }
    }
}

testEndpoints();
