import { Box, Typography } from '@mui/material';
import { layoutTokens } from '../../theme/layoutTokens';

type Props = {
    label: string;
};

const ContentBadge = ({ label }: Props) => {
    return (
        <Box
            sx={{
                display: 'inline-flex',
                px: 1,
                py: 0.25,
                borderRadius: layoutTokens.radius.pill,
                bgcolor: layoutTokens.sidebar.accent,
                color: '#fff',
            }}
        >
            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>
                {label}
            </Typography>
        </Box>
    );
};

export default ContentBadge;
