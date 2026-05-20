const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी',   flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা',   flag: '🇧🇩' },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <div>
      <label>Message Language</label>
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => onChange(l.code)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
              border: value === l.code ? '2px solid #e91e8c' : '2px solid #f3e8ff',
              background: value === l.code ? '#fff0f8' : '#fff',
              fontWeight: value === l.code ? 600 : 400,
              fontSize: 13, transition: 'all .15s',
            }}
          >
            {l.flag} {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
