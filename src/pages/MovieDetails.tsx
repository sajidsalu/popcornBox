import {
  Box,
  Container,
  Typography,
  Button, IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieById } from '../api/movieService';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PopcornLoader from '../components/Loader/Loader';

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

  const handleToggleFavorite = () => {
    if (!movie) return;
    isFavorite ? dispatch(removeFavorite(movie.id)) : dispatch(addFavorite(movie));
  };

  if (isLoading) return <PopcornLoader />;
  if (isError) return <Typography color="error">Failed to load movie details.</Typography>;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Container sx={{ mt: 4 }}>
      <Box mb={2}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          aria-label="Go back"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box display="flex" gap={4} flexWrap="wrap">
        <Box flexShrink={0}>
          <img src={posterUrl} alt={movie.title} width={300} />
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {movie.release_date?.split('-')[0]} | ⭐ {movie.vote_average}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {movie.overview}
          </Typography>

          {movie.genres?.length > 0 && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Genres:</strong>{' '}
              {movie.genres.map((g: any) => g.name).join(', ')}
            </Typography>
          )}

          <Button
            variant={isFavorite ? 'outlined' : 'contained'}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default MovieDetails;
