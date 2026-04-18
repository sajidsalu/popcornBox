import { Box, Button, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { seriesUi } from './seriesUi';
import { useTranslation } from 'react-i18next';

const SeriesTriviaCard = () => {
    const { t } = useTranslation();
    const items = [t('tvShowDetail.trivia1'), t('tvShowDetail.trivia2'), t('tvShowDetail.trivia3')];

    return (
        <Box
            sx={{
                bgcolor: seriesUi.surfaceContainer,
                borderRadius: 4,
                p: 4,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <LightbulbOutlinedIcon sx={{ color: seriesUi.tertiary }} />
                <Typography sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, fontSize: '1.25rem' }}>
                    {t('tvShowDetail.triviaTitle')}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {items.map((text, i) => (
                    <Box
                        key={i}
                        sx={{
                            pb: i < items.length - 1 ? 3 : 0,
                            borderBottom: i < items.length - 1 ? `1px solid rgba(113, 119, 131, 0.25)` : 'none',
                        }}
                    >
                        <Typography variant="body2" sx={{ color: seriesUi.onSurfaceVariant, lineHeight: 1.6 }}>
                            {text}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Button
                fullWidth
                sx={{ mt: 3, fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em' }}
                color="primary"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
            >
                {t('tvShowDetail.viewAllTrivia')}
            </Button>
        </Box>
    );
};

export default SeriesTriviaCard;
