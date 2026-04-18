import React, { useEffect, useRef } from 'react';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useCalendar } from '../../contexts/CalendarContext';
import { useTodo } from '../../contexts/TodoContext';
import { useAppTheme } from '../../contexts/SettingsContext';

/**
 * NotificationManager handles periodic checks for schedule warnings 
 * and daily digest notifications (at 00:01).
 */
export default function NotificationManager() {
  const { items: scheduleItems } = useSchedule();
  const { events: calendarEvents } = useCalendar();
  const { todos } = useTodo();
  const { themePrefs } = useAppTheme();
  
  const lastScheduleAlerts = useRef({}); // Track already sent schedule alerts { itemId: lastAlarmTime }
  
  useEffect(() => {
    if (!themePrefs.notificationsEnabled) return;
    if (!("Notification" in window)) return;

    // Helper to send notification
    const sendNotification = (title, options) => {
      try {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            icon: '/favicon.svg',
            ...options
          });
        }
      } catch (err) {
        console.error("Failed to send notification:", err);
      }
    };

    const checkTriggers = () => {
      try {
        if (!scheduleItems || !calendarEvents || !todos) return;

        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
        const nowHours = now.getHours();
        const nowMinutes = now.getMinutes();
        const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1; 

        // --- 1. Daily Digest (00:01) ---
        const lastDigestDate = localStorage.getItem('flowspace_last_digest');
        if (lastDigestDate !== todayStr) {
          let digestTitle = "สวัสดีตอนเช้าจาก FlowSpace! ☀️";
          let digestBody = "";

          const todaysEvents = calendarEvents.filter(e => e.date === todayStr);
          const todaysTodos = todos.filter(t => t.deadline === todayStr && !t.completed);

          if (todaysEvents.length > 0) {
            digestBody += `วันนี้คุณมี ${todaysEvents.length} กิจกรรม. `;
          }
          if (todaysTodos.length > 0) {
            digestBody += `วันนี้มี ${todaysTodos.length} งานที่ต้องส่ง. `;
          }

          if (digestBody) {
            sendNotification(digestTitle, { body: digestBody });
            localStorage.setItem('flowspace_last_digest', todayStr);
          } else if (nowHours > 0 || nowMinutes > 1) {
             localStorage.setItem('flowspace_last_digest', todayStr);
          }
        }

        // --- 2. Schedule Warnings (10 mins before) ---
        const activeScheduleItems = scheduleItems.filter(item => 
          item && item.startTime && Number(item.dayIndex) === todayIndex
        );
        
        activeScheduleItems.forEach(item => {
          const timeParts = item.startTime.split(':');
          if (timeParts.length !== 2) return;

          const [startH, startM] = timeParts.map(Number);
          const itemStartTime = new Date(now);
          itemStartTime.setHours(startH, startM, 0, 0);

          const diffMinutes = (itemStartTime.getTime() - now.getTime()) / (1000 * 60);

          if (diffMinutes > 0 && diffMinutes <= 10.5 && diffMinutes >= 9.5) {
            const alertId = `${item.id}_${todayStr}`;
            if (!lastScheduleAlerts.current[alertId]) {
              sendNotification(`เตรียมตัว! ${item.title}`, {
                body: `กำลังจะเริ่มในอีก 10 นาที (${item.startTime})`,
              });
              lastScheduleAlerts.current[alertId] = now.getTime();
            }
          }
        });
      } catch (err) {
        console.error("Notification lookup error:", err);
      }
    };

    const interval = setInterval(checkTriggers, 60000);
    checkTriggers(); 

    return () => clearInterval(interval);
  }, [themePrefs.notificationsEnabled, scheduleItems, calendarEvents, todos]);

  return null; // Invisible component
}
