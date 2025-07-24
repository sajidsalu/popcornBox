import {
  AppBar,
  Toolbar,
  Typography,
  IconButton, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import type { RootState } from '../store/store';
import logo from '../assets/popcorn.png';
import Sidebar from './Sidebar';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={
                toggleDrawer(true)
              }
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

      <Sidebar isOpenSidebar={drawerOpen} onCloseSidebar={() => setDrawerOpen(false)} />
    </>
  );
};

export default Header;
