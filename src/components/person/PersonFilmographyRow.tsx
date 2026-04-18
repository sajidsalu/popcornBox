import { Box, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { PersonCredit } from '../../api/personService';
import { posterUrl } from '../../lib/mediaUrls';
import { seriesUi } from '../tv-details/seriesUi';
import { useTranslation } from 'react-i18next';

const STAR_GOLD = '#FFC107';

type Props = {
    credit: PersonCredit;
};

const PersonFilmographyRow = ({ credit }: Props) => {
    const { t } = useTranslation();
    const href = credit.mediaType === 'movie' ? `/movie/${credit.id}` : `/tv/${credit.id}`;
    const thumb = posterUrl(credit.poster_path, 'w92');
    const hasScore = credit.vote_average > 0;

    return (
        <Box
            component={Link}
            to={href}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: '#fff',
                border: `1px solid ${seriesUi.surfaceContainer}`,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.2s, transform 0.15s',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-1px)',
                },
            }}
        >
            <Box
                component="img"
                src={thumb}
                alt=""
                sx={{
                    width: { xs: '100%', sm: 72 },
                    height: { xs: 140, sm: 108 },
                    objectFit: 'cover',
                    borderRadius: 1.5,
                    flexShrink: 0,
                    bgcolor: seriesUi.surfaceContainerHighest,
                }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                    <Typography
                        sx={{
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            color: seriesUi.onSurface,
                        }}
                    >
                        {credit.title}
                    </Typography>
                    <Chip
                        size="small"
                        label={
                            credit.mediaType === 'movie'
                                ? t('search.badge.movie')
                                : t('search.badge.tv')
                        }
                        sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            bgcolor: 'rgba(25, 118, 210, 0.12)',
                            color: seriesUi.primary,
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        {credit.year}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    <Typography component="span" variant="caption" fontWeight={800} sx={{ color: seriesUi.outline }}>
                        {t('personPage.as')}{' '}
                    </Typography>
                    {credit.character || '—'}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexShrink: 0,
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                }}
            >
                {hasScore ? (
                    <>
                        <Box
                            sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                bgcolor: STAR_GOLD,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <StarRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
                        </Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontVariantNumeric: 'tabular-nums',
                                color: seriesUi.onSurface,
                            }}
                        >
                            {credit.vote_average.toFixed(1)}
                            <Typography component="span" color="text.secondary" fontWeight={600} sx={{ ml: 0.5 }}>
                                / 10
                            </Typography>
                        </Typography>
                    </>
                ) : (
                    <Typography color="text.secondary" fontWeight={700} variant="body2">
                        {t('personPage.ratingTbd')}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default PersonFilmographyRow;
