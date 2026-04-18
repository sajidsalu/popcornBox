import { Box, IconButton, Typography } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie.type';
import { posterUrl } from '../../lib/mediaUrls';
import { layoutTokens } from '../../theme/layoutTokens';

type Props = {
    movie: Movie;
    genreLabel: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    /** Minutes; omit segment if absent */
    runtimeMin?: number | null;
};

const DiscoverMovieGridCard = ({
    movie,
    genreLabel,
    isFavorite,
    onToggleFavorite,
    runtimeMin,
}: Props) => {
    const img = posterUrl(movie.poster_path || null, 'w342');
    const year = movie.release_date?.slice(0, 4) ?? '—';
    const rating = movie.vote_average?.toFixed(1) ?? '—';
    const duration =
        runtimeMin != null && runtimeMin > 0
            ? `${Math.floor(runtimeMin / 60)}H ${runtimeMin % 60}M`
            : null;

    return (
        <Box
            sx={{
                borderRadius: `${layoutTokens.radius.card}px`,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.15s, box-shadow 0.15s',
                position: 'relative',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
            }}
        >
            <Box
                component={Link}
                to={`/movie/${movie.id}`}
                sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                }}
            >
                <Box sx={{ position: 'relative', aspectRatio: '2/3' }}>
                    <Box
                        component="img"
                        src={img}
                        alt=""
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.35,
                            bgcolor: 'rgba(15, 23, 42, 0.82)',
                            color: '#fff',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                        }}
                    >
                        <StarRoundedIcon sx={{ fontSize: 16, color: '#FFC107' }} />
                        {rating}
                    </Box>
                </Box>
                <Box sx={{ p: 1.5 }}>
                    <Typography fontWeight={800} variant="subtitle2" sx={{ lineHeight: 1.25, mb: 0.5 }}>
                        {movie.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {year} • {genreLabel}
                        {duration ? ` • ${duration}` : ''}
                    </Typography>
                </Box>
            </Box>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite();
                }}
                sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    bgcolor: 'rgba(255,255,255,0.92)',
                    '&:hover': { bgcolor: '#fff' },
                }}
                aria-label="Watchlist"
            >
                {isFavorite ? (
                    <BookmarkIcon sx={{ fontSize: 20, color: layoutTokens.sidebar.accent }} />
                ) : (
                    <BookmarkBorderOutlinedIcon sx={{ fontSize: 20 }} />
                )}
            </IconButton>
        </Box>
    );
};

export default DiscoverMovieGridCard;
