import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import themeReducer from "./themeSlice";
import tvWatchReducer from "./tvWatchSlice";

export const store = configureStore({
    reducer: {
        favorites: favoritesReducer,
        theme: themeReducer,
        tvWatch: tvWatchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
