// src/context/ApiSocketProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type ApiSocketContextType = {
  baseUrl: string;
  socket: Socket | null;
};

const ApiSocketContext = createContext<ApiSocketContextType | undefined>(undefined);

const localHost = true; // bascule Render <-> localhost

export const ApiSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const baseUrl = localHost
    ? "http://localhost:3000"
    : "https://testcirmon.onrender.com";

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [baseUrl]);

  return (
    <ApiSocketContext.Provider value={{ baseUrl, socket }}>
      {children}
    </ApiSocketContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useApiSocket = () => {
  const context = useContext(ApiSocketContext);
  if (!context) {
    throw new Error("useApiSocket doit être utilisé à l'intérieur d'un ApiSocketProvider");
  }
  return context;
};
