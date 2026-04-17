import React, { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import CalendarGrid from '../components/calendar/CalendarGrid';
import EventPanel from '../components/calendar/EventPanel';
import EventModal from '../components/calendar/EventModal';
import { MONTHS_TH } from '../utils/helpers';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

export default function CalendarPage() {
  const { currentMonth, currentYear, prevMonth, nextMonth, goToday } = useCalendar();
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const handleAddEvent = () => {
    setEditEvent(null);
    setModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditEvent(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          <span style={{ fontSize: '1.5rem' }}>📆</span>
          ปฏิทิน
        </h1>

        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={goToday} className="btn btn-secondary btn-sm">
            <CalendarDays size={14} />
            วันนี้
          </button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
          }}>
            <button onClick={prevMonth} className="btn btn-icon btn-ghost" style={{ width: '32px', height: '32px' }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{
              fontWeight: 600,
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text)',
              minWidth: '140px',
              textAlign: 'center',
            }}>
              {MONTHS_TH[currentMonth]} {currentYear + 543}
            </span>
            <button onClick={nextMonth} className="btn btn-icon btn-ghost" style={{ width: '32px', height: '32px' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="page-content calendar-layout" style={{
        display: 'flex',
        gap: 'var(--space-lg)',
        alignItems: 'flex-start',
      }}>
        {/* Calendar Grid */}
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <CalendarGrid />
        </div>

        {/* Event Sidebar */}
        <EventPanel
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
        />
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editEvent={editEvent}
      />
    </div>
  );
}
