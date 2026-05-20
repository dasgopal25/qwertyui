import { useEffect, useState } from 'react';

export default function CountdownTimer({ expiresAt }) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) { setRemaining('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: '#fff3cd', border: '1px solid #ffc107',
      borderRadius: 8, padding: '6px 14px', fontSize: 14,
    }}>
      ⏳ Link expires in: <strong style={{ fontFamily: 'monospace', fontSize: 16 }}>{remaining}</strong>
    </div>
  );
}
