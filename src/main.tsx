import './index.css';

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';

import ErrorBoundary from '@/components/ErrorBoundary';

import App from './App';
const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://127.0.0.1:7001/graphql' }), // 确保这个URL是正确的
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
