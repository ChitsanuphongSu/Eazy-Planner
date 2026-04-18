import React from 'react';
import { useTodo } from '../../contexts/TodoContext';

/**
 * StatsWidget displays task statistics (Active, Completed, Urgent).
 * @param {Object} props
 * @param {string} props.variant - 'sidebar' or 'mobile'
 */
export default function StatsWidget({ variant = 'sidebar' }) {
  const { stats } = useTodo();

  const isMobile = variant === 'mobile';

  const containerStyle = isMobile ? {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    background: 'var(--color-surface)',
    padding: '12px 20px',
    borderBottom: '1px solid var(--color-border-light)',
    animation: 'slideDown 0.3s ease-out'
  } : {
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px'
  };

  const itemStyle = {
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '8px' : '2px'
  };

  const numberStyle = {
    fontSize: isMobile ? '1.1rem' : 'var(--font-size-xl)',
    fontWeight: 700,
    lineHeight: 1,
  };

  const labelStyle = {
    fontSize: isMobile ? 'var(--font-size-xs)' : '10px',
    color: 'var(--color-text-muted)',
    fontWeight: 500,
    textTransform: isMobile ? 'none' : 'uppercase',
  };

  const Divider = () => (
    <div style={{
      width: '1px',
      background: 'var(--color-border)',
      alignSelf: 'stretch',
    }} />
  );

  return (
    <div className={`stats-widget variant-${variant}`} style={containerStyle}>
      {/* Active Tasks */}
      <div style={itemStyle}>
        <div style={{ ...numberStyle, color: 'var(--color-primary)' }}>
          {stats.active}
        </div>
        <div style={labelStyle}>ค้างอยู่</div>
      </div>

      <Divider />

      {/* Completed Tasks */}
      <div style={itemStyle}>
        <div style={{ ...numberStyle, color: 'var(--color-success)' }}>
          {stats.completed}
        </div>
        <div style={labelStyle}>เสร็จแล้ว</div>
      </div>

      {stats.urgent > 0 && (
        <>
          <Divider />
          {/* Urgent Tasks */}
          <div style={itemStyle}>
            <div style={{ ...numberStyle, color: 'var(--color-danger)' }}>
              {stats.urgent}
            </div>
            <div style={labelStyle}>เร่งด่วน</div>
          </div>
        </>
      )}
    </div>
  );
}
