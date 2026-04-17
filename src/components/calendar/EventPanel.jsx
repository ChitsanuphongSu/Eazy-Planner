import React from 'react';
import { useCalendar } from '../../contexts/CalendarContext';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Clock, Edit2, Trash2, Plus, CalendarDays } from 'lucide-react';
import { hexToRgba } from '../../utils/helpers';

export default function EventPanel({ onAddEvent, onEditEvent }) {
  const { selectedDate, getEventsForDate, deleteEvent } = useCalendar();
  const dayEvents = getEventsForDate(selectedDate);

  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const formattedDate = format(selectedDateObj, 'EEEE d MMMM yyyy', { locale: th });
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="calendar-sidebar" style={{
      width: '320px',
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-light)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideInRight 300ms ease forwards',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--color-border-light)',
        background: isToday
          ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
          : 'var(--color-bg)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px',
        }}>
          <CalendarDays size={16} color={isToday ? '#fff' : 'var(--color-primary)'} />
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            color: isToday ? 'rgba(255,255,255,0.8)' : 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {isToday ? 'วันนี้' : 'วันที่เลือก'}
          </span>
        </div>
        <h3 style={{
          fontSize: 'var(--font-size-base)',
          fontWeight: 600,
          color: isToday ? '#fff' : 'var(--color-text)',
        }}>
          {formattedDate}
        </h3>
      </div>

      {/* Events List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
      }}>
        {dayEvents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--color-text-muted)',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '20px',
            }}>
              📅
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>ไม่มีกิจกรรม</p>
            <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>คลิกปุ่มด้านล่างเพื่อเพิ่ม</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dayEvents.map(event => (
              <div
                key={event.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: hexToRgba(event.color, 0.08),
                  borderLeft: `3px solid ${event.color}`,
                  transition: 'all 150ms ease',
                  animation: 'fadeInUp 200ms ease forwards',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = hexToRgba(event.color, 0.14);
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = hexToRgba(event.color, 0.08);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: '4px',
                    }}>
                      {event.title}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-muted)',
                    }}>
                      <Clock size={12} />
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.description && (
                      <p style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-muted)',
                        marginTop: '6px',
                        lineHeight: 1.4,
                      }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                    <button
                      onClick={() => onEditEvent(event)}
                      className="btn btn-icon btn-ghost"
                      style={{ width: '28px', height: '28px', opacity: 0.6 }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="btn btn-icon btn-ghost"
                      style={{ width: '28px', height: '28px', opacity: 0.6, color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {event.repeat !== 'none' && (
                  <span className="badge badge-blue" style={{ marginTop: '6px', fontSize: '10px' }}>
                    🔁 {event.repeat === 'daily' ? 'ทุกวัน' : event.repeat === 'weekly' ? 'ทุกสัปดาห์' : 'ทุกเดือน'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Button */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--color-border-light)' }}>
        <button
          onClick={onAddEvent}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Plus size={16} />
          เพิ่มกิจกรรม
        </button>
      </div>
    </div>
  );
}
