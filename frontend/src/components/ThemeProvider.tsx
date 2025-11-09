import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      
      // Apply primary color
      if (settings.theme.primaryColor) {
        root.style.setProperty('--color-primary', settings.theme.primaryColor);
      }
      
      // Apply secondary color
      if (settings.theme.secondaryColor) {
        root.style.setProperty('--color-secondary', settings.theme.secondaryColor);
      }
      
      // Apply font family
      if (settings.theme.fontFamily) {
        root.style.setProperty('--font-family', settings.theme.fontFamily);
        document.body.style.fontFamily = settings.theme.fontFamily;
      }
      
      // Apply color scheme
      if (settings.theme.colorScheme) {
        const prefersDark = settings.theme.colorScheme === 'dark' || 
          (settings.theme.colorScheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
      
      // Disable animations if set to false
      if (settings.theme.animations === false) {
        root.style.setProperty('--animation-duration', '0s');
        root.classList.add('reduce-motion');
      } else {
        root.style.removeProperty('--animation-duration');
        root.classList.remove('reduce-motion');
      }
    }
  }, [settings?.theme]);

  return <>{children}</>;
};