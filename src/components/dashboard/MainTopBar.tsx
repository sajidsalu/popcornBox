import { Box, IconButton, Button, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import type { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { layoutTokens } from '../../theme/layoutTokens';
import SearchBar from '../search/SearchBar';

type MainTopBarProps = {
    onMenuClick: () => void;
    showMenuButton: boolean;
};

const MainTopBar = ({ onMenuClick, showMenuButton }: MainTopBarProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mode = useSelector((state: RootState) => state.theme.mode);
    const dispatch = useDispatch();
    const isLight = theme.palette.mode === 'light';

    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: { xs: 2, md: 3 },
                py: 2,
                borderBottom: `1px solid ${isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255,255,255,0.06)'}`,
                bgcolor: 'background.paper',
                flexShrink: 0,
            }}
        >
            {showMenuButton && (
                <IconButton edge="start" onClick={onMenuClick} aria-label="menu" sx={{ color: 'text.primary' }}>
                    <MenuIcon />
                </IconButton>
            )}

            <SearchBar />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 'auto' }}>
                <IconButton
                    size="small"
                    sx={{
                        bgcolor: isLight ? '#EEF2FF' : 'rgba(255,255,255,0.06)',
                        borderRadius: 2,
                    }}
                    aria-label={t('header.notifications')}
                >
                    <NotificationsNoneOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    sx={{
                        bgcolor: isLight ? '#EEF2FF' : 'rgba(255,255,255,0.06)',
                        borderRadius: 2,
                    }}
                    aria-label={t('header.settings')}
                >
                    <SettingsOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => dispatch(toggleTheme())} aria-label="theme">
                    {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                </IconButton>
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        display: { xs: 'none', sm: 'inline-flex' },
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 2,
                        borderRadius: 2,
                        boxShadow: 'none',
                        bgcolor: layoutTokens.sidebar.accent,
                        '&:hover': { bgcolor: '#2563EB' },
                    }}
                >
                    {t('header.upgradePro')}
                </Button>
            </Box>
        </Box>
    );
};

export default MainTopBar;
