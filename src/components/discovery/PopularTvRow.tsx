import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import type { TVShow } from '../../types/show.type';
import { posterUrl } from '../../lib/mediaUrls';
import { useTranslation } from 'react-i18next';

type Props = {
    show: TVShow;
    rank: number;
};

const PopularTvRow = ({ show, rank }: Props) => {
    const { t } = useTranslation();
    const year = show.first_air_date?.split('-')[0] ?? '—';
    const rating = show.vote_average?.toFixed(1) ?? '—';
    const showTrending = rank <= 3;

    return (
        <Box
            component={Link}
            to={`/tv/${show.id}`}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                px: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                borderRadius: 2,
                bgcolor: 'rgba(243, 243, 243, 1)',
                border: '1px solid transparent',
                transition: 'background-color 0.2s, border-color 0.2s',
                '&:hover': {
                    bgcolor: 'rgba(238, 238, 238, 1)',
                },
            }}
        >
            <Box
                component="img"
                src={posterUrl(show.poster_path, 'w342')}
                alt=""
                sx={{ width: 64, height: 80, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                    {showTrending && (
                        <Typography
                            variant="caption"
                            sx={{
                                bgcolor: '#775800',
                                color: '#fff',
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
                    )}
                    <Typography variant="caption" color="text.secondary">
                        {t('tvHome.seriesShort')} • {year}
                    </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={800} noWrap sx={{ fontFamily: '"Manrope", sans-serif' }}>
                    {show.original_name}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.25 }}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" fontWeight={700}>
                        {rating}
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>
                    {t('tvHome.watchersShort')}
                </Typography>
            </Box>
        </Box>
    );
};

export default PopularTvRow;
