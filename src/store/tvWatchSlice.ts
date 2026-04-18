import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EpisodeWatchKey } from "../types/show.type";
import { tvEpisodeKey } from "../utils/tvWatch";

export type TVWatchEntry = {
  id: number;
  name: string;
  poster_path: string | null;
  /** Keys `${season}_${episodeNumber}` when watched */
  watchedEpisodes: Record<EpisodeWatchKey, true>;
  /** User star rating 1–5 per episode; set once per episode */
  episodeRatings: Record<EpisodeWatchKey, number>;
};

export type TVWatchState = {
  entries: Record<number, TVWatchEntry>;
};

const initialState: TVWatchState = {
  entries: {},
};

function ensureWatchEntry(
  state: TVWatchState,
  showId: number,
  name: string,
  poster_path: string | null,
) {
  if (!state.entries[showId]) {
    state.entries[showId] = {
      id: showId,
      name,
      poster_path,
      watchedEpisodes: {},
      episodeRatings: {},
    };
  } else if (!state.entries[showId].episodeRatings) {
    state.entries[showId].episodeRatings = {};
  }
}

function maybeRemoveShowEntry(state: TVWatchState, showId: number) {
  const ent = state.entries[showId];
  if (!ent) return;
  const noWatched = Object.keys(ent.watchedEpisodes).length === 0;
  const noRatings = Object.keys(ent.episodeRatings).length === 0;
  if (noWatched && noRatings) {
    delete state.entries[showId];
  }
}

const tvWatchSlice = createSlice({
  name: "tvWatch",
  initialState,
  reducers: {
    setEpisodeWatched: (
      state,
      action: PayloadAction<{
        showId: number;
        name: string;
        poster_path: string | null;
        season: number;
        episode: number;
        watched: boolean;
      }>,
    ) => {
      const { showId, name, poster_path, season, episode, watched } =
        action.payload;
      const key = tvEpisodeKey(season, episode);
      ensureWatchEntry(state, showId, name, poster_path);
      if (watched) {
        state.entries[showId].watchedEpisodes[key] = true;
      } else {
        delete state.entries[showId].watchedEpisodes[key];
      }
      maybeRemoveShowEntry(state, showId);
    },
    setSeasonWatched: (
      state,
      action: PayloadAction<{
        showId: number;
        name: string;
        poster_path: string | null;
        season: number;
        episodeNumbers: number[];
        watched: boolean;
      }>,
    ) => {
      const { showId, name, poster_path, season, episodeNumbers, watched } =
        action.payload;
      ensureWatchEntry(state, showId, name, poster_path);
      for (const ep of episodeNumbers) {
        const key = tvEpisodeKey(season, ep);
        if (watched) {
          state.entries[showId].watchedEpisodes[key] = true;
        } else {
          delete state.entries[showId].watchedEpisodes[key];
        }
      }
      maybeRemoveShowEntry(state, showId);
    },
    setEpisodeRating: (
      state,
      action: PayloadAction<{
        showId: number;
        name: string;
        poster_path: string | null;
        season: number;
        episode: number;
        rating: number;
      }>,
    ) => {
      const { showId, name, poster_path, season, episode, rating } =
        action.payload;
      const key = tvEpisodeKey(season, episode);
      const clamped = Math.min(5, Math.max(1, Math.round(rating)));
      ensureWatchEntry(state, showId, name, poster_path);
      const ratings = state.entries[showId].episodeRatings;
      if (ratings[key] != null) {
        return;
      }
      ratings[key] = clamped;
    },
  },
});

export const { setEpisodeWatched, setSeasonWatched, setEpisodeRating } =
  tvWatchSlice.actions;
export default tvWatchSlice.reducer;
