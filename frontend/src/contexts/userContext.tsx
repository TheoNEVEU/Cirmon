import { createContext, useContext, useState, type ReactNode } from 'react';

interface PreCard {
  idPokedex: number;
  quantity: number;
}

export interface TitleWithEffect {
  _id: string; 
  text: string;
  gradientDirection: string;
  colors: string[];
  isGradientActive: boolean;
};

export interface Badge {
  _id: string,
  label: string,
  image: string,
}

export interface User {
  // Infos générales
  username: string;
  password: string;
  diamonds: number;
  
  // Actuellement équipés
  ppURL: string;
  title: TitleWithEffect | null;
  badgesEquipped: Badge[];
  displayedCards: number[];

  // Inventaire
  collectibles: { // Tous les collectibles débloqués
    titleIds: string[];
    badgeIds: string[];
  };
  cards: PreCard[];

  // Autres informations
  stats: number[];
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
