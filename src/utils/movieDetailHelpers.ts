/** US theatrical certification from TMDB append_to_response=release_dates */
export function getUsCertification(releaseDates: unknown): string | null {
    if (!releaseDates || typeof releaseDates !== 'object') return null;
    const results = (releaseDates as { results?: { iso_3166_1: string; release_dates: { certification: string }[] }[] })
        .results;
    if (!results?.length) return null;
    const us = results.find((r) => r.iso_3166_1 === 'US');
    if (!us?.release_dates?.length) return null;
    const withCert = us.release_dates.find((d) => d.certification);
    return withCert?.certification ?? us.release_dates[0]?.certification ?? null;
}

export function formatVoteCount(n: number): string {
    if (!Number.isFinite(n) || n < 0) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(Math.round(n));
}

export function formatUsdCompact(n: number): string {
    if (!Number.isFinite(n) || n <= 0) return '—';
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(3).replace(/\.?0+$/, '')} Billion`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')} Million`;
    return `$${n.toLocaleString()}`;
}
