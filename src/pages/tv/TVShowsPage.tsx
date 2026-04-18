import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import HorizontalListSection from '../../components/HorizontalList';
import { fetchPopularTvShows, fetchTopRatedTvShows, fetchAiringTodayTv } from '../../api/tvService';
import TVShowCard from '../../components/TVShow';
import type { TVShow } from '../../types/show.type';
import { useTranslation } from 'react-i18next';

const TVShowsPage = () => {
    const { t } = useTranslation();

    const { data: popular = [] } = useQuery({
        queryKey: ['popularTv'],
        queryFn: fetchPopularTvShows,
    });

    const { data: topRated = [] } = useQuery({
        queryKey: ['topRatedTv'],
        queryFn: fetchTopRatedTvShows,
    });

    const { data: airingToday = [] } = useQuery({
        queryKey: ['airingToday'],
        queryFn: fetchAiringTodayTv,
    });

    return (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1400, mx: 'auto' }}>
            <Typography variant="h4" fontWeight={700} mb={3}>
                {t('tvPage.title')}
            </Typography>

            <HorizontalListSection title={t('tvPage.popular')}>
                {popular?.map((tv: TVShow) => (
                    <TVShowCard key={tv.id} show={tv} />
                ))}
            </HorizontalListSection>

            <HorizontalListSection title={t('tvPage.topRated')}>
                {topRated?.map((tv: TVShow) => (
                    <TVShowCard key={tv.id} show={tv} />
                ))}
            </HorizontalListSection>

            <HorizontalListSection title={t('tvPage.airingToday')}>
                {airingToday?.map((tv: TVShow) => (
                    <TVShowCard key={tv.id} show={tv} />
                ))}
            </HorizontalListSection>
        </Box>
    );
};

export default TVShowsPage;
