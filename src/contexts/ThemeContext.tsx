import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, defaultTheme, createTheme } from '../types/theme';

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Partial<Theme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: customTheme,
}) => {
  const theme = customTheme ? createTheme(customTheme) : defaultTheme;

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn('useTheme must be used within a ThemeProvider. Using default theme.');
    return defaultTheme;
  }
  return context.theme;
};

export default ThemeProvider;