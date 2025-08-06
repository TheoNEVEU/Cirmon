import { createContext, useContext, useState, type ReactNode } from 'react';

export type Page = 'home' | 'inventory' | 'friends' | 'shop' | 'account' | 'boosters';

type PageContextType = {
  activePage: Page;
  setActivePage: (page: Page) => void;
};

// Création du contexte
const PageContext = createContext<PageContextType | undefined>(undefined);

// Provider : va encapsuler ton app
export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [activePage, setActivePage] = useState<Page>('home');

  return (
    <PageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </PageContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte facilement
export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
};
