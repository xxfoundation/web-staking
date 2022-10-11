import './dayjs';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { ApolloProvider } from '@apollo/client';
import { client as apolloClient } from './plugins/apollo';

import { theme } from './theme';
import SnackbarProvider from './components/SnackbarProvider';

import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
