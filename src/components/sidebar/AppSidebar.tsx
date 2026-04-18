import { Box, Drawer, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { layoutTokens } from '../../theme/layoutTokens';
import NavItem from './NavItem';
import SidebarProfile from './SidebarProfile';
import SidebarLanguageRow from './SidebarLanguageRow';
import logo from '../../assets/popcorn.png';

export type AppSidebarProps = {
    variant: 'permanent' | 'temporary';
    open: boolean;
    onClose: () => void;
};

const AppSidebar = ({ variant, open, onClose }: AppSidebarProps) => {
    const { t } = useTranslation();

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: layoutTokens.sidebar.bg,
                width: layoutTokens.sidebar.width,
                borderRight: `1px solid ${layoutTokens.sidebar.border}`,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 2.5,
                }}
            >
                <Box
                    component={Link}
                    to="/"
                    onClick={() => variant === 'temporary' && onClose()}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        textDecoration: 'none',
                    }}
                >
                    <img src={logo} alt="" width={28} height={28} style={{ borderRadius: 6 }} />
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.05rem',
                            color: layoutTokens.sidebar.accent,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {t('title')}
                    </Typography>
                </Box>
                {variant === 'temporary' && (
                    <IconButton size="small" onClick={onClose} sx={{ color: layoutTokens.sidebar.textMuted }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', px: 0.5 }}>
                <NavItem
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    label={t('sidebar.nav.home')}
                    match={(p) => p === '/'}
                />
                <NavItem
                    to="/discover"
                    icon={<TravelExploreOutlinedIcon />}
                    label={t('sidebar.nav.discover')}
                    match={(p) => p === '/discover' || p.startsWith('/discover/')}
                />
                <NavItem
                    to="/movies"
                    icon={<MovieOutlinedIcon />}
                    label={t('sidebar.nav.movies')}
                    match={(p) => p === '/movies' || p.startsWith('/movie/')}
                />
                <NavItem
                    to="/watch"
                    icon={<BookmarkBorderOutlinedIcon />}
                    label={t('sidebar.nav.watchlist')}
                    end
                />
                <NavItem to="/tv" icon={<CalendarTodayOutlinedIcon />} label={t('sidebar.nav.calendar')} end />
                <NavItem to="/stats" icon={<BarChartOutlinedIcon />} label={t('sidebar.nav.stats')} end />
                <NavItem to="/history" icon={<HistoryOutlinedIcon />} label={t('sidebar.nav.history')} end />
                <NavItem to="/friends" icon={<PeopleOutlineOutlinedIcon />} label={t('sidebar.nav.friends')} end />
                <NavItem
                    to="/favorites"
                    icon={<FormatListBulletedOutlinedIcon />}
                    label={t('sidebar.nav.lists')}
                    end
                />
            </Box>

            <SidebarLanguageRow onSelectLanguage={variant === 'temporary' ? onClose : undefined} />
            <SidebarProfile />
        </Box>
    );

    return (
        <Drawer
            variant={variant}
            open={variant === 'permanent' ? true : open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    border: 'none',
                    boxSizing: 'border-box',
                    width: layoutTokens.sidebar.width,
                },
            }}
            sx={{
                width: variant === 'permanent' ? layoutTokens.sidebar.width : undefined,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: layoutTokens.sidebar.width,
                    boxSizing: 'border-box',
                    border: 'none',
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};

export default AppSidebar;
