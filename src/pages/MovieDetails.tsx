import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieById } from '../api/movieService';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PopcornLoader from '../components/Loader/Loader';
import WatchTrailerButton from '../components/WatchTrailerButton';

const MovieDetails = () => {
  const { id } = useParams();
  const movieId = parseInt(id || '0');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.movies);
  const isFavorite = favorites.some((m) => m.id === movieId);

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieById(movieId),
  });

  console.log("movie", movie);
  const handleToggleFavorite = () => {
    if (!movie) return;
    isFavorite ? dispatch(removeFavorite(movie.id)) : dispatch(addFavorite(movie));
  };

  if (isLoading) return <PopcornLoader />;
  if (isError || !movie) return <Typography color="error">Failed to load movie details.</Typography>;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container sx={{ pt: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }} aria-label="Go back" color="inherit">
          <ArrowBackIcon />
        </IconButton>

        {/* Top section: poster + details */}
        <Box display="flex" gap={4} flexWrap="wrap">
          <Box>
            <img src={posterUrl} alt={movie.title} width={250} style={{ borderRadius: 12 }} />
          </Box>

          <Box flex="1">
            <Typography variant="h3" gutterBottom color="primary.main">{movie.title}</Typography>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Typography variant="subtitle1" color="primary.main">
                {movie.release_date?.split('-')[0]} • {movie.runtime} min • ⭐ {movie.vote_average.toFixed(1)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              {movie.genres?.map((genre: any) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  sx={{ backgroundColor: '#333', color: '#fff' }}
                />
              ))}
            </Stack>

            <Typography variant="body1" mb={2} color="primary.main">{movie.overview}</Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <WatchTrailerButton movieId={String(movie.id)} />

              <Button
                variant={isFavorite ? 'outlined' : 'contained'}
                onClick={handleToggleFavorite}
                sx={{ textTransform: 'none' }}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4, backgroundColor: '#333' }} />

        {/* Crew Info */}
        <Box>
          {movie.director && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Director:</strong> {movie.director}
            </Typography>
          )}
          {movie.writers && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Writers:</strong> {movie.writers.join(', ')}
            </Typography>
          )}
          {movie.cast && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Stars:</strong> {movie.cast.slice(0, 3).join(', ')}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default MovieDetails;
