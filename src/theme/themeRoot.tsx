import { ThemeProvider } from '@emotion/react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { getAppTheme } from './theme';
import { CssBaseline } from '@mui/material';
import App from '../App';

const Root = () => {
  const mode = useSelector((state: RootState) => state.theme.mode); // e.g., 'light' or 'dark'
  const theme = getAppTheme(mode);

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      < App />
    </ThemeProvider>
  );
};

export default Root;
