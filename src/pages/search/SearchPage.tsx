import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { searchMulti } from '../../api/searchService';
import { mapMultiToDisplay, getCardImageUrl } from '../../components/search/searchMappers';
import type { SearchDisplayItem } from '../../components/search/searchMappers';

function hitHref(item: SearchDisplayItem): string {
    if (item.mediaType === 'movie') return `/movie/${item.id}`;
    if (item.mediaType === 'tv') return `/tv/${item.id}`;
    return `/person/${item.id}`;
}

const SearchPage = () => {
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const q = params.get('q')?.trim() ?? '';

    const { data: raw = [], isLoading, isError } = useQuery({
        queryKey: ['searchMulti', q, 'page'],
        queryFn: () => searchMulti(q, 1),
        enabled: q.length >= 2,
    });

    const items = mapMultiToDisplay(raw);

    if (q.length < 2) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography color="text.secondary">{t('search.minChars')}</Typography>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography color="error">{t('search.error')}</Typography>
            </Container>
        );
    }

    if (items.length === 0) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {t('search.resultsFor', { q })}
                </Typography>
                <Typography color="text.secondary">{t('search.noResults')}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, maxWidth: 1200 }}>
            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontFamily: '"Manrope", sans-serif' }}>
                {t('search.resultsFor', { q })}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {items.map((item) => (
                    <Grid key={`${item.mediaType}-${item.id}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            component={Link}
                            to={hitHref(item)}
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={getCardImageUrl(item)}
                                alt=""
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    {item.title}
                                </Typography>
                                <Chip
                                    size="small"
                                    label={t(`search.badge.${item.mediaType}`)}
                                    sx={{ mr: 1, mb: 1, fontWeight: 700 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {item.subtitle}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SearchPage;
