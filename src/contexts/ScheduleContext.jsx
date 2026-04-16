import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateId, SCHEDULE_CATEGORIES } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { subscribeToCollection, saveDocument, updateDocument, deleteDocument, subscribeToSettings, updateSettings as updateFirestoreSettings } from '../utils/firestoreService';

const ScheduleContext = createContext();

const defaultSettings = {
  startHour: 6,
  endHour: 22,
  showWeekend: true,
};

export function ScheduleProvider({ children }) {
  const { currentUser } = useAuth();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setItems([]);
      setCategories(SCHEDULE_CATEGORIES);
      setSettings(defaultSettings);
      return;
    }

    const unsubItems = subscribeToCollection(currentUser.uid, 'scheduleItems', (data) => {
      setItems(data);
      setLoadingSchedule(false);
    });

    const unsubCats = subscribeToCollection(currentUser.uid, 'scheduleCategories', (data) => {
       if (data.length === 0) {
          SCHEDULE_CATEGORIES.forEach(cat => {
            saveDocument(currentUser.uid, 'scheduleCategories', cat);
          });
          setCategories(SCHEDULE_CATEGORIES);
       } else {
          setCategories(data);
       }
    });

    const unsubSettings = subscribeToSettings(currentUser.uid, 'settings', 'schedule', (data) => {
       setSettings(data);
    }, defaultSettings);

    return () => {
      unsubItems();
      unsubCats();
      unsubSettings();
    };
  }, [currentUser]);

  const addItem = async (itemPayload) => {
    if (!currentUser) return;
    const newItem = { ...itemPayload, id: generateId(), createdAt: new Date().toISOString() };
    await saveDocument(currentUser.uid, 'scheduleItems', newItem);
  };

  const updateItem = async (itemPayload) => {
     if (!currentUser) return;
     await updateDocument(currentUser.uid, 'scheduleItems', itemPayload.id, itemPayload);
  };

  const deleteItem = async (id) => {
     if (!currentUser) return;
     await deleteDocument(currentUser.uid, 'scheduleItems', id);
  };

  const addCategory = async (catPayload) => {
     if (!currentUser) return;
     const newCat = { ...catPayload, id: generateId() };
     await saveDocument(currentUser.uid, 'scheduleCategories', newCat);
  };

  const updateCategory = async (catPayload) => {
     if (!currentUser) return;
     await updateDocument(currentUser.uid, 'scheduleCategories', catPayload.id, catPayload);
  };

  const deleteCategory = async (id) => {
     if (!currentUser) return;
     await deleteDocument(currentUser.uid, 'scheduleCategories', id);
  };

  const updateSettings = async (newSettings) => {
     if (!currentUser) return;
     const merged = { ...settings, ...newSettings };
     await updateFirestoreSettings(currentUser.uid, 'settings', 'schedule', merged);
  };

  const getItemsByDay = (dayIndex) => {
    return items.filter(item => item.dayIndex === dayIndex);
  };

  return (
    <ScheduleContext.Provider value={{
      items, categories, settings, loadingSchedule,
      addItem, updateItem, deleteItem,
      addCategory, updateCategory, deleteCategory,
      updateSettings, getItemsByDay,
    }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule must be used within ScheduleProvider');
  return context;
}
