import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    discoverMovies,
    fetchMovieGenreList,
    fetchMovieRecommendations,
    fetchMovieWatchProvidersCatalog,
    fetchTrendingMovies,
    type WatchProvider,
} from '../../api/movieService';
import type { Movie } from '../../types/movie.type';
import type { RootState } from '../../store/store';
import { addFavorite, removeFavorite } from '../../store/favoritesSlice';
import { layoutTokens } from '../../theme/layoutTokens';
import { posterUrl } from '../../lib/mediaUrls';
import DiscoverFilters from '../../components/discover/DiscoverFilters';
import DiscoverMovieGridCard from '../../components/discover/DiscoverMovieGridCard';

const FILTER_GENRE_IDS = new Set([28, 18, 35, 99, 878, 53]);

const DEFAULT_GENRES: number[] = [878, 53];
const DEFAULT_YEAR: [number, number] = [1990, 2026];
const DEFAULT_MIN_RATING = 8;

function pickPlatformOptions(catalog: WatchProvider[]): WatchProvider[] {
    const want = [
        (p: WatchProvider) => /netflix/i.test(p.provider_name),
        (p: WatchProvider) => /prime\s*video|amazon/i.test(p.provider_name),
        (p: WatchProvider) => /disney/i.test(p.provider_name),
        (p: WatchProvider) => /^(max|hbo)/i.test(p.provider_name) || /hbo\s*max/i.test(p.provider_name),
    ];
    const out: WatchProvider[] = [];
    for (const pred of want) {
        const hit = catalog.find(pred);
        if (hit && !out.some((x) => x.provider_id === hit.provider_id)) out.push(hit);
    }
    return out.slice(0, 4);
}

function defaultProviderIdsFromCatalog(catalog: WatchProvider[]): number[] {
    const opts = pickPlatformOptions(catalog);
    const ids: number[] = [];
    const netflix = opts.find((p) => /netflix/i.test(p.provider_name));
    const disney = opts.find((p) => /disney/i.test(p.provider_name));
    if (netflix) ids.push(netflix.provider_id);
    if (disney) ids.push(disney.provider_id);
    return ids;
}

const DiscoverPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const favoriteIds = useSelector((s: RootState) => new Set(s.favorites.movies.map((m) => m.id)));

    const [genreIds, setGenreIds] = useState<number[]>(DEFAULT_GENRES);
    const [yearRange, setYearRange] = useState<[number, number]>(DEFAULT_YEAR);
    const [minRating, setMinRating] = useState(DEFAULT_MIN_RATING);
    const [providerIds, setProviderIds] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState('popularity.desc');
    const defaultsApplied = useRef(false);

    const { data: genreList = [] } = useQuery({
        queryKey: ['movieGenres'],
        queryFn: fetchMovieGenreList,
    });

    const { data: providerCatalog = [] } = useQuery({
        queryKey: ['watchProvidersCatalog', 'US'],
        queryFn: () => fetchMovieWatchProvidersCatalog('US'),
    });

    useEffect(() => {
        if (!providerCatalog.length || defaultsApplied.current) return;
        defaultsApplied.current = true;
        setProviderIds(defaultProviderIdsFromCatalog(providerCatalog));
    }, [providerCatalog]);

    const filterGenres = useMemo(
        () => genreList.filter((g) => FILTER_GENRE_IDS.has(g.id)),
        [genreList],
    );

    const platformOptions = useMemo(() => pickPlatformOptions(providerCatalog), [providerCatalog]);

    const genreMap = useMemo(() => {
        const m: Record<number, string> = {};
        genreList.forEach((g) => {
            m[g.id] = g.name;
        });
        return m;
    }, [genreList]);

    const discoverKey = useMemo(
        () => ({
            sortBy,
            genreIds: [...genreIds].sort((a, b) => a - b),
            yearMin: yearRange[0],
            yearMax: yearRange[1],
            minVoteAverage: minRating,
            watchProviderIds: [...providerIds].sort((a, b) => a - b),
        }),
        [sortBy, genreIds, yearRange, minRating, providerIds],
    );

    const {
        data: discoverData,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isError,
    } = useInfiniteQuery({
        queryKey: ['discoverMovies', discoverKey],
        queryFn: ({ pageParam }) =>
            discoverMovies({
                page: pageParam,
                sortBy,
                genreIds,
                yearMin: yearRange[0],
                yearMax: yearRange[1],
                minVoteAverage: minRating,
                watchProviderIds: providerIds,
            }),
        initialPageParam: 1,
        getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    });

    const flatResults = useMemo(
        () => discoverData?.pages.flatMap((p) => p.results) ?? [],
        [discoverData],
    );

    const { data: trending = [] } = useQuery({
        queryKey: ['trendingMoviesDiscover'],
        queryFn: fetchTrendingMovies,
    });

    const seedMovie = trending[0];
    const { data: becauseReco = [] } = useQuery({
        queryKey: ['becauseRecoDiscover', seedMovie?.id],
        queryFn: () => fetchMovieRecommendations(seedMovie!.id),
        enabled: !!seedMovie?.id,
    });

    const toggleGenre = useCallback((id: number) => {
        setGenreIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, []);

    const toggleProvider = useCallback((id: number) => {
        setProviderIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, []);

    const handleReset = useCallback(() => {
        setGenreIds([...DEFAULT_GENRES]);
        setYearRange(DEFAULT_YEAR);
        setMinRating(DEFAULT_MIN_RATING);
        setSortBy('popularity.desc');
        if (providerCatalog.length) {
            setProviderIds(defaultProviderIdsFromCatalog(providerCatalog));
        } else {
            setProviderIds([]);
        }
    }, [providerCatalog]);

    const toggleFavorite = (movie: Movie) => {
        if (favoriteIds.has(movie.id)) {
            dispatch(removeFavorite(movie.id));
        } else {
            dispatch(
                addFavorite({
                    ...movie,
                    poster_path: movie.poster_path ?? '',
                }),
            );
        }
    };

    const genreLabelFor = (m: Movie) =>
        (m.genre_ids ?? [])
            .slice(0, 2)
            .map((id) => genreMap[id])
            .filter(Boolean)
            .join(' • ')
            .toUpperCase() || '—';

    const handleSortChange = (e: { target: { value: string } }) => {
        setSortBy(e.target.value);
    };

    return (
        <Box sx={{ bgcolor: layoutTokens.main.light, minHeight: '100%', py: 3 }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
                    <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}>
                        <DiscoverFilters
                            genres={filterGenres.length ? filterGenres : genreList.slice(0, 8)}
                            selectedGenreIds={genreIds}
                            onToggleGenre={toggleGenre}
                            yearRange={yearRange}
                            onYearRangeChange={setYearRange}
                            minRating={minRating}
                            onMinRatingChange={setMinRating}
                            platformOptions={platformOptions}
                            selectedProviderIds={providerIds}
                            onToggleProvider={toggleProvider}
                            onReset={handleReset}
                        />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {seedMovie && becauseReco.length >= 1 && (
                            <Box sx={{ mb: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <AutoAwesomeIcon sx={{ color: layoutTokens.sidebar.accent }} />
                                    <Typography fontWeight={800}>
                                        {t('discover.becauseYouWatched', { title: seedMovie.title })}
                                    </Typography>
                                </Stack>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    {becauseReco.slice(0, 2).map((m) => (
                                        <Paper
                                            key={m.id}
                                            sx={{
                                                flex: 1,
                                                p: 2,
                                                borderRadius: 2,
                                                display: 'flex',
                                                gap: 2,
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={posterUrl(m.poster_path || null, 'w185')}
                                                alt=""
                                                sx={{
                                                    width: 88,
                                                    borderRadius: 2,
                                                    objectFit: 'cover',
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography fontWeight={900}>{m.title}</Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {m.release_date?.slice(0, 4)} • {genreLabelFor(m)} •{' '}
                                                    {m.vote_average?.toFixed(1)}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ mt: 1, fontWeight: 800, textTransform: 'none' }}
                                                    onClick={() => toggleFavorite(m)}
                                                >
                                                    {favoriteIds.has(m.id)
                                                        ? t('discover.inList')
                                                        : t('discover.addToList')}
                                                </Button>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                            spacing={2}
                            sx={{ mb: 2, flexWrap: 'wrap' }}
                        >
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontWeight={800}
                                    sx={{ letterSpacing: '0.12em' }}
                                >
                                    {t('discover.catalogue')}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: '"Manrope", sans-serif',
                                        fontWeight: 900,
                                        fontSize: '1.5rem',
                                    }}
                                >
                                    {t('discover.explorationResults')}
                                </Typography>
                            </Box>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel id="discover-sort">{t('discover.sortBy')}</InputLabel>
                                <Select
                                    labelId="discover-sort"
                                    label={t('discover.sortBy')}
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value="popularity.desc">{t('discover.sortPopularity')}</MenuItem>
                                    <MenuItem value="vote_average.desc">{t('discover.sortRating')}</MenuItem>
                                    <MenuItem value="primary_release_date.desc">{t('discover.sortNewest')}</MenuItem>
                                    <MenuItem value="revenue.desc">{t('discover.sortRevenue')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>

                        {isFetching && !isFetchingNextPage && flatResults.length === 0 ? (
                            <Typography color="text.secondary" sx={{ py: 6 }}>
                                {t('discover.loading')}
                            </Typography>
                        ) : isError ? (
                            <Typography color="error">{t('discover.error')}</Typography>
                        ) : flatResults.length === 0 ? (
                            <Typography color="text.secondary" sx={{ py: 4 }}>
                                {t('discover.noResults')}
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {flatResults.map((m) => (
                                    <Grid key={m.id} size={{ xs: 6, sm: 4, md: 3 }}>
                                        <DiscoverMovieGridCard
                                            movie={m}
                                            genreLabel={genreLabelFor(m)}
                                            isFavorite={favoriteIds.has(m.id)}
                                            onToggleFavorite={() => toggleFavorite(m)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {hasNextPage && flatResults.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    sx={{ px: 4, fontWeight: 800, textTransform: 'none', borderRadius: 2 }}
                                >
                                    {isFetchingNextPage ? t('discover.loading') : t('discover.showMore')}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default DiscoverPage;
