import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Typography } from '@mui/material';
import {
    fetchTvShowDetails,
    fetchTvCredits,
    fetchSimilarTvShows,
} from '../../../api/tvService';
import type { TVShowDetails } from '../../../types/show.type';
import PopcornLoader from '../../../components/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { addTvFavorite, removeTvFavorite } from '../../../store/favoritesSlice';
import { useTranslation } from 'react-i18next';
import SeriesHero from '../../../components/tv-details/SeriesHero';
import SeriesSeasonsEpisodesSection from '../../../components/tv-details/SeriesSeasonsEpisodesSection';
import SeriesCastCarousel from '../../../components/tv-details/SeriesCastCarousel';
import SeriesSimilarGrid from '../../../components/tv-details/SeriesSimilarGrid';
import SeriesTriviaCard from '../../../components/tv-details/SeriesTriviaCard';
import SeriesNotesCard from '../../../components/tv-details/SeriesNotesCard';
import SeriesReviewsCard from '../../../components/tv-details/SeriesReviewsCard';
import { seriesUi } from '../../../components/tv-details/seriesUi';

const EPISODES_ANCHOR = 'series-episodes';

const TVShowDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: show, isLoading, isError } = useQuery<TVShowDetails>({
        queryKey: ['tvShowDetails', id],
        queryFn: () => fetchTvShowDetails(id!),
        enabled: !!id,
    });

    const { data: credits } = useQuery({
        queryKey: ['tvCredits', show?.id],
        queryFn: () => fetchTvCredits(show!.id),
        enabled: !!show?.id,
    });

    const { data: similar = [] } = useQuery({
        queryKey: ['tvSimilar', id],
        queryFn: () => fetchSimilarTvShows(id!),
        enabled: !!id,
    });

    const tvFavorites = useSelector((state: RootState) => state.favorites.tvShows);
    const isFavorite = show ? tvFavorites.some((s) => s.id === show.id) : false;

    const seasons = useMemo(
        () => (show?.seasons ?? []).filter((s) => s.episode_count > 0),
        [show?.seasons]
    );

    const latestSeasonNumber = useMemo(() => {
        if (!seasons.length) return null;
        return Math.max(...seasons.map((s) => s.season_number));
    }, [seasons]);

    const handleToggleFavorite = () => {
        if (!show) return;
        if (isFavorite) {
            dispatch(removeTvFavorite(show.id));
        } else {
            dispatch(
                addTvFavorite({
                    id: show.id,
                    name: show.name,
                    poster_path: show.poster_path,
                })
            );
        }
    };

    const scrollToEpisodes = () => {
        const el = document.getElementById(EPISODES_ANCHOR);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (isLoading) {
        return (
            <Box sx={{ bgcolor: seriesUi.surface, minHeight: '60vh' }}>
                <PopcornLoader />
            </Box>
        );
    }

    if (isError || !show) {
        return (
            <Typography color="error" sx={{ p: 4 }}>
                {t('tvShow.errorLoad')}
            </Typography>
        );
    }

    const cast = credits?.cast ?? [];

    return (
        <Box sx={{ bgcolor: seriesUi.surface, pb: 6 }}>
            <SeriesHero
                show={show}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onWatchLatest={scrollToEpisodes}
                latestSeasonNumber={latestSeasonNumber}
            />

            <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <SeriesSeasonsEpisodesSection
                            show={show}
                            seasons={seasons}
                            sectionId={EPISODES_ANCHOR}
                        />
                        <SeriesCastCarousel cast={cast} />
                        <SeriesSimilarGrid shows={similar} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <SeriesTriviaCard />
                        <SeriesNotesCard showId={show.id} />
                        <SeriesReviewsCard />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default TVShowDetailsPage;
