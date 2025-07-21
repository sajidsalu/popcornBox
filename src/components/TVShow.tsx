import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export type TVShow = {
    id: number;
    original_name: string;
    vote_count: number;
    poster_path: string;
    first_air_date?: string;
    original_language: string;
    vote_average: number;
};

interface Props {
    show: TVShow;
};

const TVShowCard = ({ show }: Props) => {
    const imageUrl = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <Link to={`/tv/${show.id}`} style={{ textDecoration: 'none' }}>
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
                    alt={show.original_name}
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
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: 40,
                        }}
                    >
                        {show.original_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {show.first_air_date?.split('-')[0] ?? ''}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default TVShowCard;
