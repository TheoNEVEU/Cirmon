import { createContext, useContext, useState, type ReactNode } from 'react';

interface Card {
  numPokedex: number;
  quantity: number;
}

export interface User {
  username: string;
  password: string;
  ppURL: string;
  title: {
    text: string;
    gradientDirection: string;
    colors: string[];
    isGradientActive: boolean;
  };
  badgeURL: string[];
  stats: number[];
  cards: Card[];
  friends: string[];
  requests: string[];
}

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Création du contexte
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider : va encapsuler ton app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte facilement
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
