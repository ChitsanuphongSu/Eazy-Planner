import React from 'react';
import Modal from './Modal';
import { useAppTheme } from '../../contexts/SettingsContext';
import { Moon, Sun, Bell, BellOff } from 'lucide-react';

const COLORS = [
  { id: 'green', name: 'Matcha Green', hex: '#6B9080' },
  { id: 'blue', name: 'Ocean Blue', hex: '#6B90D9' },
  { id: 'pink', name: 'Sakura Pink', hex: '#D96B90' },
  { id: 'purple', name: 'Lavender', hex: '#A36BD9' },
  { id: 'orange', name: 'Peach', hex: '#D9906B' },
];

export default function SettingsModal({ isOpen, onClose }) {
  const { themePrefs, changeTheme, changeColor, toggleNotifications } = useAppTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ตั้งค่าแอปพลิเคชัน" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Theme Toggle */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '12px'
          }}>
            ธีมหน้าจอ (Theme)
          </label>
          <div style={{
            display: 'flex', background: 'var(--color-bg)', padding: '4px',
            borderRadius: 'var(--radius-lg)', gap: '4px'
          }}>
            <button
              onClick={() => changeTheme('light')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: themePrefs.theme === 'light' ? 'var(--color-surface)' : 'transparent',
                color: themePrefs.theme === 'light' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                fontWeight: themePrefs.theme === 'light' ? 600 : 500,
                boxShadow: themePrefs.theme === 'light' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 200ms ease'
              }}
            >
              <Sun size={18} />
              สว่าง
            </button>
            <button
              onClick={() => changeTheme('dark')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: themePrefs.theme === 'dark' ? 'var(--color-surface)' : 'transparent',
                color: themePrefs.theme === 'dark' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                fontWeight: themePrefs.theme === 'dark' ? 600 : 500,
                boxShadow: themePrefs.theme === 'dark' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 200ms ease'
              }}
            >
              <Moon size={18} />
              มืด
            </button>
          </div>
        </div>

        {/* Color Picker */}
        <div>
           <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '12px'
          }}>
            สีหลัก (Primary Color)
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {COLORS.map(c => {
              const isActive = themePrefs.color === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => changeColor(c.id)}
                  title={c.name}
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: c.hex, cursor: 'pointer',
                    border: isActive ? `3px solid var(--color-surface)` : 'none',
                    outline: isActive ? `2px solid ${c.hex}` : 'none',
                    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 200ms ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                </button>
              );
            })}
          </div>
        </div>
        {/* Notifications Toggle */}
        <div style={{
          padding: '16px',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: 'var(--color-text)'
            }}>
              การแจ้งเตือน (Notifications)
            </label>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              รับสรุปงานเช้า 00:01 และเตือนก่อนเริ่ม 10 นาที
            </span>
          </div>
          <button
            onClick={toggleNotifications}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              background: themePrefs.notificationsEnabled ? 'var(--color-primary)' : 'var(--color-border)',
              color: themePrefs.notificationsEnabled ? 'white' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              transition: 'all 200ms ease'
            }}
          >
            {themePrefs.notificationsEnabled ? (
              <>
                <Bell size={16} />
                เปิด
              </>
            ) : (
              <>
                <BellOff size={16} />
                ปิด
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
