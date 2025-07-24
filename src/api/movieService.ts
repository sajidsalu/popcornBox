import axios from 'axios';
import type { Movie } from '../types/movie.type';

const BASE_URL = 'https://api.themoviedb.org/3';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export const fetchPopularMovies = async (query: string = ''): Promise<Movie[]> => {
  const endpoint = query ? 'search/movie' : 'movie/popular';
  const response = await axios.get(`${BASE_URL}/${endpoint}`, {
    params: {
      api_key: apiKey,
      language: 'en-US',
      query,
      page: 1,
    },
  });
  return response.data.results;
};


export const getMovieById = async (id: number) => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
    params: {
      api_key: apiKey,
      language: 'en-US',
    },
  });
  return response.data;
};


export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: { api_key: apiKey },
  });
  return response.data.results.slice(0, 10);
};

export const fetchFanFavorites = async () => {
  const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
    params: { api_key: apiKey },
  });
  return response.data.results.slice(0, 10);
};

export const fetchComingSoon = async () => {
  const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
    params: { api_key: apiKey, region: 'IN' }, // optional: change region
  });
  return response.data.results.slice(0, 10);
};

export const fetchPopularPeople = async () => {
  const response = await axios.get(`${BASE_URL}/person/popular`, {
    params: { api_key: apiKey },
  });
  return response.data.results;
};

export const getMovieTrailer = async (movieId: string) => {
  const response = await axios.get(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}`
  );
  return response.data.results;
};