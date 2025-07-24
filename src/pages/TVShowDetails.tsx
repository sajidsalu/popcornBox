import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Grid, Chip, IconButton } from '@mui/material';
import { fetchTvShowDetails } from '../api/tvService';
import type { TVShowDetails } from '../types/show.type';
import PopcornLoader from '../components/Loader/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TvShowDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: show, isLoading, isError } = useQuery<TVShowDetails>({
        queryKey: ['tvShowDetails', id],
        queryFn: () => fetchTvShowDetails(id!),
        enabled: !!id,
    });

    if (isLoading) return <PopcornLoader />;

    if (isError || !show) return <Typography>Error loading show.</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }} aria-label="Go back" color="inherit">
                <ArrowBackIcon />
            </IconButton>

            <Grid container spacing={4}>
                <Grid >
                    <img
                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                        alt={show.name}
                        style={{ width: '100%', borderRadius: 8 }}
                    />
                </Grid>
                <Grid>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        {show.name}
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        {show.first_air_date} | {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''} | {show.number_of_episodes} Episodes
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
                        {show.genres.map((genre: { id: number; name: string }) => (
                            <Chip key={genre.id} label={genre.name} color="primary" variant="outlined" />
                        ))}
                    </Box>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {show.overview}
                    </Typography>

                    {show.vote_average && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            ⭐ Rating: {show.vote_average.toFixed(1)} / 10
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default TvShowDetailsPage;
