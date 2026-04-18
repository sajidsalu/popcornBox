import { Box, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie.type';
import { backdropUrl, posterUrl } from '../../lib/mediaUrls';
import { layoutTokens } from '../../theme/layoutTokens';

type Props = {
    movie: Movie;
    subtitle: string;
    detailsLabel: string;
};

const RecommendationBannerCard = ({ movie, subtitle, detailsLabel }: Props) => {
    const bg =
        backdropUrl(movie.backdrop_path ?? null, 'w1280') ??
        posterUrl(movie.poster_path, 'w500');

    return (
        <Box
            sx={{
                position: 'relative',
                borderRadius: `${layoutTokens.radius.card}px`,
                overflow: 'hidden',
                minHeight: 220,
                display: 'flex',
                alignItems: 'flex-end',
            }}
        >
            <Box
                component="img"
                src={bg}
                alt=""
                sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(10,11,20,0.92) 0%, rgba(10,11,20,0.45) 55%, transparent 100%)',
                }}
            />
            <Box sx={{ position: 'relative', p: 3, maxWidth: { xs: '100%', md: '55%' } }}>
                <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: '#fff', mb: 0.5, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
                >
                    {movie.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 2 }}>
                    {subtitle}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                        component={Link}
                        to={`/movie/${movie.id}`}
                        variant="contained"
                        size="small"
                        sx={{
                            bgcolor: '#fff',
                            color: '#0f172a',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            letterSpacing: '0.08em',
                            borderRadius: 2,
                            px: 2,
                            '&:hover': { bgcolor: '#f1f5f9' },
                        }}
                    >
                        {detailsLabel}
                    </Button>
                    <IconButton
                        component={Link}
                        to={`/movie/${movie.id}`}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.12)',
                            color: '#fff',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        }}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default RecommendationBannerCard;
