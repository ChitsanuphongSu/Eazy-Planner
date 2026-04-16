import React, { useState } from 'react';
import { PRESET_COLORS } from '../../utils/helpers';
import { Check } from 'lucide-react';

export default function ColorPicker({ value, onChange, label }) {
  const [customColor, setCustomColor] = useState(value || '#6B9080');

  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-light)',
      }}>
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: color,
              border: value === color ? '2px solid var(--color-text)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 150ms ease, border-color 150ms ease',
              transform: value === color ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            {value === color && <Check size={14} color="#fff" strokeWidth={3} />}
          </button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onChange(e.target.value);
            }}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: 0,
              background: 'none',
            }}
          />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>กำหนดเอง</span>
        </div>
      </div>
    </div>
  );
}
