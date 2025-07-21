import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient.ts';
import Root from './theme/themeRoot.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
