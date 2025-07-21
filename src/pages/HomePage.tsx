import { useQuery } from '@tanstack/react-query';
import {
    fetchTrendingMovies,
    fetchFanFavorites,
    fetchComingSoon
} from '../api/movieService';
import { Box, Typography } from '@mui/material';
import HorizontalListSection from '../components/HorizontalList';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types/movie.type';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
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

    return (
        <Box sx={{ px: 4, mt: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={3}>
                {t("homePage.title")}
            </Typography>

            <HorizontalListSection title={t("homePage.top10ThisWeek")}>
                {trending.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </HorizontalListSection>

            <HorizontalListSection title={t("homePage.fanFavorites")}>
                {fanFavorites.map((movie: Movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </HorizontalListSection>

            <HorizontalListSection title={t("homePage.comingSoonToTheatres")}>
                {comingSoon.map((movie: Movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </HorizontalListSection>
        </Box>
    );
};

export default HomePage;
