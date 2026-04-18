import type { MultiSearchRaw } from '../../api/searchService';

export type SearchDisplayItem = {
    id: number;
    mediaType: 'movie' | 'tv' | 'person';
    title: string;
    subtitle: string;
    imagePath: string | null;
};

function posterUrl(path: string | null, profile: boolean): string {
    if (!path) return '';
    const size = profile ? 'w185' : 'w92';
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function mapMultiToDisplay(items: MultiSearchRaw[]): SearchDisplayItem[] {
    return items.map((item) => {
        if (item.media_type === 'movie') {
            const year = item.release_date?.slice(0, 4) ?? '—';
            return {
                id: item.id,
                mediaType: 'movie',
                title: item.title,
                subtitle: year,
                imagePath: item.poster_path,
            };
        }
        if (item.media_type === 'tv') {
            const year = item.first_air_date?.slice(0, 4) ?? '—';
            return {
                id: item.id,
                mediaType: 'tv',
                title: item.name,
                subtitle: year,
                imagePath: item.poster_path,
            };
        }
        return {
            id: item.id,
            mediaType: 'person',
            title: item.name,
            subtitle: item.known_for_department ?? '',
            imagePath: item.profile_path,
        };
    });
}

export function getThumbUrl(item: SearchDisplayItem): string {
    if (!item.imagePath) {
        return 'https://via.placeholder.com/92x138?text=%20';
    }
    const profile = item.mediaType === 'person';
    return posterUrl(item.imagePath, profile);
}

/** Larger image for cards (posters + profiles). */
export function getCardImageUrl(item: SearchDisplayItem): string {
    if (!item.imagePath) {
        return 'https://via.placeholder.com/342x513?text=%20';
    }
    return `https://image.tmdb.org/t/p/w342${item.imagePath}`;
}
