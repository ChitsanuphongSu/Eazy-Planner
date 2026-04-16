import React from 'react';
import { useCalendar } from '../../contexts/CalendarContext';
import { MONTHS_TH } from '../../utils/helpers';
import { hexToRgba } from '../../utils/helpers';

const WEEKDAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export default function CalendarGrid() {
  const { currentMonth, currentYear, selectedDate, setSelectedDate, events } = useCalendar();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Build calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - startDayOfWeek;
    if (dayOffset < 0) {
      // Previous month
      const day = prevMonthDays + dayOffset + 1;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, dateStr, isCurrentMonth: false });
    } else if (dayOffset >= daysInMonth) {
      // Next month
      const day = dayOffset - daysInMonth + 1;
      const m = currentMonth === 11 ? 0 : currentMonth + 1;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, dateStr, isCurrentMonth: false });
    } else {
      const day = dayOffset + 1;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, dateStr, isCurrentMonth: true });
    }
  }

  const getEventsForDateStr = (dateStr) => {
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-light)',
      overflow: 'hidden',
    }}>
      {/* Weekday Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--color-border-light)',
        background: 'var(--color-bg)',
      }}>
        {WEEKDAYS.map((day, i) => (
          <div key={day} style={{
            textAlign: 'center',
            padding: '10px 0',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            color: i === 0 ? 'var(--color-danger)' : 'var(--color-text-muted)',
            letterSpacing: '0.03em',
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
      }}>
        {cells.map((cell, i) => {
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const dayEvents = getEventsForDateStr(cell.dateStr);
          const dayOfWeek = i % 7;
          const isSunday = dayOfWeek === 0;

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(cell.dateStr)}
              style={{
                minHeight: '72px',
                padding: '6px',
                borderBottom: '1px solid var(--color-border-light)',
                borderRight: dayOfWeek < 6 ? '1px solid var(--color-border-light)' : 'none',
                cursor: 'pointer',
                background: isSelected
                  ? 'var(--color-accent)'
                  : isToday
                    ? 'var(--color-mint)'
                    : 'transparent',
                transition: 'background 150ms ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isSelected && !isToday) {
                  e.currentTarget.style.background = 'var(--color-surface-hover)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected && !isToday) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {/* Day Number */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '4px',
              }}>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isToday ? 700 : cell.isCurrentMonth ? 500 : 400,
                  color: !cell.isCurrentMonth
                    ? 'var(--color-text-muted)'
                    : isToday
                      ? 'var(--color-primary-dark)'
                      : isSunday
                        ? 'var(--color-danger)'
                        : 'var(--color-text)',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: isToday ? 'var(--color-primary)' : 'transparent',
                  ...(isToday && { color: '#fff' }),
                }}>
                  {cell.day}
                </span>
              </div>

              {/* Event Dots / Mini Events */}
              {dayEvents.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}>
                  {dayEvents.slice(0, 2).map(event => (
                    <div key={event.id} style={{
                      fontSize: '9px',
                      fontWeight: 500,
                      padding: '1px 4px',
                      borderRadius: '3px',
                      background: hexToRgba(event.color, 0.15),
                      color: event.color,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                    }}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span style={{
                      fontSize: '9px',
                      color: 'var(--color-text-muted)',
                      textAlign: 'center',
                    }}>
                      +{dayEvents.length - 2} อื่นๆ
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
