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

    // Helper to send notification
    const sendNotification = (title, options) => {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/favicon.svg',
          ...options
        });
      }
    };

    const checkTriggers = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const nowHours = now.getHours();
      const nowMinutes = now.getMinutes();
      const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Mon, 6=Sun

      // --- 1. Daily Digest (00:01) ---
      // We check if we already notified for "today"
      const lastDigestDate = localStorage.getItem('flowspace_last_digest');
      if (lastDigestDate !== todayStr) {
        // It's a new day! We show the digest if it's past 00:01
        // (Even if they open the app at 08:00, we show it then)
        
        let digestTitle = "สวัสดีตอนเช้าจาก FlowSpace! ☀️";
        let digestBody = "";

        // Today's Events
        const todaysEvents = calendarEvents.filter(e => e.date === todayStr);
        // Today's Todos
        const todaysTodos = todos.filter(t => t.deadline === todayStr && !t.completed);

        if (todaysEvents.length > 0) {
          digestBody += `วันนี้คุณมี ${todaysEvents.length} กิจกรรมในปฏิทิน. `;
        }
        if (todaysTodos.length > 0) {
          digestBody += `วันนี้มี ${todaysTodos.length} งานที่ต้องทำให้เสร็จ. `;
        }

        if (digestBody) {
          sendNotification(digestTitle, { body: digestBody });
          localStorage.setItem('flowspace_last_digest', todayStr);
        } else if (nowHours > 0 || nowMinutes > 1) {
          // Mark today as notified even if nothing to show, to prevent checking every minute
           localStorage.setItem('flowspace_last_digest', todayStr);
        }
      }

      // --- 2. Schedule Warnings (10 mins before) ---
      const activeScheduleItems = scheduleItems.filter(item => Number(item.dayIndex) === todayIndex);
      
      activeScheduleItems.forEach(item => {
        const [startH, startM] = item.startTime.split(':').map(Number);
        const itemStartTime = new Date(now);
        itemStartTime.setHours(startH, startM, 0, 0);

        const diffMinutes = (itemStartTime.getTime() - now.getTime()) / (1000 * 60);

        // Alert if time is between 9 and 10 minutes before
        if (diffMinutes > 0 && diffMinutes <= 10.5 && diffMinutes >= 9.5) {
          const alertId = `${item.id}_${todayStr}`;
          if (!lastScheduleAlerts.current[alertId]) {
            sendNotification(`เตรียมตัว! ${item.title}`, {
              body: `กำลังจะเริ่มในอีก 10 นาที (เวลา ${item.startTime})`,
            });
            lastScheduleAlerts.current[alertId] = now.getTime();
          }
        }
      });
    };

    // Run every minute
    const interval = setInterval(checkTriggers, 60000);
    checkTriggers(); // Initial check

    return () => clearInterval(interval);
  }, [themePrefs.notificationsEnabled, scheduleItems, calendarEvents, todos]);

  return null; // Invisible component
}
