import axios from 'axios';
import type { TVShow } from '../components/TVShow';
import type { TVShowDetails } from '../types/show.type';

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

export const fetchTvShowDetails = async (id: string): Promise<TVShowDetails> => {
    const res = await axios.get(`${BASE_URL}/tv/${id}`, {
        params: {
            api_key: API_KEY,
            language: 'en-US',
        },
    });
    return res.data;
};