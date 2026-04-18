import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToSettings, updateSettings } from '../utils/firestoreService';

const SettingsContext = createContext();

const defaultThemeSettings = {
  theme: 'light',
  color: 'green',
  notificationsEnabled: false,
};

export function SettingsProvider({ children }) {
  const { currentUser } = useAuth();
  const [themePrefs, setThemePrefs] = useState(defaultThemeSettings);

  // Apply theme securely
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themePrefs.theme);
    document.documentElement.setAttribute('data-color', themePrefs.color);
    
    // Dynamically update mobile browser status bar color to match the top header's surface color
    setTimeout(() => {
      const surfaceColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim();
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = "theme-color";
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', surfaceColor);
    }, 50);
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
        // Method 2: Sync profile info into the settings document for easy identification in Firebase Console
        if (!data.userEmail || data.userEmail !== currentUser.email) {
          updateSettings(currentUser.uid, 'settings', 'appTheme', { 
            userEmail: currentUser.email,
            lastSynced: new Date().toISOString() 
          });
        }
      },
      { ...defaultThemeSettings, userEmail: currentUser.email }
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

  const toggleNotifications = async () => {
    const currentState = themePrefs.notificationsEnabled;
    let newState = !currentState;

    if (newState) {
      // Request permission
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          newState = false;
          alert("กรุณาอนุญาตการแจ้งเตือนในตั้งค่าบราวเซอร์ของคุณ");
        }
      } else {
        alert("บราวเซอร์ของคุณไม่รองรับการแจ้งเตือน");
        newState = false;
      }
    }

    const updated = { ...themePrefs, notificationsEnabled: newState };
    setThemePrefs(updated);
    if (currentUser) {
      await updateSettings(currentUser.uid, 'settings', 'appTheme', updated);
    }
  };

  return (
    <SettingsContext.Provider value={{ themePrefs, changeTheme, changeColor, toggleNotifications }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useAppTheme must be used within SettingsProvider');
  return context;
}
