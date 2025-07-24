import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie.type';
import { Star } from '@mui/icons-material';
import WatchTrailerButton from './WatchTrailerButton';

interface Props {
    movie: Movie;
    rank: number;
}

const MovieCard = ({ movie, rank }: Props) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const rating = movie.vote_average?.toFixed(1);

    return (
        <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
            <Card
                sx={{
                    width: 220,
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    overflow: 'hidden',
                    flexShrink: 0,
                }}
            >
                <CardMedia
                    component="img"
                    height="280"
                    image={imageUrl}
                    alt={movie.title}
                    sx={{ objectFit: 'cover' }}
                />

                <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ color: '#f5c518', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={500}>
                            {rating}
                        </Typography>
                    </Box>

                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                            fontSize: '0.9rem',
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {rank ? `${rank}. ${movie.title}` : movie.title}
                    </Typography>

                    <WatchTrailerButton movieId={movie.id.toString()} />
                </CardContent>
            </Card>
        </Link>
    );
};

export default MovieCard;
