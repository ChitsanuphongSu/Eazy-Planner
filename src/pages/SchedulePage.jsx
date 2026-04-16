import React, { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import ScheduleModal from '../components/schedule/ScheduleModal';
import { Plus, Settings, Eye, EyeOff } from 'lucide-react';

export default function SchedulePage() {
  const { settings, updateSettings } = useSchedule();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [defaultSlot, setDefaultSlot] = useState({ day: 0, hour: 9 });
  const [showSettings, setShowSettings] = useState(false);

  const handleClickSlot = (dayIndex, hour) => {
    setEditItem(null);
    setDefaultSlot({ day: dayIndex, hour });
    setModalOpen(true);
  };

  const handleClickItem = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          <span style={{ fontSize: '1.5rem' }}>📅</span>
          ตารางเรียน/งาน
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-ghost btn-sm"
            style={{ gap: '6px' }}
          >
            <Settings size={16} />
            ตั้งค่า
          </button>
          <button
            onClick={() => {
              setEditItem(null);
              setDefaultSlot({ day: 0, hour: 9 });
              setModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            เพิ่มรายการ
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{
          margin: '0 var(--space-xl) var(--space-md)',
          padding: '16px 20px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-light)',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 200ms ease forwards',
        }}>
          <div className="input-group" style={{ minWidth: '120px' }}>
            <label>เริ่มที่ชั่วโมง</label>
            <select
              className="input"
              value={settings.startHour}
              onChange={e => updateSettings({ startHour: parseInt(e.target.value) })}
              style={{ padding: '6px 10px' }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{`${String(i).padStart(2, '0')}:00`}</option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{ minWidth: '120px' }}>
            <label>จบที่ชั่วโมง</label>
            <select
              className="input"
              value={settings.endHour}
              onChange={e => updateSettings({ endHour: parseInt(e.target.value) })}
              style={{ padding: '6px 10px' }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{`${String(i).padStart(2, '0')}:00`}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => updateSettings({ showWeekend: !settings.showWeekend })}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '18px' }}
          >
            {settings.showWeekend ? <Eye size={14} /> : <EyeOff size={14} />}
            {settings.showWeekend ? 'ซ่อนเสาร์-อาทิตย์' : 'แสดงเสาร์-อาทิตย์'}
          </button>
        </div>
      )}

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <ScheduleGrid onClickSlot={handleClickSlot} onClickItem={handleClickItem} />
      </div>

      <ScheduleModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editItem={editItem}
        defaultDay={defaultSlot.day}
        defaultHour={defaultSlot.hour}
      />
    </div>
  );
}
