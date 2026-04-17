import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Clock, Leaf, LogOut } from 'lucide-react';
import { useTodo } from '../../contexts/TodoContext';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/', icon: Clock, label: 'ตารางเรียน/งาน', emoji: '📅' },
  { path: '/todo', icon: CheckSquare, label: 'สิ่งที่ต้องทำ', emoji: '✅' },
  { path: '/calendar', icon: Calendar, label: 'ปฏิทิน', emoji: '📆' },
];

export default function Sidebar() {
  const location = useLocation();
  const { stats } = useTodo();
  const { currentUser, logout } = useAuth();

  return (
    <aside className="sidebar-wrapper">
      {/* Logo */}
      <div className="sidebar-logo-area" style={{
        padding: '24px 24px 20px',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(107, 144, 128, 0.3)',
          }}>
            <Leaf size={20} color="white" />
          </div>
          <div>
            <h2 style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
            }}>
              Planner
            </h2>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}>
              จัดการชีวิตให้เป็นระบบ
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav-list" style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-nav-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-accent)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 'var(--font-size-sm)',
                transition: 'all var(--transition-base)',
                textDecoration: 'none',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--color-surface-hover)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              {isActive && (
                <div className="sidebar-nav-indicator" style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  borderRadius: '0 4px 4px 0',
                  background: 'var(--color-primary)',
                  zIndex: 2,
                }} />
              )}
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info Details & Stats Footer */}
      <div className="sidebar-bottom-area" style={{
        padding: '16px 20px 20px',
        borderTop: '1px solid var(--color-border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>

        <div style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
        }}>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            marginBottom: '8px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            สรุปงาน
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                lineHeight: 1,
              }}>
                {stats.active}
              </div>
              <div style={{
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                marginTop: '2px',
              }}>ค้างอยู่</div>
            </div>
            <div style={{
              width: '1px',
              background: 'var(--color-border)',
            }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 700,
                color: 'var(--color-success)',
                lineHeight: 1,
              }}>
                {stats.completed}
              </div>
              <div style={{
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                marginTop: '2px',
              }}>เสร็จแล้ว</div>
            </div>
            {stats.urgent > 0 && (
              <>
                <div style={{
                  width: '1px',
                  background: 'var(--color-border)',
                }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 700,
                    color: 'var(--color-danger)',
                    lineHeight: 1,
                  }}>
                    {stats.urgent}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: 'var(--color-text-muted)',
                    marginTop: '2px',
                  }}>เร่งด่วน</div>
                </div>
              </>
            )}
          </div>
        </div>

        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: 'var(--color-bg)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
               {currentUser.photoURL ? (
                 <img src={currentUser.photoURL} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
               ) : (
                 <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                    {currentUser.displayName ? currentUser.displayName.charAt(0) : '?'}
                 </div>
               )}
               <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                 {currentUser.displayName || 'User'}
               </span>
            </div>
            <button 
              onClick={logout} 
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                transition: 'color 200ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              title="ออกจากระบบ"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
