import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ 
  tasks, onEdit, isSelectionMode, selectedIds, setSelectedIds, setIsSelectionMode 
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <span style={{ fontSize: '32px' }}>✅</span>
        </div>
        <h3>ยังไม่มีงาน</h3>
        <p>เพิ่มงานใหม่เพื่อเริ่มจัดระเบียบสิ่งที่ต้องทำ</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {tasks.map((task, index) => (
        <div key={task.id} style={{ animationDelay: `${index * 50}ms` }}>
          <TodoItem 
            task={task} 
            onEdit={onEdit} 
            isSelectionMode={isSelectionMode}
            isSelected={selectedIds?.has(task.id)}
            onToggleSelect={(id) => {
              const next = new Set(selectedIds);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              setSelectedIds(next);
            }}
            onEnterSelection={() => setIsSelectionMode(true)}
          />
        </div>
      ))}
    </div>
  );
}
