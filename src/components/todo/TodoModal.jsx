import React, { useState } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import Modal from '../common/Modal';
import ColorPicker from '../common/ColorPicker';
import { PRIORITY_LEVELS, generateId } from '../../utils/helpers';
import { Plus, Trash2, X } from 'lucide-react';

export default function TodoModal({ isOpen, onClose, editTask = null }) {
  const { addTask, updateTask, deleteTask, categories } = useTodo();

  const [form, setForm] = useState(() => {
    if (editTask) {
      return {
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'medium',
        category: editTask.category || 'general',
        dueDate: editTask.dueDate || '',
        tags: editTask.tags || [],
        subtasks: editTask.subtasks || [],
      };
    }
    return {
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      dueDate: '',
      tags: [],
      subtasks: [],
    };
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editTask) {
      updateTask({ ...form, id: editTask.id });
    } else {
      addTask(form);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editTask) {
      deleteTask(editTask.id);
      onClose();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addSubtask = () => {
    setForm(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: generateId(), title: '', completed: false }],
    }));
  };

  const updateSubtask = (id, title) => {
    setForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => st.id === id ? { ...st, title } : st),
    }));
  };

  const removeSubtask = (id) => {
    setForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== id),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTask ? 'แก้ไขงาน' : 'เพิ่มงานใหม่'} size="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title */}
        <div className="input-group">
          <label>ชื่องาน *</label>
          <input
            className="input"
            type="text"
            placeholder="สิ่งที่ต้องทำ..."
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

        {/* Priority & Category Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Priority */}
          <div className="input-group" style={{ flex: 1 }}>
            <label>ความสำคัญ</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {PRIORITY_LEVELS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, priority: p.value }))}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: form.priority === p.value ? p.color : 'var(--color-bg)',
                    color: form.priority === p.value ? '#fff' : 'var(--color-text-secondary)',
                    border: `1.5px solid ${form.priority === p.value ? p.color : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    textAlign: 'center',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="input-group">
          <label>หมวดหมู่</label>
          <select
            className="input"
            value={form.category}
            onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="input-group">
          <label>กำหนดส่ง</label>
          <input
            className="input"
            type="date"
            value={form.dueDate}
            onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>

        {/* Tags */}
        <div className="input-group">
          <label>แท็ก</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              className="input"
              type="text"
              placeholder="พิมพ์แท็ก แล้วกด Enter..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={addTag} className="btn btn-secondary btn-sm">
              เพิ่ม
            </button>
          </div>
          {form.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {form.tags.map(tag => (
                <span key={tag} className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  #{tag}
                  <X
                    size={12}
                    style={{ cursor: 'pointer', opacity: 0.7 }}
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks */}
        <div className="input-group">
          <label>รายการย่อย</label>
          {form.subtasks.map((st, i) => (
            <div key={st.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', width: '20px' }}>
                {i + 1}.
              </span>
              <input
                className="input"
                type="text"
                placeholder="รายการย่อย..."
                value={st.title}
                onChange={e => updateSubtask(st.id, e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={() => removeSubtask(st.id)} className="btn btn-icon btn-ghost" style={{ flexShrink: 0 }}>
                <Trash2 size={14} color="var(--color-danger)" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubtask}
            className="btn btn-ghost btn-sm"
            style={{ alignSelf: 'flex-start', color: 'var(--color-primary)' }}
          >
            <Plus size={14} /> เพิ่มรายการย่อย
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--color-border-light)' }}>
          {editTask && (
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm" style={{ marginRight: 'auto' }}>
              ลบ
            </button>
          )}
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">ยกเลิก</button>
          <button type="submit" className="btn btn-primary btn-sm">{editTask ? 'บันทึก' : 'เพิ่ม'}</button>
        </div>
      </form>
    </Modal>
  );
}
