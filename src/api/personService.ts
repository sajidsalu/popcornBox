import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export type PersonDetails = {
    id: number;
    name: string;
    biography: string;
    birthday: string | null;
    deathday: string | null;
    profile_path: string | null;
    known_for_department?: string;
    place_of_birth: string | null;
    popularity: number;
    also_known_as?: string[];
    homepage?: string | null;
};

/** Normalized credit for UI (cast entries from combined credits). */
export type PersonCredit = {
    id: number;
    mediaType: 'movie' | 'tv';
    title: string;
    year: string;
    character: string;
    poster_path: string | null;
    vote_average: number;
    /** ISO date for sorting (release or first air) */
    sortDate: string;
};

type RawCastItem = {
    id: number;
    media_type?: string;
    title?: string;
    name?: string;
    character?: string;
    poster_path?: string | null;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
};

export async function fetchPersonById(id: number): Promise<PersonDetails> {
    const res = await axios.get(`${BASE_URL}/person/${id}`, {
        params: { api_key: apiKey, language: 'en-US' },
    });
    return res.data;
}

function normalizeCast(cast: RawCastItem[]): PersonCredit[] {
    const seen = new Set<string>();
    const out: PersonCredit[] = [];

    for (const item of cast) {
        const mt = item.media_type;
        if (mt !== 'movie' && mt !== 'tv') continue;
        const key = `${mt}-${item.id}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const title = mt === 'movie' ? (item.title ?? '') : (item.name ?? '');
        const sortDate =
            mt === 'movie' ? (item.release_date ?? '') : (item.first_air_date ?? '');
        const year = sortDate.length >= 4 ? sortDate.slice(0, 4) : '—';

        out.push({
            id: item.id,
            mediaType: mt,
            title,
            year,
            character: item.character ?? '',
            poster_path: item.poster_path ?? null,
            vote_average: typeof item.vote_average === 'number' ? item.vote_average : 0,
            sortDate: sortDate || '0000-00-00',
        });
    }

    return out;
}

export async function fetchPersonCombinedCredits(personId: number): Promise<PersonCredit[]> {
    const res = await axios.get(`${BASE_URL}/person/${personId}/combined_credits`, {
        params: { api_key: apiKey, language: 'en-US' },
    });
    const cast = (res.data.cast ?? []) as RawCastItem[];
    return normalizeCast(cast);
}

/** Top titles for “Known for” — strongest scores first. */
export function pickKnownForCredits(all: PersonCredit[], limit = 8): PersonCredit[] {
    return [...all]
        .sort((a, b) => {
            if (b.vote_average !== a.vote_average) return b.vote_average - a.vote_average;
            return b.sortDate.localeCompare(a.sortDate);
        })
        .slice(0, limit);
}

/** Full filmography, newest first. */
export function sortFilmography(all: PersonCredit[]): PersonCredit[] {
    return [...all].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}
