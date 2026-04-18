import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import ContentBadge from './ContentBadge';
import { posterUrl } from '../../lib/mediaUrls';
import { layoutTokens } from '../../theme/layoutTokens';

export type ContinueWatchingCardProps = {
    href: string;
    title: string;
    posterPath: string | null;
    progress: number;
    badge?: string;
    remainingLabel: string;
};

const ContinueWatchingCard = ({
    href,
    title,
    posterPath,
    progress,
    badge,
    remainingLabel,
}: ContinueWatchingCardProps) => {
    const img = posterUrl(posterPath, 'w500');

    return (
        <Box
            component={Link}
            to={href}
            sx={{
                display: 'block',
                width: '100%',
                minWidth: { xs: 260, sm: 280 },
                maxWidth: 400,
                flexShrink: 0,
                textDecoration: 'none',
                color: 'inherit',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: `${layoutTokens.radius.card}px`,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    boxShadow: (t) =>
                        t.palette.mode === 'light'
                            ? '0 4px 24px rgba(15, 23, 42, 0.08)'
                            : '0 4px 24px rgba(0,0,0,0.35)',
                }}
            >
                <Box
                    component="img"
                    src={img}
                    alt={title}
                    sx={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
                {badge && (
                    <Box sx={{ position: 'absolute', bottom: 56, left: 12 }}>
                        <ContentBadge label={badge} />
                    </Box>
                )}
                <Box sx={{ p: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={800} noWrap sx={{ mb: 0.25 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {remainingLabel}
                    </Typography>
                    <ProgressBar value={progress} />
                </Box>
            </Box>
        </Box>
    );
};

export default ContinueWatchingCard;
