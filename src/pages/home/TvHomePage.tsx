import { useQuery } from '@tanstack/react-query';
import { Box, Button, Grid, Typography } from '@mui/material';
import {
    fetchPopularTvShows,
    fetchTopRatedTvShows,
    fetchAiringTodayTv,
    fetchTvRecommendations,
} from '../../api/tvService';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { TVShow } from '../../types/show.type';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContinueWatchingCard from '../../components/discovery/ContinueWatchingCard';
import UpcomingWeekStrip from '../../components/discovery/UpcomingWeekStrip';
import TvRecommendationCard from '../../components/discovery/TvRecommendationCard';
import PopularTvRow from '../../components/discovery/PopularTvRow';
import TopRatedTvPosterCard from '../../components/discovery/TopRatedTvPosterCard';
import { seriesUi } from '../../components/tv-details/seriesUi';

const ContinueRow = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 2,
        }}
    >
        {children}
    </Box>
);

const TvHomePage = () => {
    const { t } = useTranslation();
    const tvWatch = useSelector((state: RootState) => state.tvWatch.entries);

    const { data: popularTv = [] } = useQuery({
        queryKey: ['popularTv'],
        queryFn: fetchPopularTvShows,
    });

    const { data: topRatedTv = [] } = useQuery({
        queryKey: ['topRatedTv'],
        queryFn: fetchTopRatedTvShows,
    });

    const { data: airingToday = [] } = useQuery({
        queryKey: ['airingTodayTv'],
        queryFn: fetchAiringTodayTv,
    });

    const seedId = popularTv[0]?.id;
    const { data: tvRecommendations = [] } = useQuery({
        queryKey: ['tvRecommendations', seedId],
        queryFn: () => fetchTvRecommendations(seedId!),
        enabled: seedId != null,
    });

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
        const fromPopular = popularTv.slice(0, need).map((show) => ({
            key: `pop-${show.id}`,
            href: `/tv/${show.id}`,
            title: show.original_name,
            posterPath: show.poster_path,
            progress: 22 + (show.id % 65),
            badge: undefined as string | undefined,
            remainingLabel: t('homePage.minutesRemaining', { n: 12 + (show.id % 40) }),
        }));

        return [...fromTv, ...fromPopular].slice(0, 4);
    }, [tvWatch, popularTv, t]);

    const weekPosters = useMemo(
        () =>
            airingToday.slice(0, 7).map((s) => ({
                poster_path: s.poster_path,
                title: s.original_name,
            })),
        [airingToday]
    );

    const recoStrip = tvRecommendations.slice(0, 3);
    const becauseTitle = popularTv[0]?.original_name
        ? t('tvHome.becauseYouWatched', { title: popularTv[0].original_name })
        : t('tvHome.personalizedPick');

    return (
        <Box sx={{ bgcolor: seriesUi.surface, minHeight: '100%', px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
            <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                    <Typography
                        sx={{
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 800,
                            fontSize: { xs: '1.75rem', md: '2rem' },
                            letterSpacing: '-0.03em',
                            color: seriesUi.onSurface,
                        }}
                    >
                        {t('homePage.continueWatching')}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: seriesUi.outline,
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            mb: 0.5,
                        }}
                    >
                        {t('homePage.resumeSession')}
                    </Typography>
                </Box>

                {continueItems.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        {t('tvHome.continueEmpty')}
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

                <Box sx={{ mt: 4 }}>
                    <UpcomingWeekStrip
                        title={t('tvHome.upcomingWeek')}
                        subtitle={t('tvHome.upcomingSubtitle')}
                        upcoming={weekPosters}
                    />
                </Box>

                <Box sx={{ mt: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                        <Typography
                            sx={{
                                fontFamily: '"Manrope", sans-serif',
                                fontWeight: 800,
                                fontSize: { xs: '1.75rem', md: '2rem' },
                                letterSpacing: '-0.03em',
                            }}
                        >
                            {becauseTitle}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: seriesUi.outline,
                                fontWeight: 700,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                mb: 0.5,
                            }}
                        >
                            {t('homePage.personalizedRecommendation')}
                        </Typography>
                    </Box>
                    {recoStrip.length === 0 ? (
                        <Typography color="text.secondary">{t('tvHome.noRecommendations')}</Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                pb: 2,
                                scrollbarWidth: 'thin',
                            }}
                        >
                            {recoStrip.map((show) => (
                                <TvRecommendationCard
                                    key={show.id}
                                    show={show}
                                    genreLine={t('tvHome.recoGenreFallback')}
                                    detailsLabel={t('homePage.details')}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                <Grid container spacing={4} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                sx={{
                                    fontFamily: '"Manrope", sans-serif',
                                    fontWeight: 800,
                                    fontSize: '1.5rem',
                                }}
                            >
                                {t('homePage.popularShows')}
                            </Typography>
                            <Button
                                component={Link}
                                to="/tv"
                                size="small"
                                sx={{ fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}
                            >
                                {t('homePage.seeAll')}
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {popularTv.slice(0, 6).map((show: TVShow, i: number) => (
                                <PopularTvRow key={show.id} show={show} rank={i + 1} />
                            ))}
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                sx={{
                                    fontFamily: '"Manrope", sans-serif',
                                    fontWeight: 800,
                                    fontSize: '1.5rem',
                                }}
                            >
                                {t('homePage.topRated')}
                            </Typography>
                            <Button
                                component={Link}
                                to="/tv"
                                size="small"
                                sx={{ fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}
                            >
                                {t('homePage.seeAll')}
                            </Button>
                        </Box>
                        <Grid container spacing={2}>
                            {topRatedTv.slice(0, 2).map((show: TVShow) => (
                                <Grid key={show.id} size={{ xs: 6 }}>
                                    <TopRatedTvPosterCard show={show} genreLabel={t('tvHome.topRatedGenre')} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default TvHomePage;
