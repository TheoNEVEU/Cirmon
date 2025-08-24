import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ConnectionProvider } from './contexts/connectedContext';
import { UserProvider } from './contexts/userContext';
import { PageProvider } from './contexts/pageContext';
import { ApiSocketProvider } from "./contexts/ApiSocketContext";
import App from './App';

import './style/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiSocketProvider>
      <ConnectionProvider>
        <UserProvider>
          <PageProvider>
            <App />
          </PageProvider>
        </UserProvider>
      </ConnectionProvider>
    </ApiSocketProvider>
  </StrictMode>,
)
