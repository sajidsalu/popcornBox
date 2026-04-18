import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type Props = {
    title: string;
    subtitle?: string;
    right?: ReactNode;
};

const SectionHeader = ({ title, subtitle, right }: Props) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'flex-end' },
                justifyContent: 'space-between',
                gap: 2,
                mb: 2,
                flexWrap: 'wrap',
            }}
        >
            <Box>
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {right && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{right}</Box>}
        </Box>
    );
};

export default SectionHeader;
