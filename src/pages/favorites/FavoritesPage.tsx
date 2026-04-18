import { useSelector } from 'react-redux';
import { Grid, Container, Typography, Box } from '@mui/material';
import MovieCard from '../../components/MovieCard';
import TVShowCard from '../../components/TVShow';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import type { TVShow } from '../../types/show.type';

const FavoritesPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.movies);
  const tvFavorites = useSelector((state: RootState) => state.favorites.tvShows);
  const { t } = useTranslation();

  const mapFavoriteToCardShow = (s: (typeof tvFavorites)[0]): TVShow => ({
    id: s.id,
    original_name: s.name,
    vote_count: 0,
    poster_path: s.poster_path,
    original_language: 'en',
    vote_average: 0,
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('favorites')}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('favoritesPage.movies')}
        </Typography>
        {favorites.length === 0 ? (
          <Typography color="text.secondary">{t('favoritesPage.noMovieFavorites')}</Typography>
        ) : (
          <Grid container spacing={2}>
            {favorites.map((movie, index) => (
              <Grid key={movie.id}>
                <MovieCard movie={movie} rank={index} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          {t('favoritesPage.tvSeries')}
        </Typography>
        {tvFavorites.length === 0 ? (
          <Typography color="text.secondary">{t('favoritesPage.noTvFavorites')}</Typography>
        ) : (
          <Grid container spacing={2}>
            {tvFavorites.map((show) => (
              <Grid key={show.id}>
                <TVShowCard show={mapFavoriteToCardShow(show)} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default FavoritesPage;
