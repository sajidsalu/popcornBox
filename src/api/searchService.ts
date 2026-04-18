import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

/** Raw TMDB multi result (subset of fields we use) */
export type MultiSearchRaw =
    | {
          id: number;
          media_type: 'movie';
          title: string;
          release_date?: string;
          poster_path: string | null;
          vote_average?: number;
      }
    | {
          id: number;
          media_type: 'tv';
          name: string;
          first_air_date?: string;
          poster_path: string | null;
          vote_average?: number;
      }
    | {
          id: number;
          media_type: 'person';
          name: string;
          profile_path: string | null;
          known_for_department?: string;
      };

export async function searchMulti(query: string, page = 1): Promise<MultiSearchRaw[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const response = await axios.get(`${BASE_URL}/search/multi`, {
        params: {
            api_key: apiKey,
            query: trimmed,
            page,
            include_adult: false,
            language: 'en-US',
        },
    });

    const results = response.data.results as MultiSearchRaw[];
    return results.filter(
        (r) => r.media_type === 'movie' || r.media_type === 'tv' || r.media_type === 'person'
    );
}
