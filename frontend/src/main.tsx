import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ConnectionProvider } from './contexts/connectedContext';
import { UserProvider } from './contexts/userContext';
import App from './App';

import './style/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ConnectionProvider>
  </StrictMode>,
)
