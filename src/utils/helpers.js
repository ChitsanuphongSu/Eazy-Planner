import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const DAYS_OF_WEEK = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
export const DAYS_SHORT = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
export const DAYS_EN = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const MONTHS_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'ต่ำ', color: '#A4C3B2' },
  { value: 'medium', label: 'ปานกลาง', color: '#E8C547' },
  { value: 'high', label: 'สูง', color: '#E8A347' },
  { value: 'urgent', label: 'เร่งด่วน', color: '#D96B6B' },
];

export const PRESET_COLORS = [
  '#6B9080', '#A4C3B2', '#CCE3DE', '#7BC47F',
  '#6BA3D9', '#C9DEF4', '#9B8EC4', '#D5CCE3',
  '#D96B6B', '#E3CCCC', '#E8C547', '#E3DFCC',
  '#E8A347', '#E3D4CC', '#D97BA3', '#E3CCD5',
];

export const SCHEDULE_CATEGORIES = [
  { id: 'class', label: 'เรียน', color: '#6B9080', icon: '📚' },
  { id: 'work', label: 'งาน', color: '#6BA3D9', icon: '💼' },
  { id: 'exercise', label: 'ออกกำลังกาย', color: '#7BC47F', icon: '🏃' },
  { id: 'personal', label: 'ส่วนตัว', color: '#9B8EC4', icon: '🌟' },
  { id: 'meeting', label: 'ประชุม', color: '#E8C547', icon: '👥' },
  { id: 'other', label: 'อื่นๆ', color: '#E8A347', icon: '📌' },
];

// Local storage functions have been removed as we are using Firestore.

export function formatTime(hour, minute = 0) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function getTimeSlots(startHour = 6, endHour = 22) {
  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    slots.push(formatTime(h));
  }
  return slots;
}

export function hexToRgba(hex, alpha = 1) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}
