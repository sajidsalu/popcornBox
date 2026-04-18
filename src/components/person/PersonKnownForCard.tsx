import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { PersonCredit } from '../../api/personService';
import { posterUrl } from '../../lib/mediaUrls';
import { seriesUi } from '../tv-details/seriesUi';

type Props = {
    credit: PersonCredit;
};

const PersonKnownForCard = ({ credit }: Props) => {
    const href = credit.mediaType === 'movie' ? `/movie/${credit.id}` : `/tv/${credit.id}`;
    const poster = posterUrl(credit.poster_path, 'w185');

    return (
        <Box
            component={Link}
            to={href}
            sx={{
                flex: '0 0 auto',
                width: 120,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.15s',
                '&:hover': { transform: 'translateY(-4px)' },
            }}
        >
            <Box
                component="img"
                src={poster}
                alt=""
                sx={{
                    width: '100%',
                    aspectRatio: '2 / 3',
                    objectFit: 'cover',
                    borderRadius: 2,
                    bgcolor: seriesUi.surfaceContainerHighest,
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    mt: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: seriesUi.onSurface,
                }}
            >
                {credit.title}
            </Typography>
        </Box>
    );
};

export default PersonKnownForCard;
