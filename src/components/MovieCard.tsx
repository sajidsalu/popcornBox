import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie.type';

interface Props {
    movie: Movie;
}

const MovieCard = ({ movie }: Props) => {
    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
            <Card
                sx={{
                    width: 200,
                    height: 360,
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

                <CardContent sx={{ p: 1 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                            fontSize: '0.95rem',
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // limit to 2 lines
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: 40, // reserve space for 2 lines
                        }}
                    >
                        {movie.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {movie.release_date?.split('-')[0]}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default MovieCard;
