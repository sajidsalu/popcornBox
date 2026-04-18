import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import type { TVShowDetails } from '../../types/show.type';
import { backdropUrl, logoUrl, posterUrl } from '../../lib/mediaUrls';
import { seriesUi } from './seriesUi';
import { useTranslation } from 'react-i18next';

type Props = {
    show: TVShowDetails;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onWatchLatest: () => void;
    latestSeasonNumber: number | null;
};

const SeriesHero = ({
    show,
    isFavorite,
    onToggleFavorite,
    onWatchLatest,
    latestSeasonNumber,
}: Props) => {
    const { t } = useTranslation();
    const bg = backdropUrl(show.backdrop_path ?? null, 'w1280') ?? posterUrl(show.poster_path, 'w500');
    const firstGenre = show.genres[0]?.name ?? '';
    const badgeLabel =
        firstGenre.length > 0
            ? `${t('tvShowDetail.seriesWord')} • ${firstGenre}`
            : t('tvShowDetail.seriesWord');
    const network = show.networks?.[0];
    const networkLogo = network ? logoUrl(network.logo_path, 'w92') : null;

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: { xs: 420, md: 560 },
                overflow: 'hidden',
            }}
        >
            <Box
                component="img"
                src={bg}
                alt=""
                sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, rgba(249,249,249,0) 0%, rgba(249,249,249,0.75) 72%, ${seriesUi.surface} 100%)`,
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    px: { xs: 2, sm: 3, md: 4 },
                    pb: { xs: 4, md: 6 },
                    pt: { xs: 4, md: 6 },
                    maxWidth: 1280,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: { xs: 420, md: 560 },
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }} flexWrap="wrap">
                    <Chip
                        label={badgeLabel}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            color: seriesUi.primary,
                            border: '1px solid rgba(25, 118, 210, 0.2)',
                            fontWeight: 800,
                            fontSize: '0.62rem',
                            letterSpacing: '0.12em',
                            height: 28,
                        }}
                    />
                    {show.vote_average > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <StarIcon sx={{ fontSize: 18, color: seriesUi.tertiary }} />
                            <Typography
                                fontWeight={800}
                                sx={{ color: seriesUi.tertiary, fontSize: '0.95rem' }}
                            >
                                {show.vote_average.toFixed(1)}/10
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                <Typography
                    sx={{
                        fontFamily: '"Manrope", "Inter", sans-serif',
                        fontWeight: 800,
                        fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
                        lineHeight: 0.95,
                        letterSpacing: '-0.04em',
                        color: seriesUi.onSurface,
                        textTransform: 'uppercase',
                        mb: 3,
                    }}
                >
                    {show.name}
                </Typography>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={3}
                    alignItems={{ md: 'flex-end' }}
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: seriesUi.outline,
                                fontWeight: 700,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                display: 'block',
                                mb: 0.5,
                            }}
                        >
                            {t('tvShowDetail.streamingOn')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {networkLogo ? (
                                <Box
                                    component="img"
                                    src={networkLogo}
                                    alt={network?.name ?? ''}
                                    sx={{
                                        height: 36,
                                        maxWidth: 140,
                                        objectFit: 'contain',
                                        bgcolor: '#fff',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                    }}
                                />
                            ) : network ? (
                                <Box
                                    sx={{
                                        bgcolor: seriesUi.primeBlue,
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: '#fff',
                                            fontWeight: 900,
                                            fontStyle: 'italic',
                                            fontSize: '1.1rem',
                                        }}
                                    >
                                        {network.name}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    {t('tvShowDetail.networkUnknown')}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrowIcon />}
                            onClick={onWatchLatest}
                            disabled={latestSeasonNumber == null}
                            sx={{
                                textTransform: 'none',
                                fontFamily: '"Manrope", sans-serif',
                                fontWeight: 800,
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                background: `linear-gradient(90deg, ${seriesUi.primary} 0%, ${seriesUi.primaryContainer} 100%)`,
                                boxShadow: '0 12px 32px rgba(25, 118, 210, 0.25)',
                            }}
                        >
                            {latestSeasonNumber != null
                                ? t('tvShowDetail.watchSeason', { n: latestSeasonNumber })
                                : t('tvShowDetail.watch')}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={onToggleFavorite}
                            sx={{
                                textTransform: 'none',
                                fontFamily: '"Manrope", sans-serif',
                                fontWeight: 800,
                                px: 2.5,
                                py: 1.5,
                                borderRadius: 2,
                                borderColor: seriesUi.surfaceContainerHigh,
                                bgcolor: seriesUi.surfaceContainerHigh,
                                color: seriesUi.primary,
                                borderWidth: 2,
                                '&:hover': {
                                    borderColor: seriesUi.primary,
                                    bgcolor: seriesUi.surfaceContainerHigh,
                                },
                            }}
                        >
                            {isFavorite ? t('tvShowDetail.inWatchlist') : t('tvShowDetail.addWatchlist')}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default SeriesHero;
