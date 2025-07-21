import {
    Box,
    Typography,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useRef } from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
}

const HorizontalListSection = ({ title, children }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const scrollBy = 220; // adjust for card width + gap

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollBy : scrollBy,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Box minWidth="100%" sx={{ mb: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h5" fontWeight={600}>
                    {title}
                </Typography>
                {/* {!isMobile && ( */}
                <Box>
                    <IconButton onClick={() => handleScroll('left')}>
                        <ChevronLeft />
                    </IconButton>
                    <IconButton onClick={() => handleScroll('right')}>
                        <ChevronRight />
                    </IconButton>
                </Box>
                {/* )} */}
            </Box>

            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    flexWrap: 'nowrap',
                    scrollSnapType: 'x mandatory',
                    gap: 2,
                    pb: 1,
                    '& > *': {
                        scrollSnapAlign: 'start',
                        flexShrink: 0,
                    },
                    '&::-webkit-scrollbar': { height: 6 },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#aaa',
                        borderRadius: 3,
                    },
                }}
            >

                {children}
            </Box>
        </Box>
    );
};

export default HorizontalListSection;
