import { Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { layoutTokens } from '../../theme/layoutTokens';

export type NavItemProps = {
    to: string;
    icon: ReactNode;
    label: string;
    end?: boolean;
    match?: (pathname: string) => boolean;
};

const NavItem = ({ to, icon, label, end, match }: NavItemProps) => {
    const { pathname } = useLocation();
    const active = match ? match(pathname) : end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

    return (
        <Box
            component={Link}
            to={to}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1.25,
                px: 2,
                ml: 0,
                textDecoration: 'none',
                color: active ? layoutTokens.sidebar.textActive : layoutTokens.sidebar.textMuted,
                borderLeft: active ? `3px solid ${layoutTokens.sidebar.accent}` : '3px solid transparent',
                bgcolor: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                transition: 'color 0.15s, background-color 0.15s',
                '&:hover': {
                    color: layoutTokens.sidebar.textActive,
                    bgcolor: 'rgba(255,255,255,0.04)',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    color: active ? layoutTokens.sidebar.accent : 'inherit',
                    '& svg': { fontSize: 22 },
                }}
            >
                {icon}
            </Box>
            <Typography
                component="span"
                sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default NavItem;
