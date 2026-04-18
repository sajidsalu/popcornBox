import { useQuery } from '@tanstack/react-query';
import { Box, Button, Grid, Typography } from '@mui/material';
import {
    fetchTrendingMovies,
    fetchFanFavorites,
    fetchComingSoon,
    fetchPopularMovies,
    fetchMovieRecommendations,
} from '../../api/movieService';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { Movie } from '../../types/movie.type';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/discovery/SectionHeader';
import ContinueWatchingCard from '../../components/discovery/ContinueWatchingCard';
import UpcomingWeekStrip from '../../components/discovery/UpcomingWeekStrip';
import RecommendationBannerCard from '../../components/discovery/RecommendationBannerCard';
import PopularShowRow from '../../components/discovery/PopularShowRow';
import TopRatedPosterCard from '../../components/discovery/TopRatedPosterCard';

const ContinueRow = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 1,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { height: 6 },
        }}
    >
        {children}
    </Box>
);

const MoviesHomePage = () => {
    const { t } = useTranslation();
    const tvWatch = useSelector((state: RootState) => state.tvWatch.entries);

    const { data: trending = [] } = useQuery({
        queryKey: ['trending'],
        queryFn: fetchTrendingMovies,
    });

    const { data: fanFavorites = [] } = useQuery({
        queryKey: ['fanFavorites'],
        queryFn: fetchFanFavorites,
    });

    const { data: comingSoon = [] } = useQuery({
        queryKey: ['comingSoon'],
        queryFn: fetchComingSoon,
    });

    const { data: popular = [] } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () => fetchPopularMovies(),
    });

    const seedId = trending[0]?.id;
    const { data: recommendations = [] } = useQuery({
        queryKey: ['recommendations', seedId],
        queryFn: () => fetchMovieRecommendations(seedId!),
        enabled: seedId != null,
    });

    const weekPosters = useMemo(
        () =>
            comingSoon.slice(0, 7).map((m: Movie) => ({
                poster_path: m.poster_path,
                title: m.title,
            })),
        [comingSoon]
    );

    const continueItems = useMemo(() => {
        const fromTv = Object.values(tvWatch).map((entry) => {
            const keys = Object.keys(entry.watchedEpisodes);
            const last = keys.sort().pop();
            let badge: string | undefined;
            if (last) {
                const [s, e] = last.split('_');
                badge = `S${s} • E${e}`;
            }
            const progress = Math.min(95, keys.length * 9 + 10);
            return {
                key: `tv-${entry.id}`,
                href: `/tv/${entry.id}`,
                title: entry.name,
                posterPath: entry.poster_path,
                progress,
                badge,
                remainingLabel: t('homePage.episodesTracked', { count: keys.length }),
            };
        });

        const need = Math.max(0, 4 - fromTv.length);
        const fromMovies = trending.slice(0, need).map((m) => ({
            key: `mv-${m.id}`,
            href: `/movie/${m.id}`,
            title: m.title,
            posterPath: m.poster_path,
            progress: 22 + (m.id % 65),
            badge: undefined as string | undefined,
            remainingLabel: t('homePage.minutesRemaining', { n: 12 + (m.id % 40) }),
        }));

        return [...fromTv, ...fromMovies].slice(0, 4);
    }, [tvWatch, trending, t]);

    const heroReco = recommendations[0] ?? fanFavorites[0] ?? trending[1];
    const becauseTitle = trending[0]?.title
        ? t('homePage.becauseYouWatched', { title: trending[0].title })
        : t('homePage.recommendations');

    return (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1400, mx: 'auto' }}>
            <SectionHeader
                title={t('homePage.continueWatching')}
                subtitle={t('homePage.resumeSession')}
            />
            {continueItems.length === 0 ? (
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    {t('homePage.continueEmpty')}
                </Typography>
            ) : (
                <ContinueRow>
                    {continueItems.map((item) => (
                        <ContinueWatchingCard
                            key={item.key}
                            href={item.href}
                            title={item.title}
                            posterPath={item.posterPath}
                            progress={item.progress}
                            badge={item.badge}
                            remainingLabel={item.remainingLabel}
                        />
                    ))}
                </ContinueRow>
            )}

            <Box sx={{ mt: 5 }}>
                <UpcomingWeekStrip
                    title={t('homePage.upcomingWeek')}
                    subtitle={t('homePage.upcomingSubtitle')}
                    upcoming={weekPosters}
                />
            </Box>

            <Box sx={{ mt: 5 }}>
                <SectionHeader
                    title={becauseTitle}
                    subtitle={t('homePage.personalizedRecommendation')}
                />
                {heroReco ? (
                    <RecommendationBannerCard
                        movie={heroReco}
                        subtitle={t('homePage.recoGenreLine')}
                        detailsLabel={t('homePage.details')}
                    />
                ) : (
                    <Typography color="text.secondary">{t('homePage.noRecommendations')}</Typography>
                )}
            </Box>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <SectionHeader
                        title={t('homePage.popularShows')}
                        right={
                            <Button
                                component={Link}
                                to="/movies"
                                size="small"
                                sx={{ fontWeight: 800, letterSpacing: '0.1em' }}
                            >
                                {t('homePage.seeAll')}
                            </Button>
                        }
                    />
                    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, px: 2, py: 0.5 }}>
                        {popular.slice(0, 6).map((m: Movie, i: number) => (
                            <PopularShowRow key={m.id} movie={m} rank={i + 1} />
                        ))}
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <SectionHeader
                        title={t('homePage.topRated')}
                        right={
                            <Button
                                component={Link}
                                to="/movies"
                                size="small"
                                sx={{ fontWeight: 800, letterSpacing: '0.1em' }}
                            >
                                {t('homePage.seeAll')}
                            </Button>
                        }
                    />
                    <Grid container spacing={1.5}>
                        {fanFavorites.slice(0, 6).map((m: Movie) => (
                            <Grid key={m.id} size={{ xs: 6, sm: 4 }}>
                                <TopRatedPosterCard movie={m} genreLabel={t('homePage.auteurCinema')} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MoviesHomePage;
