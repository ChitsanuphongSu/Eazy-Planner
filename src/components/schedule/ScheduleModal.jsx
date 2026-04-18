import React, { useState, useEffect } from 'react';
import { useSchedule } from '../../contexts/ScheduleContext';
import Modal from '../common/Modal';
import ColorPicker from '../common/ColorPicker';
import { formatTime } from '../../utils/helpers';

export default function ScheduleModal({ isOpen, onClose, editItem = null, defaultDay = 0, defaultHour = 9 }) {
  const { addItem, updateItem, deleteItem, categories } = useSchedule();

  const [form, setForm] = useState({
    title: '',
    dayIndex: defaultDay,
    startHour: defaultHour,
    startMinute: 0,
    endHour: defaultHour + 1,
    endMinute: 0,
    category: 'class',
    color: '#6B9080',
    location: '',
    note: '',
  });

  // Sync form when editItem changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setForm({
          title: editItem.title || '',
          dayIndex: editItem.dayIndex ?? 0,
          startHour: editItem.startHour ?? 9,
          startMinute: editItem.startMinute ?? 0,
          endHour: editItem.endHour ?? 10,
          endMinute: editItem.endMinute ?? 0,
          category: editItem.category || 'class',
          color: editItem.color || '#6B9080',
          location: editItem.location || '',
          note: editItem.note || '',
        });
      } else {
        setForm({
          title: '',
          dayIndex: defaultDay,
          startHour: defaultHour,
          startMinute: 0,
          endHour: defaultHour + 1,
          endMinute: 0,
          category: 'class',
          color: '#6B9080',
          location: '',
          note: '',
        });
      }
    }
  }, [editItem, isOpen, defaultDay, defaultHour]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editItem) {
      updateItem({ ...form, id: editItem.id });
    } else {
      addItem(form);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editItem) {
      deleteItem(editItem.id);
      onClose();
    }
  };

  const handleCategoryChange = (catId) => {
    const cat = categories.find(c => c.id === catId);
    setForm(prev => ({
      ...prev,
      category: catId,
      color: cat ? cat.color : prev.color,
    }));
  };

  const dayOptions = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'} size="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title */}
        <div className="input-group">
          <label>ชื่อรายการ *</label>
          <input
            className="input"
            type="text"
            placeholder="เช่น คณิตศาสตร์, ประชุมทีม..."
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            autoFocus
          />
        </div>

        {/* Day */}
        <div className="input-group">
          <label>วัน</label>
          <select
            className="input"
            value={form.dayIndex}
            onChange={(e) => setForm(prev => ({ ...prev, dayIndex: parseInt(e.target.value) }))}
          >
            {dayOptions.map((day, i) => (
              <option key={i} value={i}>{day}</option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>เวลาเริ่ม</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="input" value={form.startHour} onChange={e => setForm(prev => ({ ...prev, startHour: parseInt(e.target.value) }))}>
                {hourOptions.map(h => <option key={h} value={h}>{formatTime(h)}</option>)}
              </select>
              <select className="input" value={form.startMinute} onChange={e => setForm(prev => ({ ...prev, startMinute: parseInt(e.target.value) }))}>
                {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>เวลาจบ</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="input" value={form.endHour} onChange={e => setForm(prev => ({ ...prev, endHour: parseInt(e.target.value) }))}>
                {hourOptions.map(h => <option key={h} value={h}>{formatTime(h)}</option>)}
              </select>
              <select className="input" value={form.endMinute} onChange={e => setForm(prev => ({ ...prev, endMinute: parseInt(e.target.value) }))}>
                {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="input-group">
          <label>หมวดหมู่</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 500,
                  background: form.category === cat.id ? cat.color : 'var(--color-bg)',
                  color: form.category === cat.id ? '#fff' : 'var(--color-text-secondary)',
                  border: `1.5px solid ${form.category === cat.id ? cat.color : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <ColorPicker label="สี" value={form.color} onChange={(c) => setForm(prev => ({ ...prev, color: c }))} />

        {/* Location */}
        <div className="input-group">
          <label>สถานที่ (ไม่จำเป็น)</label>
          <input
            className="input"
            type="text"
            placeholder="เช่น ห้อง 301, ออนไลน์..."
            value={form.location}
            onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        {/* Note */}
        <div className="input-group">
          <label>บันทึก (ไม่จำเป็น)</label>
          <textarea
            className="input"
            placeholder="หมายเหตุเพิ่มเติม..."
            value={form.note}
            onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))}
            rows={2}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--color-border-light)' }}>
          {editItem && (
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm" style={{ marginRight: 'auto' }}>
              ลบ
            </button>
          )}
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">ยกเลิก</button>
          <button type="submit" className="btn btn-primary btn-sm">{editItem ? 'บันทึก' : 'เพิ่ม'}</button>
        </div>
      </form>
    </Modal>
  );
}
