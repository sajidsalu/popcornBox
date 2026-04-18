import type { FavoritesState, Movie } from "../types/movie.type";
import type { TVShowFavorite } from "../types/show.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: FavoritesState = {
    movies: [],
    tvShows: [],
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<Movie>) => {
            const exists = state.movies.find((movie) => movie.id === action.payload.id);
            if (!exists) {
                state.movies.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<number>) => {
            state.movies = state.movies.filter((movie) => movie.id !== action.payload);
        },
        addTvFavorite: (state, action: PayloadAction<TVShowFavorite>) => {
            const exists = state.tvShows.find((s) => s.id === action.payload.id);
            if (!exists) {
                state.tvShows.push(action.payload);
            }
        },
        removeTvFavorite: (state, action: PayloadAction<number>) => {
            state.tvShows = state.tvShows.filter((s) => s.id !== action.payload);
        },
    },
});

export const { addFavorite, removeFavorite, addTvFavorite, removeTvFavorite } =
    favoritesSlice.actions;
export default favoritesSlice.reducer;