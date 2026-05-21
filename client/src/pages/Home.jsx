import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useWish } from '../context/WishContext';
import { getWishTypes } from '../api/wishApi';

// ── Floating orb background ──────────────────────────────────────────────────
function Orb({ x, y, size, color, duration }) {
  return (
    <motion.div
      animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.15, 0.95, 1] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: color, filter: 'blur(60px)',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

// ── Sparkle ──────────────────────────────────────────────────────────────────
function Sparkle({ x, y, delay }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 0], rotate: [0, 180], opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 3 + Math.random() * 5 }}
      style={{ position: 'absolute', left: x, top: y, fontSize: 14, pointerEvents: 'none', zIndex: 1, userSelect: 'none' }}
    >✦</motion.div>
  );
}

// ── 3D Tilt Wish Card ────────────────────────────────────────────────────────
function WishCard({ type, index, onSelect }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-0.5, 0.5], [12, -12]);
  const rotY = useTransform(mx, [-0.5, 0.5], [-12, 12]);
  const glowX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(my, [-0.5, 0.5], ['0%', '100%']);
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  const CARD_GRADIENTS = [
    'linear-gradient(135deg,#FF6B9D,#FFD93D)',
    'linear-gradient(135deg,#c0392b,#FF6B9D)',
    'linear-gradient(135deg,#FF69B4,#FFD1DC)',
    'linear-gradient(135deg,#2980b9,#5dade2)',
    'linear-gradient(135deg,#e74c3c,#FF6384)',
    'linear-gradient(135deg,#F39C12,#FDCB6E)',
    'linear-gradient(135deg,#9B59B6,#F1948A)',
    'linear-gradient(135deg,#1ABC9C,#48C9B0)',
    'linear-gradient(135deg,#E67E22,#F8C471)',
    'linear-gradient(135deg,#AD1457,#F48FB1)',
    'linear-gradient(135deg,#8E44AD,#E91E8C)',
    'linear-gradient(135deg,#E91E8C,#9B59B6)',
  ];

  const grad = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 90, damping: 14 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={() => onSelect(type)}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 800, cursor: 'pointer', position: 'relative' }}
    >
      {/* Card body */}
      <motion.div
        animate={{ boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.2)` : `0 4px 20px rgba(0,0,0,0.08)` }}
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '32px 16px 24px',
          textAlign: 'center',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.8)',
        }}
      >
        {/* Gradient top stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: grad }} />

        {/* Moving glow on hover */}
        {hovered && (
          <motion.div
            style={{
              position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none', zIndex: 0,
              background: `radial-gradient(circle at ${glowX.get()*100}% ${glowY.get()*100}%, rgba(233,30,140,0.10), transparent 60%)`,
            }}
          />
        )}

        {/* Background pattern */}
        <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:'radial-gradient(circle, #e91e8c 1px, transparent 1px)', backgroundSize:'20px 20px', borderRadius:24 }} />

        {/* Emoji with ring */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14, zIndex: 1 }}>
          <motion.div
            animate={hovered ? { scale: [1, 1.25, 1.1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: 44, display: 'block', filter: hovered ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' : 'none' }}
          >
            {type.emoji}
          </motion.div>
          {hovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.6, 1.4, 1], opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
              style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: grad, zIndex: -1 }}
            />
          )}
        </div>

        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', lineHeight: 1.3, marginBottom: 6, zIndex: 1, position: 'relative' }}>
          {type.label}
        </div>

        <div style={{ fontSize: 11, color: '#9ca3af', zIndex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background: grad }} />
          {type.templateCount} templates
        </div>

        {/* Hover CTA */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: '#e91e8c', zIndex: 1, position: 'relative', letterSpacing: '0.05em' }}
            >
              CREATE NOW →
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Step card ────────────────────────────────────────────────────────────────
function StepCard({ icon, step, title, desc, index }) {
  const [hovered, setHovered] = useState(false);
  const STEP_COLORS = ['#FF6B9D', '#7c3aed', '#F39C12', '#1ABC9C'];
  const color = STEP_COLORS[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, type: 'spring' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#fff' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: 24,
        padding: '32px 24px',
        textAlign: 'center',
        border: `1.5px solid ${hovered ? color + '50' : 'rgba(255,255,255,0.8)'}`,
        boxShadow: hovered ? `0 16px 48px ${color}25` : '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Top accent */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, transformOrigin: 'left' }}
      />

      {/* Step number bubble */}
      <motion.div
        animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          color: '#fff', fontWeight: 900, fontSize: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: hovered ? `0 8px 24px ${color}50` : `0 4px 12px ${color}30`,
          transition: 'box-shadow 0.3s',
        }}
      >
        {step}
      </motion.div>

      <motion.div animate={{ scale: hovered ? 1.15 : 1 }} transition={{ type:'spring', stiffness:300 }} style={{ fontSize: 36, marginBottom: 12 }}>{icon}</motion.div>
      <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#1a1a2e' }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{desc}</p>
    </motion.div>
  );
}

// ── Hero counter ──────────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 40);
    const id = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [to]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [types, setTypes]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const { update, setStep }   = useWish();
  const navigate              = useNavigate();

  useEffect(() => {
    setStep(1);
    getWishTypes().then(r => setTypes(r.data)).finally(() => setLoading(false));
  }, []);

  const select = (type) => {
    update({ wishType: type.id });
    setStep(2);
    navigate('/templates');
  };

  const filtered = types.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  const sparkles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: `${5 + (i / 18) * 90}%`,
    y: `${10 + Math.sin(i) * 40 + Math.random() * 30}%`,
    delay: i * 0.4,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap');
        .home-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .wish-grid::-webkit-scrollbar { display: none; }
        @keyframes gradAnim { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: clamp(2.2rem, 6vw, 4rem);
          background: linear-gradient(135deg, #131011, #a896c6, #e91e8c, #FF6B9D);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradAnim 4s ease infinite;
          line-height: 1.1;
        }
        .price-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #e91e8c, #7c3aed);
          color: #fff; font-weight: 800; font-size: 18px;
          padding: 10px 24px; border-radius: 50px;
          box-shadow: 0 8px 32px rgba(233,30,140,0.4);
          animation: gradAnim 3s ease infinite;
          background-size: 200% 200%;
        }
        .search-input {
          width: 100%; max-width: 380px;
          padding: 14px 20px 14px 48px;
          border: 2px solid #f3e8ff;
          border-radius: 50px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          outline: none;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          transition: border-color 0.2s, box-shadow 0.2s;
          color: #1a1a2e;
        }
        .search-input:focus { border-color: #e91e8c; box-shadow: 0 0 0 4px rgba(233,30,140,0.1); }
        .search-wrap { position: relative; display: inline-block; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
      `}</style>

      <div className="home-root" style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff5fb 0%, #f9f0ff 50%, #fff9e8 100%)', position: 'relative', overflow: 'hidden' }}>

        {/* Background orbs */}
        <Orb x="-5%" y="5%"   size={500} color="rgba(233,30,140,0.12)"  duration={9} />
        <Orb x="70%" y="-5%"  size={420} color="rgba(124,58,237,0.10)"  duration={11} />
        <Orb x="30%" y="60%"  size={350} color="rgba(249,168,212,0.15)" duration={13} />
        <Orb x="80%" y="70%"  size={280} color="rgba(167,139,250,0.12)" duration={8} />

        {/* Sparkles */}
        {sparkles.map(s => <Sparkle key={s.id} {...s} />)}

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: 'clamp(48px,8vw,96px) 20px 0', position: 'relative', zIndex: 2 }}>

          {/* Pill tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 50, padding: '6px 16px', fontSize: 13, color: '#e91e8c', fontWeight: 600, marginBottom: 20 }}
          >
            <motion.span animate={{ rotate: [0, 20, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>✨</motion.span>
            India's #1 Wish Website Creator
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring' }}
          >
            Create Beautiful<br />Wish Websites
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ color: '#6b7280', fontSize: 'clamp(14px,2vw,17px)', marginTop: 16, maxWidth: 480, margin: '16px auto 0', lineHeight: 1.7, fontWeight: 400 }}
          >
            Choose an occasion, pick a template, personalise it — your special wish website is ready in minutes.
          </motion.p>

          {/* Price + CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 120 }}
            style={{ marginTop: 28, display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <span className="price-badge">⚡ Only ₹49</span>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>• Link valid 24 hours • Instant preview</span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}
          >
            {[
              { val: 5000, suffix: '+', label: 'Wishes Created' },
              { val: 12,   suffix: '',  label: 'Occasion Types' },
              { val: 99,   suffix: '%', label: 'Happy Customers' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: '#1a1a2e' }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── WISH TYPE GRID ────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 20px 0', position: 'relative', zIndex: 2 }}>

          {/* Section header + search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}
          >
            <div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.7rem)', color: '#1a1a2e', marginBottom: 4 }}>
                Select Your Occasion
              </h2>
              <p style={{ fontSize: 13, color: '#9ca3af' }}>
                {filtered.length} occasion types available
              </p>
            </div>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search occasion..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 60 }}>
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ y: [0, -16, 0] }} transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                  style={{ width: 12, height: 12, borderRadius: '50%', background: '#e91e8c' }} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 16 }}>
                {filtered.map((t, i) => (
                  <WishCard key={t.id} type={t} index={i} onSelect={select} />
                ))}
              </div>
              {filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
                  <div style={{ fontSize: 48 }}>🔍</div>
                  <p style={{ marginTop: 12 }}>No occasions found for "{search}"</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 20px 0', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 50, padding: '5px 14px', fontSize: 12, color: '#7c3aed', fontWeight: 600, marginBottom: 12 }}>
              HOW IT WORKS
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', color: '#1a1a2e' }}>
              Ready in 4 Simple Steps
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { icon:'🎨', step:'1', title:'Choose Template', desc:'Pick from 7–11 beautiful animated templates crafted for your occasion.' },
              { icon:'✍️', step:'2', title:'Add Details',    desc:'Upload photos, names, a special date, and your heartfelt message.' },
              { icon:'💳', step:'3', title:'Pay ₹49',        desc:'Complete payment via UPI QR code and send us the screenshot.' },
              { icon:'🔗', step:'4', title:'Get Your Link',  desc:'Receive your personal wish website link in 10–20 minutes!' },
            ].map((h, i) => <StepCard key={h.step} {...h} index={i} />)}
          </div>
        </div>

        {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 700, margin: '72px auto 0', padding: '0 20px 80px' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #e91e8c, #7c3aed)',
            borderRadius: 28, padding: 'clamp(32px,5vw,48px)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            boxShadow: '0 24px 72px rgba(233,30,140,0.3)',
          }}>
            {/* Decorative circles */}
            {[120,200,280].map(s => (
              <div key={s} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:s, height:s, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.12)', pointerEvents:'none' }} />
            ))}

            <motion.div animate={{ rotate: [0,10,-10,0], scale:[1,1.1,1] }} transition={{ duration:3, repeat:Infinity }} style={{ fontSize:56, marginBottom:16, display:'block', position:'relative', zIndex:1 }}>
              🌟
            </motion.div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:'clamp(1.4rem,3.5vw,1.9rem)', color:'#fff', marginBottom:10, position:'relative', zIndex:1 }}>
              Start Creating Now
            </h2>
            <p style={{ color:'rgba(255,255,255,0.85)', fontSize:15, marginBottom:24, lineHeight:1.6, position:'relative', zIndex:1 }}>
              Make someone's day unforgettable with a personalised wish website — just ₹49!
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background:'#fff', color:'#e91e8c', border:'none', borderRadius:50,
                padding:'14px 36px', fontWeight:800, fontSize:16, cursor:'pointer',
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                boxShadow:'0 8px 32px rgba(0,0,0,0.2)',
                position:'relative', zIndex:1,
              }}
            >
              Create Your Wish ✨
            </motion.button>
          </div>
        </motion.div>

      </div>
    </>
  );
}