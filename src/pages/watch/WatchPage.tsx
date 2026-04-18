import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import TVShowCard from '../../components/TVShow';
import type { TVShow } from '../../types/show.type';

const WatchPage = () => {
    const { t } = useTranslation();
    const entries = useSelector((state: RootState) => state.tvWatch.entries);

    const watchedShows: TVShow[] = useMemo(() => {
        return Object.values(entries).map((entry) => ({
            id: entry.id,
            original_name: entry.name,
            vote_count: 0,
            poster_path: entry.poster_path,
            original_language: 'en',
            vote_average: 0,
        }));
    }, [entries]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                {t('watchPage.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('watchPage.subtitle')}
            </Typography>

            {watchedShows.length === 0 ? (
                <Typography color="text.secondary">{t('watchPage.empty')}</Typography>
            ) : (
                <Grid container spacing={2}>
                    {watchedShows.map((show) => (
                        <Grid key={show.id}>
                            <TVShowCard show={show} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default WatchPage;
