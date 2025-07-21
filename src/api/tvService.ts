import axios from 'axios';
import type { TVShow } from '../components/TVShow';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopularTvShows = async (): Promise<TVShow[]> => {
    const res = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US`);
    return res.data.results;
};

export const fetchTopRatedTvShows = async (): Promise<TVShow[]> => {
    const res = await axios.get(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US`);
    return res.data.results;
};

export const fetchAiringTodayTv = async (): Promise<TVShow[]> => {
    const res = await axios.get(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=en-US`);
    return res.data.results;
};