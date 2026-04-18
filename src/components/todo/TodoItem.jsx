import React, { useState } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { PRIORITY_LEVELS } from '../../utils/helpers';
import { Check, ChevronDown, ChevronRight, Calendar, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { th } from 'date-fns/locale';

export default function TodoItem({ 
  task, onEdit, isSelectionMode, isSelected, onToggleSelect, onEnterSelection 
}) {
  const { toggleTask, toggleSubtask, deleteTask } = useTodo();
  const [expanded, setExpanded] = useState(false);
  
  // Gestures state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const longPressTimer = React.useRef(null);

  const priority = PRIORITY_LEVELS.find(p => p.value === task.priority);
  const hasSubtasks = task.subtasks?.length > 0;
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;

  const dueDateLabel = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    if (isToday(date)) return { text: 'วันนี้', color: 'var(--color-warning)' };
    if (isPast(date) && !task.completed) return { text: 'เลยกำหนด', color: 'var(--color-danger)' };
    return { text: format(date, 'd MMM', { locale: th }), color: 'var(--color-text-muted)' };
  };

  const due = dueDateLabel();

  // --- Long Press Logic ---
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      onEnterSelection && onEnterSelection();
      onToggleSelect && onToggleSelect(task.id);
      window.navigator.vibrate && window.navigator.vibrate(50);
    }, 600);
  };

  const stopLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // --- Swipe Logic ---
  const handleTouchStart = (e) => {
    if (isSelectionMode) return;
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
    startLongPress();
  };

  const handleTouchMove = (e) => {
    if (!isSwiping || isSelectionMode) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Only allow left swipe (negative offset) up to -80px
    if (diff < 0) {
      setSwipeOffset(Math.max(diff, -100));
      if (Math.abs(diff) > 10) stopLongPress();
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    stopLongPress();
    if (swipeOffset < -50) {
      setSwipeOffset(-90); // Snap to open
    } else {
      setSwipeOffset(0); // Snap to closed
    }
  };

  return (
    <div 
      className="todo-item-container" 
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}
      onMouseDown={startLongPress}
      onMouseUp={stopLongPress}
      onMouseLeave={stopLongPress}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe Delete Action (Behind) */}
      <div 
        onClick={(e) => { 
          e.stopPropagation();
          if(window.confirm('ลบงานนี้?')) deleteTask(task.id); 
        }}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '90px',
          background: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          zIndex: 1,
          opacity: swipeOffset < -15 ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Trash2 size={20} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>ลบ</span>
        </div>
      </div>

      <div
        className={`card ${isSelectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}
        style={{
          padding: '12px 16px',
          opacity: task.completed ? 0.6 : 1,
          transition: 'transform 0.2s ease, background 0.2s ease',
          animation: 'fadeInUp 300ms ease forwards',
          transform: `translateX(${swipeOffset}px)`,
          zIndex: 2,
          position: 'relative',
          cursor: isSelectionMode ? 'pointer' : 'default',
          border: isSelectionMode && isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border-light)',
          background: isSelectionMode && isSelected ? 'var(--color-bg-secondary)' : 'var(--color-surface)',
        }}
        onClick={() => {
          if (isSelectionMode) {
            onToggleSelect(task.id);
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          {/* Selection Checkbox */}
          {isSelectionMode && (
             <div style={{
               width: '22px',
               height: '22px',
               borderRadius: '50%',
               border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
               background: isSelected ? 'var(--color-primary)' : 'transparent',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               flexShrink: 0,
               marginTop: '1px',
               animation: 'fadeInScale 200ms ease',
             }}>
               {isSelected && <Check size={12} color="white" strokeWidth={4} />}
             </div>
          )}

          {/* Grip Handle (Only if NOT in selection mode) */}
          {!isSelectionMode && (
            <div style={{
              color: 'var(--color-text-muted)',
              cursor: 'grab',
              marginTop: '2px',
              opacity: 0.4,
              flexShrink: 0,
            }}>
              <GripVertical size={16} />
            </div>
          )}

          {/* Regular Checkbox (Hidden in selection mode) */}
          {!isSelectionMode && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                border: `2px solid ${task.completed ? 'var(--color-success)' : priority?.color || 'var(--color-border)'}`,
                background: task.completed ? 'var(--color-success)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              {task.completed && (
                <Check size={14} color="white" strokeWidth={3} style={{ animation: 'checkmark 300ms ease' }} />
              )}
            </button>
          )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Priority dot */}
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: priority?.color || 'var(--color-border)',
              flexShrink: 0,
            }} />

            {/* Title */}
            <span style={{
              fontWeight: 500,
              fontSize: 'var(--font-size-sm)',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
              flex: 1,
            }}>
              {task.title}
            </span>

            {/* Due Date Badge */}
            {due && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11px',
                color: due.color,
                fontWeight: 500,
              }}>
                <Calendar size={11} />
                {due.text}
              </span>
            )}

            {/* Edit & Delete */}
            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="btn btn-icon btn-ghost"
                style={{ width: '32px', height: '32px', opacity: 0.7 }}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (window.confirm('ลบงานนี้?')) deleteTask(task.id); 
                }}
                className="btn btn-icon btn-ghost"
                style={{ width: '32px', height: '32px', opacity: 0.7, color: 'var(--color-danger)' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
              lineHeight: 1.4,
            }}>
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
              {task.tags.map(tag => (
                <span key={tag} className="badge badge-green" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Subtasks Toggle */}
          {hasSubtasks && (
            <div style={{ marginTop: '8px' }}>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                รายการย่อย ({completedSubtasks}/{task.subtasks.length})
              </button>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '3px',
                background: 'var(--color-border-light)',
                borderRadius: '2px',
                marginTop: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(completedSubtasks / task.subtasks.length) * 100}%`,
                  height: '100%',
                  background: 'var(--color-success)',
                  borderRadius: '2px',
                  transition: 'width 300ms ease',
                }} />
              </div>

              {/* Subtask List */}
              {expanded && (
                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  paddingLeft: '4px',
                  animation: 'fadeInUp 200ms ease',
                }}>
                  {task.subtasks.map(st => (
                    <div key={st.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 0',
                    }}>
                      <button
                        onClick={() => toggleSubtask(task.id, st.id)}
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: `1.5px solid ${st.completed ? 'var(--color-success)' : 'var(--color-border)'}`,
                          background: st.completed ? 'var(--color-success)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        {st.completed && <Check size={10} color="white" strokeWidth={3} />}
                      </button>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        textDecoration: st.completed ? 'line-through' : 'none',
                        color: st.completed ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                      }}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
