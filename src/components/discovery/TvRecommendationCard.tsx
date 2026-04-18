import { Box, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import type { TVShow } from '../../types/show.type';
import { backdropUrl, posterUrl } from '../../lib/mediaUrls';

type Props = {
    show: TVShow;
    genreLine: string;
    detailsLabel: string;
};

const TvRecommendationCard = ({ show, genreLine, detailsLabel }: Props) => {
    const bg =
        show.backdrop_path != null
            ? backdropUrl(show.backdrop_path, 'w780')
            : posterUrl(show.poster_path, 'w500');

    return (
        <Box
            sx={{
                flex: '0 0 300px',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '16 / 10',
                minHeight: 180,
            }}
        >
            <Box
                component="img"
                src={bg ?? posterUrl(show.poster_path, 'w500')}
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
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}
            >
                <Typography
                    sx={{
                        color: '#fff',
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        mb: 0.5,
                    }}
                >
                    {show.original_name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)', mb: 2 }}>
                    {genreLine}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                        component={Link}
                        to={`/tv/${show.id}`}
                        size="small"
                        sx={{
                            bgcolor: '#fff',
                            color: '#111',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            fontSize: '0.65rem',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            '&:hover': { bgcolor: '#f1f5f9' },
                        }}
                    >
                        {detailsLabel}
                    </Button>
                    <IconButton
                        component={Link}
                        to={`/tv/${show.id}`}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            width: 36,
                            height: 36,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                        }}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default TvRecommendationCard;
