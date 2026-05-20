import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #f3e8ff',
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 20px',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/">
          <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.6rem', fontWeight: 700, background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🌟 Wish Creator
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isAdmin && <Link to="/" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Create Wish</Link>}
          {isAdmin && <span style={{ fontSize: 13, color: '#6b7280' }}>Admin Panel</span>}
        </div>
      </div>
    </motion.nav>
  );
}
