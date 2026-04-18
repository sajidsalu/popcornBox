import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie.type';
import { posterUrl } from '../../lib/mediaUrls';
import { useTranslation } from 'react-i18next';

type Props = {
    movie: Movie;
    rank: number;
};

const PopularShowRow = ({ movie, rank }: Props) => {
    const { t } = useTranslation();
    const year = movie.release_date?.split('-')[0] ?? '—';
    const rating = movie.vote_average?.toFixed(1) ?? '—';

    return (
        <Box
            component={Link}
            to={`/movie/${movie.id}`}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 'none' },
            }}
        >
            <Box
                component="img"
                src={posterUrl(movie.poster_path, 'w342')}
                alt=""
                sx={{ width: 52, height: 52, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                    <Typography
                        variant="caption"
                        sx={{
                            bgcolor: 'warning.main',
                            color: '#111',
                            fontWeight: 800,
                            px: 0.75,
                            py: 0.1,
                            borderRadius: 0.5,
                            fontSize: '0.6rem',
                            letterSpacing: '0.06em',
                        }}
                    >
                        {t('homePage.trending')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {t('homePage.featureFilm')} • {year}
                    </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={800} noWrap>
                    {rank}. {movie.title}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.25 }}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" fontWeight={700}>
                        {rating}
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    {t('homePage.watchersShort')}
                </Typography>
            </Box>
        </Box>
    );
};

export default PopularShowRow;
