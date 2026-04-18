import { Box } from '@mui/material';

type Props = {
    value: number;
};

/** Thin progress track; value 0–100 */
const ProgressBar = ({ value }: Props) => {
    const v = Math.min(100, Math.max(0, value));
    return (
        <Box
            sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(15, 23, 42, 0.12)',
                overflow: 'hidden',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    width: `${v}%`,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    transition: 'width 0.3s ease',
                }}
            />
        </Box>
    );
};

export default ProgressBar;
