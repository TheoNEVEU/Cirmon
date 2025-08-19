// src/context/ApiContext.tsx
import React, { createContext, useContext } from "react";

type ApiContextType = {
  baseUrl: string;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Change ici pour basculer Render <-> localhost
const localHost = true;

const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const baseUrl = localHost
    ? "http://localhost:3000"
    : "https://testcirmon.onrender.com";

  return (
    <ApiContext.Provider value={{ baseUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi doit être utilisé à l'intérieur d'un ApiProvider");
  }
  return context;
};

export default ApiProvider;
