import React, { useEffect, useRef } from 'react';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useCalendar } from '../../contexts/CalendarContext';
import { useTodo } from '../../contexts/TodoContext';
import { useAppTheme } from '../../contexts/SettingsContext';
import { addDays, format, isSameDay } from 'date-fns';

/**
 * NotificationManager handles periodic checks for schedule warnings 
 * and daily digest notifications.
 */
export default function NotificationManager() {
  const { items: scheduleItems } = useSchedule();
  const { events: calendarEvents } = useCalendar();
  const { todos } = useTodo();
  const { themePrefs } = useAppTheme();
  
  const lastAlerts = useRef({}); // Track already sent alerts { alertId: timestamp }
  
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
        const todayStr = format(now, 'yyyy-MM-dd');
        const nowHours = now.getHours();
        const nowMinutes = now.getMinutes();
        const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1; 

        // --- 1. Daily Digest (00:01) ---
        const lastDigestDate = localStorage.getItem('flowspace_last_digest');
        if (lastDigestDate !== todayStr) {
          let digestTitle = "สวัสดีตอนเช้าจาก FlowSpace! ☀️";
          let digestBody = "";

          const todaysEvents = calendarEvents.filter(e => e.date === todayStr);
          const todaysTodos = todos.filter(t => t.dueDate === todayStr && !t.completed);

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
        scheduleItems.forEach(item => {
          if (!item || item.startHour === undefined || Number(item.dayIndex) !== todayIndex) return;

          const itemStartTime = new Date(now);
          itemStartTime.setHours(item.startHour, item.startMinute || 0, 0, 0);

          const diffMinutes = (itemStartTime.getTime() - now.getTime()) / (1000 * 60);

          // Alert window: between 9 and 11 minutes before
          if (diffMinutes > 0 && diffMinutes <= 11) {
            const alertId = `sched_${item.id}_${todayStr}`;
            if (!lastAlerts.current[alertId]) {
              sendNotification(`เตรียมตัว! ${item.title}`, {
                body: `กำลังจะเริ่มในอีก 10 นาที (${String(item.startHour).padStart(2, '0')}:${String(item.startMinute || 0).padStart(2, '0')})`,
              });
              lastAlerts.current[alertId] = now.getTime();
            }
          }
        });

        // --- 3. Todo Deadlines (1 Day Before) ---
        todos.forEach(task => {
          if (!task.dueDate || task.completed) return;

          // Parse deadline date and time
          const deadlineDate = new Date(task.dueDate);
          if (task.dueTime) {
            const [h, m] = task.dueTime.split(':').map(Number);
            deadlineDate.setHours(h, m, 0, 0);
          } else {
            deadlineDate.setHours(9, 0, 0, 0); // Default to 9 AM if no time
          }

          // Target alert time: exactly 24 hours before the deadline
          const alertTime = new Date(deadlineDate.getTime() - (24 * 60 * 60 * 1000));
          const diffHours = (alertTime.getTime() - now.getTime()) / (1000 * 60 * 60);

          // Alert window: between 0 and 0.5 hours (30 mins) after the 1-day mark is reached
          // Actually, let's just use a simple date check + hour check to be robust.
          // If now is equal to or past alertTime, and it's still the same day as alertTime
          if (now >= alertTime && now.getTime() - alertTime.getTime() < 3600000) { // Within 1 hour of alert time
             const alertId = `todo_1d_${task.id}`;
             if (!lastAlerts.current[alertId]) {
               sendNotification(`งานใกล้กำหนดส่ง!`, {
                 body: `"${task.title}" จะถึงกำหนดในวันพรุ่งนี้${task.dueTime ? ' เวลา ' + task.dueTime : ''}`,
               });
               lastAlerts.current[alertId] = now.getTime();
             }
          }
        });

      } catch (err) {
        console.error("Notification lookup error:", err);
      }
    };

    // Check triggers more frequently (every 30 seconds)
    const interval = setInterval(checkTriggers, 30000);
    checkTriggers(); 

    return () => clearInterval(interval);
  }, [themePrefs.notificationsEnabled, scheduleItems, calendarEvents, todos]);

  return null; // Invisible component
}
