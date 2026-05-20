import { COLOR_THEMES } from '../utils/colorThemes';

export default function ColorPicker({ value, onChange }) {
  return (
    <div>
      <label>Color Theme</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
        {COLOR_THEMES.map((t) => (
          <button
            key={t.primary}
            type="button"
            title={t.name}
            onClick={() => onChange(t.primary)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
              border: value === t.primary ? '3px solid #1a1a2e' : '3px solid transparent',
              cursor: 'pointer', transition: 'transform .15s',
              transform: value === t.primary ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
