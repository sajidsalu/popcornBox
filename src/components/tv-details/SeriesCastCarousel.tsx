import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { profileUrl } from '../../lib/mediaUrls';
import { seriesUi } from './seriesUi';

export type CastMember = {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
};

type Props = {
    cast: CastMember[];
    /** Max cards to render; default 12 */
    limit?: number;
    /** When false, hides the subtitle line under the title */
    showSubtitle?: boolean;
    /** Extra controls (e.g. “View all”) shown before the scroll arrows */
    headerExtra?: ReactNode;
    /** Dark cinematic styling (movie details page) */
    variant?: 'default' | 'dark';
    /** Override main heading (e.g. “Top cast”) */
    headingOverride?: string;
};

const SeriesCastCarousel = ({
    cast,
    limit = 12,
    showSubtitle = true,
    headerExtra,
    variant = 'default',
    headingOverride,
}: Props) => {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const slice = cast.slice(0, limit);

    const scroll = (dir: -1 | 1) => {
        scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
    };

    if (!slice.length) return null;

    const dark = variant === 'dark';
    const titleColor = dark ? '#f8fafc' : seriesUi.onSurface;
    const subColor = dark ? 'rgba(148, 163, 184, 0.9)' : seriesUi.outline;
    const btnBg = dark ? 'rgba(255,255,255,0.08)' : seriesUi.surfaceContainer;
    const nameColor = dark ? '#f8fafc' : undefined;
    const charColor = dark ? 'rgba(148, 163, 184, 0.95)' : seriesUi.outline;
    const focusColor = dark ? '#38bdf8' : seriesUi.primary;

    return (
        <Box sx={{ mt: dark ? 0 : 6 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 900,
                            fontSize: dark ? '1.35rem' : '1.75rem',
                            fontStyle: dark ? 'italic' : 'normal',
                            color: titleColor,
                        }}
                    >
                        {headingOverride ?? t('tvShowDetail.castCrew')}
                    </Typography>
                    {showSubtitle && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: subColor,
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                mt: 0.5,
                                display: 'block',
                            }}
                        >
                            {t('tvShowDetail.castSubtitle')}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {headerExtra}
                    <IconButton
                        size="small"
                        onClick={() => scroll(-1)}
                        sx={{
                            bgcolor: btnBg,
                            color: dark ? '#e2e8f0' : 'inherit',
                            '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.14)' : undefined },
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => scroll(1)}
                        sx={{
                            bgcolor: btnBg,
                            color: dark ? '#e2e8f0' : 'inherit',
                            '&:hover': { bgcolor: dark ? 'rgba(255,255,255,0.14)' : undefined },
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    gap: 3,
                    overflowX: 'auto',
                    pb: 1,
                    scrollbarWidth: 'thin',
                }}
            >
                {slice.map((person) => (
                    <Box
                        key={person.id}
                        component={Link}
                        to={`/person/${person.id}`}
                        aria-label={`${person.name}, ${person.character}`}
                        sx={{
                            flex: '0 0 144px',
                            textAlign: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            borderRadius: 2,
                            transition: 'transform 0.15s, opacity 0.15s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                opacity: 0.95,
                            },
                            '&:focus-visible': {
                                outline: `2px solid ${focusColor}`,
                                outlineOffset: 4,
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src={profileUrl(person.profile_path)}
                            alt={person.name}
                            sx={{
                                width: 144,
                                height: 144,
                                borderRadius: 3,
                                objectFit: 'cover',
                                mb: 1.5,
                                boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.45)' : '0 4px 16px rgba(0,0,0,0.12)',
                                display: 'block',
                                mx: 'auto',
                                filter: dark ? 'grayscale(0.25) contrast(1.05)' : 'none',
                            }}
                        />
                        <Typography
                            fontWeight={800}
                            variant="body2"
                            sx={{ fontSize: '0.85rem', color: nameColor }}
                        >
                            {person.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: charColor,
                                fontWeight: 800,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                fontSize: '0.62rem',
                                display: 'block',
                                mt: 0.25,
                            }}
                        >
                            {person.character}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SeriesCastCarousel;
