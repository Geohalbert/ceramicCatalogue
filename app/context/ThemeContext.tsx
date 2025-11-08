import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  background: '#fff',
  secondaryBackground: '#f9f9f9',
  text: '#333',
  secondaryText: '#666',
  border: '#ddd',
  primary: '#007AFF',
  danger: '#dc3545',
  success: '#28a745',
  info: '#e7f3ff',
  divider: '#e0e0e0',
  card: '#fff',
  inputBackground: '#fff',
  placeholder: '#999',
};

const darkColors = {
  background: '#1a1a1a',
  secondaryBackground: '#2a2a2a',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  border: '#404040',
  primary: '#0a84ff',
  danger: '#ff453a',
  success: '#32d74b',
  info: '#1c3a52',
  divider: '#404040',
  card: '#2a2a2a',
  inputBackground: '#3a3a3a',
  placeholder: '#808080',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

