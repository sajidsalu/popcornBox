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
      append_to_response: 'release_dates',
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

export type MovieCreditsResult = {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
  }[];
};

export const fetchMovieCredits = async (movieId: number): Promise<MovieCreditsResult> => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
    params: { api_key: apiKey, language: 'en-US' },
  });
  return response.data;
};

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export type WatchProvidersResult = {
  results: Record<
    string,
    {
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    }
  >;
};

export const fetchMovieWatchProviders = async (
  movieId: number,
): Promise<WatchProvidersResult> => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/watch/providers`, {
    params: { api_key: apiKey },
  });
  return response.data;
};

export const fetchMovieRecommendations = async (movieId: number): Promise<Movie[]> => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/recommendations`, {
    params: { api_key: apiKey, language: 'en-US' },
  });
  return response.data.results.slice(0, 8);
};

export type GenreItem = { id: number; name: string };

export const fetchMovieGenreList = async (): Promise<GenreItem[]> => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: { api_key: apiKey, language: 'en-US' },
  });
  return response.data.genres;
};

export type DiscoverMovieParams = {
  page?: number;
  sortBy?: string;
  genreIds?: number[];
  yearMin?: number;
  yearMax?: number;
  minVoteAverage?: number;
  watchProviderIds?: number[];
  watchRegion?: string;
};

export type DiscoverMovieResponse = {
  results: Movie[];
  totalPages: number;
  page: number;
  totalResults: number;
};

/** TMDB discover/movie with filters (region defaults to US for watch providers). */
export async function discoverMovies(
  params: DiscoverMovieParams,
): Promise<DiscoverMovieResponse> {
  const {
    page = 1,
    sortBy = 'popularity.desc',
    genreIds = [],
    yearMin = 1990,
    yearMax = 2024,
    minVoteAverage = 0,
    watchProviderIds = [],
    watchRegion = 'US',
  } = params;

  const query: Record<string, string | number | boolean> = {
    api_key: apiKey,
    language: 'en-US',
    page,
    sort_by: sortBy,
    include_adult: false,
    include_video: false,
    'primary_release_date.gte': `${yearMin}-01-01`,
    'primary_release_date.lte': `${yearMax}-12-31`,
    watch_region: watchRegion,
  };

  if (genreIds.length > 0) {
    query.with_genres = genreIds.join(',');
  }
  if (minVoteAverage > 0) {
    query['vote_average.gte'] = minVoteAverage;
    query['vote_count.gte'] = 80;
  }
  if (watchProviderIds.length > 0) {
    query.with_watch_providers = watchProviderIds.join('|');
  }

  const response = await axios.get(`${BASE_URL}/discover/movie`, { params: query });
  const raw = response.data.results as Record<string, unknown>[];
  const results: Movie[] = raw.map((m) => ({
    id: m.id as number,
    title: (m.title as string) ?? '',
    poster_path: (m.poster_path as string) ?? '',
    backdrop_path: (m.backdrop_path as string) ?? null,
    overview: (m.overview as string) ?? '',
    release_date: (m.release_date as string) ?? '',
    vote_average: (m.vote_average as number) ?? 0,
    genre_ids: m.genre_ids as number[] | undefined,
  }));

  return {
    results,
    totalPages: response.data.total_pages as number,
    page: response.data.page as number,
    totalResults: response.data.total_results as number,
  };
}

/** Unique streaming providers available for movies in a region (for filter checkboxes). */
export async function fetchMovieWatchProvidersCatalog(region = 'US') {
  const response = await axios.get(`${BASE_URL}/watch/providers/movie`, {
    params: { api_key: apiKey },
  });
  const regionData = response.data.results?.[region] as
    | { flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[] }
    | undefined;
  if (!regionData) return [] as WatchProvider[];
  const merged = [
    ...(regionData.flatrate ?? []),
    ...(regionData.rent ?? []),
    ...(regionData.buy ?? []),
  ];
  const seen = new Set<number>();
  const out: WatchProvider[] = [];
  for (const p of merged) {
    if (seen.has(p.provider_id)) continue;
    seen.add(p.provider_id);
    out.push(p);
  }
  return out;
}