import React, { useState } from 'react';
import { useCalendar } from '../../contexts/CalendarContext';
import Modal from '../common/Modal';
import ColorPicker from '../common/ColorPicker';

export default function EventModal({ isOpen, onClose, editEvent = null }) {
  const { addEvent, updateEvent, deleteEvent, selectedDate } = useCalendar();

  const [form, setForm] = useState(() => {
    if (editEvent) {
      return {
        title: editEvent.title || '',
        description: editEvent.description || '',
        date: editEvent.date || selectedDate,
        startTime: editEvent.startTime || '09:00',
        endTime: editEvent.endTime || '10:00',
        color: editEvent.color || '#6B9080',
        repeat: editEvent.repeat || 'none',
        reminder: editEvent.reminder || false,
      };
    }
    return {
      title: '',
      description: '',
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00',
      color: '#6B9080',
      repeat: 'none',
      reminder: false,
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editEvent) {
      updateEvent({ ...form, id: editEvent.id });
    } else {
      addEvent(form);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editEvent) {
      deleteEvent(editEvent.id);
      onClose();
    }
  };

  const repeatOptions = [
    { value: 'none', label: 'ไม่ซ้ำ' },
    { value: 'daily', label: 'ทุกวัน' },
    { value: 'weekly', label: 'ทุกสัปดาห์' },
    { value: 'monthly', label: 'ทุกเดือน' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editEvent ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title */}
        <div className="input-group">
          <label>ชื่อกิจกรรม *</label>
          <input
            className="input"
            type="text"
            placeholder="ชื่อกิจกรรม..."
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="input-group">
          <label>รายละเอียด</label>
          <textarea
            className="input"
            placeholder="รายละเอียดเพิ่มเติม..."
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
          />
        </div>

        {/* Date */}
        <div className="input-group">
          <label>วันที่</label>
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        {/* Time */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>เวลาเริ่ม</label>
            <input
              className="input"
              type="time"
              value={form.startTime}
              onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))}
            />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>เวลาจบ</label>
            <input
              className="input"
              type="time"
              value={form.endTime}
              onChange={e => setForm(prev => ({ ...prev, endTime: e.target.value }))}
            />
          </div>
        </div>

        {/* Color */}
        <ColorPicker label="สีกิจกรรม" value={form.color} onChange={c => setForm(prev => ({ ...prev, color: c }))} />

        {/* Repeat */}
        <div className="input-group">
          <label>การซ้ำ</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {repeatOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, repeat: opt.value }))}
                style={{
                  flex: 1,
                  padding: '7px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: form.repeat === opt.value ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: form.repeat === opt.value ? '#fff' : 'var(--color-text-secondary)',
                  border: `1.5px solid ${form.repeat === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'center',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reminder */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            flex: 1,
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
          }}>
            <div
              onClick={() => setForm(prev => ({ ...prev, reminder: !prev.reminder }))}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                background: form.reminder ? 'var(--color-primary)' : 'var(--color-border)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 200ms ease',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: form.reminder ? '20px' : '2px',
                transition: 'left 200ms ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }} />
            </div>
            🔔 เตือนความจำ
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--color-border-light)' }}>
          {editEvent && (
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm" style={{ marginRight: 'auto' }}>
              ลบ
            </button>
          )}
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">ยกเลิก</button>
          <button type="submit" className="btn btn-primary btn-sm">{editEvent ? 'บันทึก' : 'เพิ่ม'}</button>
        </div>
      </form>
    </Modal>
  );
}
