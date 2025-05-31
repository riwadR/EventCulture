
// context/AppContext.tsx

import React, { createContext, useContext, ReactNode, useState } from 'react';

import { AuthContextType } from './AuthContextType';




interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const contextValue: AppContextType = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <useAppContext.Provider value={contextValue}>
      {children}
    </.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { AppContextType } from './AppContextType'; // j’imagine que tu as ce fichier pour le type

// ✅ Crée le contexte
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const contextValue: AppContextType = {
    darkMode,
    toggleDarkMode,
  };

  return (
    // ✅ Utilise le bon contexte ici !
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
