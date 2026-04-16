import React, { useState, useMemo } from 'react';
import { useSchedule } from '../../contexts/ScheduleContext';
import { DAYS_OF_WEEK, DAYS_SHORT, hexToRgba } from '../../utils/helpers';
import { MapPin } from 'lucide-react';

export default function ScheduleGrid({ onClickSlot, onClickItem }) {
  const { items, categories, settings } = useSchedule();
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const daysToShow = settings.showWeekend ? 7 : 5;
  const hours = useMemo(() => {
    const h = [];
    for (let i = settings.startHour; i <= settings.endHour; i++) h.push(i);
    return h;
  }, [settings.startHour, settings.endHour]);

  const getItemsAtSlot = (dayIndex, hour) => {
    return items.filter(item =>
      item.dayIndex === dayIndex &&
      item.startHour <= hour &&
      (item.endHour > hour || (item.endHour === hour && item.endMinute > 0))
    );
  };

  const getItemStyle = (item) => {
    const sH = Number(item.startHour);
    const sM = Number(item.startMinute) || 0;
    const eH = Number(item.endHour);
    const eM = Number(item.endMinute) || 0;
    const refH = Number(settings.startHour);

    const startOffset = (sH - refH) * 60 + sM;
    const endOffset = (eH - refH) * 60 + eM;
    const duration = endOffset - startOffset;
    const top = (startOffset / 60) * 56;
    const height = Math.max((duration / 60) * 56 - 2, 26);

    return {
      position: 'absolute',
      top: `${top}px`,
      left: '2px',
      right: '2px',
      height: `${height}px`,
      background: `linear-gradient(135deg, ${item.color}, ${hexToRgba(item.color, 0.8)})`,
      borderRadius: 'var(--radius-sm)',
      padding: '4px 8px',
      color: '#fff',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 500,
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'transform 150ms ease, box-shadow 150ms ease',
      boxShadow: `0 2px 6px ${hexToRgba(item.color, 0.3)}`,
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: '1px',
    };
  };

  const getCategoryIcon = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.icon || '📌';
  };

  return (
    <div style={{
      display: 'flex',
      flex: 1,
      overflow: 'auto',
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-light)',
    }}>
      {/* Time Column */}
      <div style={{
        flexShrink: 0,
        width: '64px',
        borderRight: '1px solid var(--color-border-light)',
        background: 'var(--color-bg)',
      }}>
        <div style={{
          height: '44px',
          borderBottom: '1px solid var(--color-border-light)',
        }} />
        {hours.map(hour => (
          <div key={hour} style={{
            height: '56px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '4px',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
            borderBottom: '1px solid var(--color-border-light)',
          }}>
            {`${String(hour).padStart(2, '0')}:00`}
          </div>
        ))}
      </div>

      {/* Day Columns */}
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
        {Array.from({ length: daysToShow }).map((_, dayIndex) => {
          const today = new Date().getDay();
          const adjustedToday = today === 0 ? 6 : today - 1;
          const isToday = dayIndex === adjustedToday;
          const dayItems = items.filter(item => item.dayIndex === dayIndex);

          return (
            <div key={dayIndex} style={{
              flex: 1,
              minWidth: '120px',
              borderRight: dayIndex < daysToShow - 1 ? '1px solid var(--color-border-light)' : 'none',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Day Header */}
              <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 'var(--font-size-sm)',
                color: isToday ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: '1px solid var(--color-border-light)',
                background: isToday
                  ? 'linear-gradient(to bottom, var(--color-accent), var(--color-surface))'
                  : 'var(--color-bg)',
                position: 'relative',
              }}>
                {DAYS_SHORT[dayIndex]}
                {isToday && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    right: '20%',
                    height: '2px',
                    background: 'var(--color-primary)',
                    borderRadius: '2px 2px 0 0',
                  }} />
                )}
              </div>

              {/* Time Slots */}
              <div style={{ position: 'relative', flex: 1 }}>
                {/* Grid lines */}
                {hours.map(hour => {
                  const slotKey = `${dayIndex}-${hour}`;
                  const isHovered = hoveredSlot === slotKey;
                  return (
                    <div
                      key={hour}
                      style={{
                        height: '56px',
                        borderBottom: '1px solid var(--color-border-light)',
                        background: isHovered ? 'var(--color-surface-hover)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 150ms ease',
                      }}
                      onMouseEnter={() => setHoveredSlot(slotKey)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onClick={() => onClickSlot?.(dayIndex, hour)}
                    />
                  );
                })}

                {/* Schedule Items */}
                {dayItems.map(item => (
                  <div
                    key={item.id}
                    style={getItemStyle(item)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickItem?.(item);
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${hexToRgba(item.color, 0.4)}`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `0 2px 6px ${hexToRgba(item.color, 0.3)}`;
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ fontSize: '10px' }}>{getCategoryIcon(item.category)}</span>
                      <span className="truncate" style={{ fontWeight: 600, lineHeight: 1.2 }}>{item.title}</span>
                    </div>
                    <span style={{ opacity: 0.9, fontSize: '10px', lineHeight: 1 }}>
                      {`${String(item.startHour).padStart(2,'0')}:${String(item.startMinute||0).padStart(2,'0')} - ${String(item.endHour).padStart(2,'0')}:${String(item.endMinute||0).padStart(2,'0')}`}
                    </span>
                    {item.location && (
                      <span style={{ opacity: 0.85, fontSize: '9px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <MapPin size={8} /> {item.location}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
