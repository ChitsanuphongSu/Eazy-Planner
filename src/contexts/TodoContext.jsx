import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateId } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { subscribeToCollection, saveDocument, updateDocument, deleteDocument } from '../utils/firestoreService';

const TodoContext = createContext();

const defaultCategories = [
  { id: 'general', label: 'ทั่วไป', color: '#6B9080' },
  { id: 'study', label: 'การเรียน', color: '#6BA3D9' },
  { id: 'work', label: 'งาน', color: '#E8C547' },
  { id: 'personal', label: 'ส่วนตัว', color: '#9B8EC4' },
];

export function TodoProvider({ children }) {
  const { currentUser } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Load Tasks and Categories from Firestore
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setCategories(defaultCategories);
      return;
    }

    const unsubTasks = subscribeToCollection(currentUser.uid, 'tasks', (data) => {
      setTasks(data);
      setLoadingTasks(false);
    });

    const unsubCats = subscribeToCollection(currentUser.uid, 'todoCategories', (data) => {
       if (data.length === 0) {
          // Initialize default categories
          defaultCategories.forEach(cat => {
            saveDocument(currentUser.uid, 'todoCategories', cat);
          });
          setCategories(defaultCategories);
       } else {
          setCategories(data);
       }
    });

    return () => {
      unsubTasks();
      unsubCats();
    };
  }, [currentUser]);

  const addTask = async (taskPayload) => {
    if (!currentUser) return;
    const newTask = {
      id: generateId(),
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      tags: [],
      subtasks: [],
      completed: false,
      dueDate: null,
      createdAt: new Date().toISOString(),
      ...taskPayload,
    };
    await saveDocument(currentUser.uid, 'tasks', newTask);
  };

  const updateTask = async (taskPayload) => {
    if (!currentUser) return;
    await updateDocument(currentUser.uid, 'tasks', taskPayload.id, taskPayload);
  };

  const toggleTask = async (id) => {
    if (!currentUser) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await updateDocument(currentUser.uid, 'tasks', id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    });
  };

  const deleteTask = async (id) => {
    if (!currentUser) return;
    await deleteDocument(currentUser.uid, 'tasks', id);
  };

  const deleteMultipleTasks = async (ids) => {
    if (!currentUser || !ids || ids.length === 0) return;
    // For simplicity, we delete them one by one. In production, consider Firestore batched writes.
    await Promise.all(ids.map(id => deleteDocument(currentUser.uid, 'tasks', id)));
  };

  const reorderTasks = async (newTasks) => {
    if (!currentUser) return;
    // In a real production app, reordering might require batched writes.
    // For simplicity, we just rely on sorting locally or updating index fields.
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    if (!currentUser) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const subtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    await updateDocument(currentUser.uid, 'tasks', taskId, { subtasks });
  };

  const addCategory = async (catPayload) => {
    if (!currentUser) return;
    const newCat = { id: generateId(), ...catPayload };
    await saveDocument(currentUser.uid, 'todoCategories', newCat);
  };

  const deleteCategory = async (id) => {
    if (!currentUser) return;
    await deleteDocument(currentUser.uid, 'todoCategories', id);
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (filter !== 'all') {
      filtered = filtered.filter(t => t.category === filter);
    }

    // Tag Filtering (OR Logic)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(t => {
        const taskTags = t.tags || [];
        // Show task if:
        // 1. It matches one of the selected tags
        // 2. OR if '_NO_TAG_' is selected and it has no tags
        const matchTag = selectedTags.some(tag => tag !== '_NO_TAG_' && taskTags.includes(tag));
        const matchNoTag = selectedTags.includes('_NO_TAG_') && taskTags.length === 0;
        
        return matchTag || matchNoTag;
      });
    }

    switch (sortBy) {
      case 'priority': {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => (order[a.priority] ?? 2) - (order[b.priority] ?? 2));
        break;
      }
      case 'dueDate':
        filtered.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    urgent: tasks.filter(t => t.priority === 'urgent' && !t.completed).length,
  };

  return (
    <TodoContext.Provider value={{
      tasks, categories, filter, sortBy, searchQuery, selectedTags, loadingTasks, stats,
      addTask, updateTask, toggleTask, deleteTask, deleteMultipleTasks,
      reorderTasks, toggleSubtask,
      setFilter, setSortBy, setSearchQuery, setSelectedTags,
      addCategory, deleteCategory,
      getFilteredTasks,
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo must be used within TodoProvider');
  return context;
}
