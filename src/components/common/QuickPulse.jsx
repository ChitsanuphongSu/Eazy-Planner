import React, { useState } from 'react';
import { CheckSquare, X, ChevronRight, Check } from 'lucide-react';
import { useTodo } from '../../contexts/TodoContext';
import StatsWidget from './StatsWidget';

export default function QuickPulse() {
  const [isOpen, setIsOpen] = useState(false);
  const { getFilteredTasks, toggleTask, stats } = useTodo();

  const activeTasks = getFilteredTasks().filter(t => !t.completed);

  return (
    <>
      {/* Summary FAB (Rounded Square) */}
      <button
        onClick={() => setIsOpen(true)}
        className="quick-pulse-fab show-on-mobile"
        style={{
          position: 'fixed',
          bottom: '85px',
          left: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '14px', // Rounded Square
          background: 'var(--color-primary)',
          color: 'var(--color-text-inverse)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 90,
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <CheckSquare size={24} />
        {stats.active > 0 && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'var(--color-danger)',
            color: 'white',
            fontSize: '10px',
            fontWeight: 700,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--color-surface)',
          }}>
            {stats.active}
          </div>
        )}
      </button>

      {/* Dashboard Overlay (Bottom Sheet) */}
      <div 
        className={`quick-pulse-overlay ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          display: isOpen ? 'block' : 'none',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className="quick-pulse-sheet"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px 20px calc(24px + env(safe-area-inset-bottom))',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>สรุปงานของคุณ</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                สำรวจข้อมูลและงานที่ค้างทั้งหมด
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: '50%', color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Stats Section */}
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '4px' }}>
             <StatsWidget variant="sidebar" />
          </div>

          {/* Task List Section */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
               <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>งานที่ค้าง ({activeTasks.length})</h4>
            </div>

            {activeTasks.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🍃</div>
                  <p style={{ fontSize: 'var(--font-size-sm)' }}>ไม่มีงานค้างแล้ว เยี่ยมเลย!</p>
               </div>
            ) : (
              activeTasks.map((task) => (
                <div 
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-light)',
                  }}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: '2px solid var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      background: 'transparent',
                    }}
                  >
                    {task.completed && <Check size={16} />}
                  </button>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.title}
                    </div>
                    {task.category && (
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                        {task.category}
                      </span>
                    )}
                  </div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: task.priority === 'urgent' ? 'var(--color-danger)' : 
                               task.priority === 'high' ? 'var(--color-warning)' : 'transparent'
                  }} />
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <button 
             onClick={() => { setIsOpen(false); window.location.hash = '/todo'; }}
             style={{
               width: '100%',
               padding: '14px',
               background: 'var(--color-bg-secondary)',
               borderRadius: 'var(--radius-md)',
               color: 'var(--color-primary-dark)',
               fontWeight: 600,
               fontSize: 'var(--font-size-sm)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '8px'
             }}
          >
            จัดการงานทั้งหมด <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
