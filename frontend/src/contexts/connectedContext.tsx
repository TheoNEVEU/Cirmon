import { createContext, useContext, useState, type ReactNode } from 'react';

type ConnectionStatus = 'connected' | 'connecting' | 'error';

type ConnectionContextType = {
  status: ConnectionStatus;
  setStatus: (value: ConnectionStatus) => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>('error'); // ou 'connecting' ou 'connected' par défaut

  return (
    <ConnectionContext.Provider value={{ status, setStatus }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
}
