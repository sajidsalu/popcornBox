import axios from "axios";
import type {
  TVSeasonDetails,
  TVShow,
  TVShowDetails,
} from "../types/show.type";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

console.log("api key and base url", API_KEY, BASE_URL);

export type TvCreditsResult = {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
};

export const fetchPopularTvShows = async (): Promise<TVShow[]> => {
  const res = await axios.get(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US`,
  );
  return res.data.results;
};

export const fetchTopRatedTvShows = async (): Promise<TVShow[]> => {
  const res = await axios.get(
    `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US`,
  );
  return res.data.results;
};

export const fetchAiringTodayTv = async (): Promise<TVShow[]> => {
  const res = await axios.get(
    `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=en-US`,
  );
  return res.data.results;
};

export const fetchTvShowDetails = async (
  id: string,
): Promise<TVShowDetails> => {
  const res = await axios.get(`${BASE_URL}/tv/${id}`, {
    params: {
      api_key: API_KEY,
      language: "en-US",
    },
  });
  return res.data;
};

export const fetchTvSeasonDetails = async (
  tvId: string | number,
  seasonNumber: number,
): Promise<TVSeasonDetails> => {
  const res = await axios.get(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}`, {
    params: {
      api_key: API_KEY,
      language: "en-US",
    },
  });
  return res.data;
};

export const fetchTvCredits = async (
  tvId: number,
): Promise<TvCreditsResult> => {
  const res = await axios.get(`${BASE_URL}/tv/${tvId}/credits`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};

export const fetchSimilarTvShows = async (
  tvId: string | number,
): Promise<TVShow[]> => {
  const res = await axios.get(`${BASE_URL}/tv/${tvId}/similar`, {
    params: { api_key: API_KEY, language: "en-US" },
  });
  return res.data.results ?? [];
};

export const fetchTvRecommendations = async (
  tvId: number,
): Promise<TVShow[]> => {
  const res = await axios.get(`${BASE_URL}/tv/${tvId}/recommendations`, {
    params: { api_key: API_KEY, language: "en-US" },
  });
  return res.data.results ?? [];
};
