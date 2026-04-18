import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { seriesUi } from './seriesUi';
import { useTranslation } from 'react-i18next';

const SeriesReviewsCard = () => {
    const { t } = useTranslation();

    const reviews = [
        {
            user: t('tvShowDetail.review1User'),
            body: t('tvShowDetail.review1Body'),
            stars: 4,
        },
        {
            user: t('tvShowDetail.review2User'),
            body: t('tvShowDetail.review2Body'),
            stars: 5,
        },
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, fontSize: '1.25rem' }}>
                    {t('tvShowDetail.userReviews')}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{ color: seriesUi.primary, fontWeight: 800, cursor: 'pointer' }}
                >
                    {t('tvShowDetail.writeReview')}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {reviews.map((r, i) => (
                    <Box
                        key={i}
                        sx={{
                            bgcolor: seriesUi.surfaceContainerLow,
                            p: 2.5,
                            borderRadius: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: seriesUi.surfaceContainerHigh,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                }}
                            >
                                {r.user.slice(0, 1)}
                            </Box>
                            <Box>
                                <Typography variant="caption" fontWeight={800}>
                                    {r.user}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.1 }}>
                                    {Array.from({ length: 5 }).map((_, si) => (
                                        <StarIcon
                                            key={si}
                                            sx={{
                                                fontSize: 12,
                                                color: si < r.stars ? seriesUi.tertiary : seriesUi.surfaceContainerHighest,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: seriesUi.onSurfaceVariant,
                                fontStyle: 'italic',
                                lineHeight: 1.6,
                                display: 'block',
                            }}
                        >
                            &ldquo;{r.body}&rdquo;
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SeriesReviewsCard;
