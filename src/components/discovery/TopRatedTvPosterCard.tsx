import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { TVShow } from '../../types/show.type';
import { posterUrl } from '../../lib/mediaUrls';

type Props = {
    show: TVShow;
    genreLabel: string;
};

const TopRatedTvPosterCard = ({ show, genreLabel }: Props) => {
    const rating = show.vote_average?.toFixed(1) ?? '—';

    return (
        <Box
            component={Link}
            to={`/tv/${show.id}`}
            sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '3 / 4',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                '&:hover img': { transform: 'scale(1.08)' },
            }}
        >
            <Box
                component="img"
                src={posterUrl(show.poster_path, 'w500')}
                alt={show.original_name}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 35%, rgba(17,19,28,0.95) 100%)',
                }}
            />
            <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography
                        variant="caption"
                        sx={{
                            bgcolor: 'rgba(234, 179, 8, 0.95)',
                            color: '#111',
                            fontWeight: 800,
                            px: 0.75,
                            py: 0.15,
                            borderRadius: 0.5,
                            fontSize: '0.65rem',
                        }}
                    >
                        {rating}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem' }}>
                        {genreLabel}
                    </Typography>
                </Box>
                <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ color: '#fff', fontFamily: '"Manrope", sans-serif', lineHeight: 1.2 }}
                >
                    {show.original_name}
                </Typography>
            </Box>
        </Box>
    );
};

export default TopRatedTvPosterCard;
