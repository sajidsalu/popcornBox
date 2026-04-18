import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { TVShow } from '../../types/show.type';
import { posterUrl } from '../../lib/mediaUrls';
import { seriesUi } from './seriesUi';
import { useTranslation } from 'react-i18next';

type Props = {
    shows: TVShow[];
};

const SeriesSimilarGrid = ({ shows }: Props) => {
    const { t } = useTranslation();
    if (!shows.length) return null;

    return (
        <Box sx={{ mt: 6 }}>
            <Box sx={{ mb: 3 }}>
                <Typography
                    sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 900,
                        fontSize: '1.75rem',
                        color: seriesUi.onSurface,
                    }}
                >
                    {t('tvShowDetail.similarTitles')}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: seriesUi.outline,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        mt: 0.5,
                        display: 'block',
                    }}
                >
                    {t('tvShowDetail.similarSubtitle')}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: 3,
                }}
            >
                {shows.slice(0, 4).map((s) => (
                    <Box
                        key={s.id}
                        component={Link}
                        to={`/tv/${s.id}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                aspectRatio: '2 / 3',
                                borderRadius: 2,
                                overflow: 'hidden',
                                mb: 1.5,
                                '&:hover img': { transform: 'scale(1.05)' },
                            }}
                        >
                            <Box
                                component="img"
                                src={posterUrl(s.poster_path, 'w500')}
                                alt={s.original_name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.4s',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'rgba(0,0,0,0.55)',
                                    backdropFilter: 'blur(8px)',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, fontSize: '0.65rem' }}>
                                    {s.vote_average?.toFixed(1) ?? '—'}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography fontWeight={800} variant="body2">
                            {s.original_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {t('tvShowDetail.similarMeta')}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SeriesSimilarGrid;
