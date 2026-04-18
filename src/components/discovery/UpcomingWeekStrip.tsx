import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useMemo, useRef } from 'react';
import { posterUrl } from '../../lib/mediaUrls';
import { layoutTokens } from '../../theme/layoutTokens';
import ContentBadge from './ContentBadge';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';

export type WeekPosterItem = {
    poster_path: string | null;
    title: string;
};

type DaySlot = {
    key: string;
    weekday: string;
    dayNum: string;
    item: WeekPosterItem | null;
    highlight?: boolean;
};

type Props = {
    upcoming: WeekPosterItem[];
    title: string;
    subtitle: string;
};

function buildWeekSlots(upcoming: WeekPosterItem[]): DaySlot[] {
    const start = new Date();
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(start);
    monday.setDate(start.getDate() + diff);

    const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const slots: DaySlot[] = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const wd = weekdays[i];
        const dayNum = String(d.getDate()).padStart(2, '0');
        const item = upcoming[i] ?? null;
        slots.push({
            key: `${wd}-${dayNum}`,
            weekday: wd,
            dayNum,
            item,
            highlight: i === 2 && !!item,
        });
    }
    return slots;
}

const UpcomingWeekStrip = ({ upcoming, title, subtitle }: Props) => {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const slots = useMemo(() => buildWeekSlots(upcoming.slice(0, 7)), [upcoming]);

    const scroll = (dir: -1 | 1) => {
        scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
    };

    return (
        <Box
            sx={{
                bgcolor: 'rgba(243, 243, 243, 1)',
                borderRadius: 4,
                p: { xs: 2, md: 4 },
                mb: 2,
            }}
        >
            <SectionHeader
                title={title}
                subtitle={subtitle}
                right={
                    <>
                        <IconButton
                            size="small"
                            onClick={() => scroll(-1)}
                            aria-label="previous"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => scroll(1)}
                            aria-label="next"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </>
                }
            />
            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    gap: 1.5,
                    overflowX: 'auto',
                    pb: 1,
                    scrollbarWidth: 'thin',
                }}
            >
                {slots.map((slot) => (
                    <Box
                        key={slot.key}
                        sx={{
                            flex: '0 0 120px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="caption"
                            fontWeight={800}
                            color={slot.highlight ? 'primary.main' : 'text.secondary'}
                            sx={{ letterSpacing: '0.06em' }}
                        >
                            {slot.weekday} {slot.dayNum}
                        </Typography>
                        <Box
                            sx={{
                                mt: 1,
                                borderRadius: 2,
                                overflow: 'hidden',
                                aspectRatio: '2 / 3',
                                border:
                                    slot.highlight && slot.item
                                        ? `4px solid ${layoutTokens.sidebar.accent}`
                                        : '2px dashed',
                                borderColor:
                                    slot.highlight && slot.item
                                        ? layoutTokens.sidebar.accent
                                        : 'divider',
                                position: 'relative',
                                bgcolor: slot.item ? 'transparent' : 'action.hover',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: slot.highlight && slot.item ? 6 : 0,
                            }}
                        >
                            {slot.item ? (
                                <>
                                    <Box
                                        component="img"
                                        src={posterUrl(slot.item.poster_path, 'w342')}
                                        alt={slot.item.title}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: slot.highlight ? 'none' : 'grayscale(0.35)',
                                        }}
                                    />
                                    {slot.highlight && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 8,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '90%',
                                            }}
                                        >
                                            <ContentBadge label={t('homePage.majorDrop')} />
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <CalendarTodayOutlinedIcon sx={{ color: 'text.disabled', fontSize: 28 }} />
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default UpcomingWeekStrip;
