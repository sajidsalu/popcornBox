import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    mode: 'light' | 'dark';
}

const initialState: ThemeState = { mode: 'light' };

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;