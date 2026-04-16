import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateId } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { subscribeToCollection, saveDocument, updateDocument, deleteDocument } from '../utils/firestoreService';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const { currentUser } = useAuth();

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setEvents([]);
      return;
    }

    const unsub = subscribeToCollection(currentUser.uid, 'calendarEvents', (data) => {
      setEvents(data);
      setLoadingCalendar(false);
    });

    return () => unsub();
  }, [currentUser]);

  const addEvent = async (eventPayload) => {
    if (!currentUser) return;
    const newEvent = {
        id: generateId(),
        title: '',
        description: '',
        date: selectedDate,
        startTime: '09:00',
        endTime: '10:00',
        color: '#6B9080',
        repeat: 'none',
        reminder: false,
        createdAt: new Date().toISOString(),
        ...eventPayload,
    };
    await saveDocument(currentUser.uid, 'calendarEvents', newEvent);
  };

  const updateEvent = async (eventPayload) => {
    if (!currentUser) return;
    await updateDocument(currentUser.uid, 'calendarEvents', eventPayload.id, eventPayload);
  };

  const deleteEvent = async (id) => {
    if (!currentUser) return;
    await deleteDocument(currentUser.uid, 'calendarEvents', id);
  };

  const setMonth = (month, year) => {
      setCurrentMonth(month);
      setCurrentYear(year);
  }

  const prevMonth = () => {
      let month = currentMonth - 1;
      let year = currentYear;
      if (month < 0) { month = 11; year--; }
      setCurrentMonth(month);
      setCurrentYear(year);
  };

  const nextMonth = () => {
      let month = currentMonth + 1;
      let year = currentYear;
      if (month > 11) { month = 0; year++; }
      setCurrentMonth(month);
      setCurrentYear(year);
  };

  const goToday = () => {
      const today = new Date();
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
      setSelectedDate(today.toISOString().split('T')[0]);
  };

  const getEventsForDate = (dateStr) => {
    return events.filter(e => e.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getEventsForMonth = (month, year) => {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <CalendarContext.Provider value={{
      events, selectedDate, currentMonth, currentYear, loadingCalendar,
      addEvent, updateEvent, deleteEvent,
      setSelectedDate, setMonth, prevMonth, nextMonth, goToday,
      getEventsForDate, getEventsForMonth,
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within CalendarProvider');
  return context;
}
