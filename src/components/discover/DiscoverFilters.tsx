import {
    Box,
    Button,
    Checkbox,
    Chip,
    FormControlLabel,
    FormGroup,
    Slider,
    Stack,
    Typography,
} from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useTranslation } from 'react-i18next';
import type { GenreItem, WatchProvider } from '../../api/movieService';
import { layoutTokens } from '../../theme/layoutTokens';

type Props = {
    genres: GenreItem[];
    selectedGenreIds: number[];
    onToggleGenre: (id: number) => void;
    yearRange: [number, number];
    onYearRangeChange: (range: [number, number]) => void;
    minRating: number;
    onMinRatingChange: (v: number) => void;
    platformOptions: WatchProvider[];
    selectedProviderIds: number[];
    onToggleProvider: (id: number) => void;
    onReset: () => void;
};

const DiscoverFilters = ({
    genres,
    selectedGenreIds,
    onToggleGenre,
    yearRange,
    onYearRangeChange,
    minRating,
    onMinRatingChange,
    platformOptions,
    selectedProviderIds,
    onToggleProvider,
    onReset,
}: Props) => {
    const { t } = useTranslation();

    const filledStars = Math.round((minRating / 10) * 5);

    return (
        <Box
            sx={{
                p: 2.5,
                borderRadius: `${layoutTokens.radius.card}px`,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                position: { md: 'sticky' },
                top: { md: 16 },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography fontWeight={900} sx={{ fontFamily: '"Manrope", sans-serif' }}>
                    {t('discover.filtersTitle')}
                </Typography>
                <Button size="small" onClick={onReset} sx={{ fontWeight: 800, textTransform: 'none' }}>
                    {t('discover.resetAll')}
                </Button>
            </Stack>

            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
                {t('discover.genre')}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1, mb: 3 }}>
                {genres.map((g) => {
                    const selected = selectedGenreIds.includes(g.id);
                    return (
                        <Chip
                            key={g.id}
                            label={g.name}
                            onClick={() => onToggleGenre(g.id)}
                            color={selected ? 'primary' : 'default'}
                            variant={selected ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 700 }}
                        />
                    );
                })}
            </Stack>

            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
                {t('discover.releaseYear')}
            </Typography>
            <Slider
                value={yearRange}
                onChange={(_, v) => onYearRangeChange(v as [number, number])}
                min={1990}
                max={2026}
                valueLabelDisplay="auto"
                sx={{ mt: 2, mb: 1, color: layoutTokens.sidebar.accent }}
            />
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                    {yearRange[0]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {yearRange[1]}
                </Typography>
            </Stack>

            <Typography
                variant="caption"
                fontWeight={800}
                color="text.secondary"
                sx={{ letterSpacing: '0.08em', display: 'block', mt: 3, mb: 1 }}
            >
                {t('discover.minRating')}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <StarRoundedIcon
                        key={i}
                        sx={{
                            fontSize: 28,
                            color: i < filledStars ? '#FFC107' : 'action.disabledBackground',
                        }}
                    />
                ))}
                <Typography fontWeight={800} color="text.secondary">
                    {minRating.toFixed(1)}+
                </Typography>
            </Stack>
            <Slider
                value={minRating}
                onChange={(_, v) => onMinRatingChange(v as number)}
                min={0}
                max={10}
                step={0.5}
                sx={{ color: layoutTokens.sidebar.accent }}
            />

            <Typography
                variant="caption"
                fontWeight={800}
                color="text.secondary"
                sx={{ letterSpacing: '0.08em', display: 'block', mt: 3, mb: 1 }}
            >
                {t('discover.platforms')}
            </Typography>
            <FormGroup>
                {platformOptions.map((p) => (
                    <FormControlLabel
                        key={p.provider_id}
                        control={
                            <Checkbox
                                size="small"
                                checked={selectedProviderIds.includes(p.provider_id)}
                                onChange={() => onToggleProvider(p.provider_id)}
                            />
                        }
                        label={p.provider_name}
                    />
                ))}
            </FormGroup>
        </Box>
    );
};

export default DiscoverFilters;
