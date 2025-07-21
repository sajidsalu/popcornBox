import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box, Divider,
  Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Brightness4, Brightness7, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import type { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import logo from '../assets/popcorn.png';


const Header = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [showLangOptions, setShowLangOptions] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

  const currentLang = i18n.language;

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setDrawerOpen(false); // 👈 closes drawer too
  };


  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <img src={logo} alt="Logo" style={{ width: 32, height: 32, marginRight: 8 }} />
              <Typography variant="h6" noWrap>
                {t('title')}
              </Typography>
            </Box>
          </Box>

          <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {['Movies', 'TV Shows', 'Watch'].map((text) => (
              <ListItem key={text} onClick={toggleDrawer(false)}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>

          <Divider />

          <List>
            <ListItem onClick={() => setShowLangOptions((prev) => !prev)}>
              <ListItemText primary={`Language: ${currentLang.toUpperCase()}`} />
              <ExpandMore sx={{ transform: showLangOptions ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
            </ListItem>
            <Collapse in={showLangOptions} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {[
                  { code: 'en', label: 'English', flag: '🇺🇸' },
                  { code: 'fr', label: 'French', flag: '🇫🇷' },
                  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
                ].map(({ code, label, flag }) => (
                  <ListItem
                    key={code}
                    sx={{ pl: 4 }}
                    onClick={() => handleLanguageChange(code)}
                  >
                    <ListItemText primary={`${flag} ${label}`} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

    </>
  );
};

export default Header;
