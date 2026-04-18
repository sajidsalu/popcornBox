/** List card / API list item (popular, etc.) */
export type TVShow = {
  id: number;
  original_name: string;
  vote_count: number;
  poster_path: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  original_language: string;
  vote_average: number;
};

export type TVShowFavorite = {
  id: number;
  name: string;
  poster_path: string | null;
};

export type TVSeasonSummary = {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
};

export type TVNetwork = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

export type TVShowDetails = {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  tagline?: string;
  status?: string;
  vote_average: number;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  seasons: TVSeasonSummary[];
  networks?: TVNetwork[];
};

export type TVEpisode = {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string | null;
  /** Minutes; often null from list endpoint */
  runtime?: number | null;
  /** TMDB community average (0–10), when available */
  vote_average?: number;
};

export type TVSeasonDetails = {
  id: number;
  name: string;
  season_number: number;
  episodes: TVEpisode[];
};

/** Key format: `${seasonNumber}_${episodeNumber}` */
export type EpisodeWatchKey = string;
