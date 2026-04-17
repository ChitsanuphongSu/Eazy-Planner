import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import TodoList from '../components/todo/TodoList';
import TodoModal from '../components/todo/TodoModal';
import { Plus, Search, SlidersHorizontal, Filter } from 'lucide-react';

export default function TodoPage() {
  const {
    filter, sortBy, searchQuery, categories,
    setFilter, setSortBy, setSearchQuery,
    getFilteredTasks, stats,
  } = useTodo();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = getFilteredTasks();

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  const filterTabs = [
    { id: 'all', label: 'ทั้งหมด', count: stats.total },
    { id: 'active', label: 'ยังไม่เสร็จ', count: stats.active },
    { id: 'completed', label: 'เสร็จแล้ว', count: stats.completed },
    ...categories.map(c => ({ id: c.id, label: c.label, count: null })),
  ];

  const sortOptions = [
    { id: 'createdAt', label: 'วันที่สร้าง' },
    { id: 'priority', label: 'ความสำคัญ' },
    { id: 'dueDate', label: 'กำหนดส่ง' },
    { id: 'title', label: 'ชื่อ' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          สิ่งที่ต้องทำ
        </h1>
        <button
          onClick={() => {
            setEditTask(null);
            setModalOpen(true);
          }}
          className="btn btn-primary btn-sm hide-on-mobile"
        >
          <Plus size={16} />
          เพิ่มงาน
        </button>
      </div>

      <div className="page-content">
        {/* Search & Filters Bar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{
            flex: '1 1 200px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 16px',
            transition: 'border-color 200ms ease',
          }}>
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="ค้นหางาน..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-sm ${showFilters ? 'btn-secondary' : 'btn-ghost'}`}
          >
            <Filter size={15} />
            กรอง
          </button>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={14} color="var(--color-text-muted)" />
            <select
              className="input"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '7px 32px 7px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                border: '1.5px solid var(--color-border)',
              }}
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        {showFilters && (
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            animation: 'fadeInUp 200ms ease',
          }}>
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 500,
                  background: filter === tab.id ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: filter === tab.id ? '#fff' : 'var(--color-text-secondary)',
                  border: `1.5px solid ${filter === tab.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {tab.label}
                {tab.count !== null && (
                  <span style={{
                    background: filter === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--color-bg)',
                    padding: '0 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Task Count */}
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          marginBottom: '12px',
          fontWeight: 500,
        }}>
          {filteredTasks.length} รายการ
        </div>

        {/* Task List */}
        <TodoList tasks={filteredTasks} onEdit={handleEdit} />
      </div>

      {/* FAB for mobile */}
      <button
        onClick={() => {
          setEditTask(null);
          setModalOpen(true);
        }}
        className="fab show-on-mobile"
      >
        <Plus size={24} />
      </button>

      <TodoModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editTask={editTask}
      />
    </div>
  );
}
