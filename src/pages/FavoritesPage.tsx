import { useSelector } from 'react-redux';
import { Grid, Container, Typography } from '@mui/material';
import MovieCard from '../components/MovieCard';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store/store';

const FavoritesPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.movies);
  const { t } = useTranslation();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('favorites')}
      </Typography>

      {favorites.length === 0 ? (
        <Typography>{t('noResults')}</Typography>
      ) : (
        <Grid container spacing={2}>
          {favorites.map((movie, index) => (
            <Grid key={movie.id}>
              <MovieCard movie={movie} rank={index} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;
