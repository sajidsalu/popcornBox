import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import HorizontalListSection from '../components/HorizontalList';
import { useTranslation } from 'react-i18next';
import { fetchPopularTvShows, fetchTopRatedTvShows, fetchAiringTodayTv } from '../api/tvService';
import TVShowCard, { type TVShow } from '../components/TVShow';

const TvShowsPage = () => {
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
        <Box sx={{ px: 4, mt: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={3}>
                TV Shows
            </Typography>

            <HorizontalListSection title="Popular Shows">
                {popular?.map((tv: TVShow) => (
                    <TVShowCard key={tv.id} show={tv} />
                ))}
            </HorizontalListSection>

            <HorizontalListSection title="Top Rated Shows">
                {topRated?.map((tv: TVShow) => (
                    <TVShowCard key={tv.id} show={tv} />
                ))}
            </HorizontalListSection>

            <HorizontalListSection title="Airing Today">
                {airingToday?.map((tv: TVShow) => (
                    <TVShowCard key={tv.id} show={tv} />
                ))}
            </HorizontalListSection>
        </Box>
    );
};

export default TvShowsPage;
