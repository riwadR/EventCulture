import { Theme } from '../config/constants';

export interface ExtendedTheme extends Theme {
  mode: 'light' | 'dark';
  colors: Theme['colors'] & {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export interface ThemeContextType {
  theme: ExtendedTheme;
  darkMode: boolean;
  toggleDarkMode: () => void;
} 