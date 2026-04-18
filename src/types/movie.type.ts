export type Movie = {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids?: number[];
};

import type { TVShowFavorite } from "./show.type";

export type FavoritesState = {
    movies: Movie[];
    tvShows: TVShowFavorite[];
};
