import type { EpisodeWatchKey } from "../types/show.type";

export function tvEpisodeKey(season: number, episode: number): EpisodeWatchKey {
  return `${season}_${episode}`;
}
