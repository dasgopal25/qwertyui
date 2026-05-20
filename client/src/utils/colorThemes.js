export const COLOR_THEMES = [
  { name: 'Rose Pink',    primary: '#e91e8c', secondary: '#f472b6', bg: '#fff0f8' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#a78bfa', bg: '#f5f0ff' },
  { name: 'Ocean Blue',   primary: '#0ea5e9', secondary: '#38bdf8', bg: '#f0f9ff' },
  { name: 'Sunset Red',   primary: '#ef4444', secondary: '#f87171', bg: '#fff5f5' },
  { name: 'Forest Green', primary: '#16a34a', secondary: '#4ade80', bg: '#f0fdf4' },
  { name: 'Golden Amber', primary: '#d97706', secondary: '#fbbf24', bg: '#fffbeb' },
  { name: 'Midnight',     primary: '#1e293b', secondary: '#475569', bg: '#f8fafc' },
  { name: 'Coral',        primary: '#f97316', secondary: '#fb923c', bg: '#fff7f0' },
];

export const getTheme = (primaryColor) =>
  COLOR_THEMES.find((t) => t.primary === primaryColor) || COLOR_THEMES[0];
