import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToSettings, updateSettings } from '../utils/firestoreService';

const SettingsContext = createContext();

const defaultThemeSettings = {
  theme: 'light',
  color: 'green',
};

export function SettingsProvider({ children }) {
  const { currentUser } = useAuth();
  const [themePrefs, setThemePrefs] = useState(defaultThemeSettings);

  // Apply theme securely
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themePrefs.theme);
    document.documentElement.setAttribute('data-color', themePrefs.color);
  }, [themePrefs]);

  useEffect(() => {
    if (!currentUser) {
      setThemePrefs(defaultThemeSettings);
      return;
    }

    const unsub = subscribeToSettings(
      currentUser.uid,
      'settings',
      'appTheme',
      (data) => {
        setThemePrefs(data);
      },
      defaultThemeSettings
    );

    return unsub;
  }, [currentUser]);

  const changeTheme = async (newTheme) => {
    const updated = { ...themePrefs, theme: newTheme };
    setThemePrefs(updated);
    if (currentUser) {
      await updateSettings(currentUser.uid, 'settings', 'appTheme', updated);
    }
  };

  const changeColor = async (newColor) => {
    const updated = { ...themePrefs, color: newColor };
    setThemePrefs(updated);
    if (currentUser) {
      await updateSettings(currentUser.uid, 'settings', 'appTheme', updated);
    }
  };

  return (
    <SettingsContext.Provider value={{ themePrefs, changeTheme, changeColor }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useAppTheme must be used within SettingsProvider');
  return context;
}
