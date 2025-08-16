import { createContext, useContext, useState, type ReactNode } from 'react';

interface PreCard {
  idPokedex: number;
  quantity: number;
}

export interface TitleWithEffect {
  text: string;
  gradientDirection: string;
  colors: string[];
  isGradientActive: boolean;
};

export interface User {
  username: string;
  password: string;
  diamonds: number;
  ppURL: string;
  title: TitleWithEffect,
  badgeURL: String[],
  displayedCards: PreCard[];
  collectibles: [{
    titles: string[];
    badges: string[];
  }];
  stats: number[];
  cards: PreCard[];
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
