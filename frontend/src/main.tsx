import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ConnectionProvider } from './contexts/connectedContext';
import { UserProvider } from './contexts/userContext';
import { PageProvider } from './contexts/pageContext';
import App from './App';

import './style/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionProvider>
      <UserProvider>
        <PageProvider>
          <App />
        </PageProvider>
      </UserProvider>
    </ConnectionProvider>
  </StrictMode>,
)
