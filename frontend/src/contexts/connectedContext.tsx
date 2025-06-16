import { createContext, useContext, useState, type ReactNode } from 'react';

type ConnectionContextType = {
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
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
