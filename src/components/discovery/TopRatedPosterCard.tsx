import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie.type';
import { posterUrl } from '../../lib/mediaUrls';
import { layoutTokens } from '../../theme/layoutTokens';

type Props = {
    movie: Movie;
    genreLabel: string;
};

const TopRatedPosterCard = ({ movie, genreLabel }: Props) => {
    const rating = movie.vote_average?.toFixed(1) ?? '—';

    return (
        <Box
            component={Link}
            to={`/movie/${movie.id}`}
            sx={{
                position: 'relative',
                borderRadius: `${layoutTokens.radius.card}px`,
                overflow: 'hidden',
                aspectRatio: '2 / 3',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
            }}
        >
            <Box
                component="img"
                src={posterUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(10,11,20,0.95) 100%)',
                }}
            />
            <Box sx={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'inline-block',
                        bgcolor: 'rgba(234, 179, 8, 0.95)',
                        color: '#111',
                        fontWeight: 800,
                        px: 0.75,
                        py: 0.15,
                        borderRadius: 1,
                        mb: 0.5,
                    }}
                >
                    {rating}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block' }}>
                    {genreLabel}
                </Typography>
                <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ color: '#fff', lineHeight: 1.2, mt: 0.25 }}
                >
                    {movie.title}
                </Typography>
            </Box>
        </Box>
    );
};

export default TopRatedPosterCard;
