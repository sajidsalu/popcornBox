export function posterUrl(
    posterPath: string | null,
    size: 'w92' | 'w185' | 'w342' | 'w500' | 'original' = 'w500',
): string {
    if (!posterPath) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function logoUrl(path: string | null, size: 'w45' | 'w92' | 'w185' = 'w92'): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function profileUrl(path: string | null, size: 'w185' | 'h632' = 'w185'): string {
    if (!path) return 'https://via.placeholder.com/185x278?text=?';
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
