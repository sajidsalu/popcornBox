import type { FavoritesState, Movie } from "../types/movie.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
const initialState: FavoritesState ={
    movies: [],
};

const favoritesSlice = createSlice({
    name:"favorites",
    initialState,
    reducers:{
        addFavorite: (state, action: PayloadAction<Movie>)=>{
            const exists = state.movies.find((movie)=> movie.id === action.payload.id);
            if(!exists){
                state.movies.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<number>)=>{
            state.movies = state.movies.filter((movie)=> movie.id !== action.payload);
        },
    },
});

export const { addFavorite, removeFavorite} = favoritesSlice.actions;
export default favoritesSlice.reducer;