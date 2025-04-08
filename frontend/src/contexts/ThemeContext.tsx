import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { THEME } from '../config/constants';
import { ThemeContextType, ExtendedTheme } from '../types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Vérifier le mode préféré de l'utilisateur
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Vérifier la préférence du système
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Mettre à jour la préférence de thème
  const toggleDarkMode = useCallback((): void => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Palette de couleurs basée sur le mode actuel
  const theme: ExtendedTheme = {
    ...THEME,
    mode: darkMode ? 'dark' : 'light',
    colors: {
      ...THEME.colors,
      background: darkMode ? '#121212' : '#ffffff',
      surface: darkMode ? '#1e1e1e' : '#f5f5f5',
      text: darkMode ? '#e0e0e0' : '#333333',
      textSecondary: darkMode ? '#a0a0a0' : '#666666',
      border: darkMode ? '#333333' : '#dcdcdc',
    },
  };

  const value: ThemeContextType = {
    theme,
    darkMode,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 