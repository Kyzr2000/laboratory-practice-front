import './index.css';

import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { apolloClient } from '@/apis/client';
import ErrorBoundary from '@/components/ErrorBoundary';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
