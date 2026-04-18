import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState, type ReactNode } from 'react';
import AppSidebar from '../sidebar/AppSidebar';
import MainTopBar from '../dashboard/MainTopBar';
import { layoutTokens } from '../../theme/layoutTokens';

type AppShellProps = {
    children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen((o) => !o);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {isMdUp ? (
                <AppSidebar variant="permanent" open onClose={() => undefined} />
            ) : (
                <AppSidebar variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} />
            )}

            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    minHeight: '100vh',
                    bgcolor: (t) =>
                        t.palette.mode === 'light' ? layoutTokens.main.light : layoutTokens.main.dark,
                }}
            >
                <MainTopBar showMenuButton={!isMdUp} onMenuClick={handleDrawerToggle} />
                <Box sx={{ flex: 1, overflow: 'auto' }}>{children}</Box>
            </Box>
        </Box>
    );
};

export default AppShell;
