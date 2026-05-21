import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { getWishBySlug } from '../api/wishApi';
import CountdownTimer from '../components/CountdownTimer';
import ExpiredPage from './ExpiredPage';

// ─── Particle System ──────────────────────────────────────────────────────────
function Particle({ color, delay, startX, emoji }) {
  const isEmoji = !!emoji;
  return (
    <motion.div
      initial={{ x: startX, y: '110vh', opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        y: '-10vh',
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        rotate: Math.random() > 0.5 ? 720 : -720,
        x: startX + (Math.random() - 0.5) * 200,
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 6,
        ease: 'easeInOut',
      }}
      style={{
        position: 'fixed',
        fontSize: isEmoji ? 20 + Math.random() * 16 : undefined,
        width: isEmoji ? undefined : 8 + Math.random() * 8,
        height: isEmoji ? undefined : 8 + Math.random() * 8,
        background: isEmoji ? undefined : color,
        borderRadius: isEmoji ? undefined : Math.random() > 0.5 ? '50%' : '2px',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Tilt Card ────────────────────────────────────────────────────────────────
function TiltCard({ children, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ text, speed = 28 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span>
      {displayed}
      {!done && <span style={{ animation: 'blink 0.7s infinite', borderRight: '2px solid currentColor' }}>&nbsp;</span>}
    </span>
  );
}

// ─── Floating Hearts ──────────────────────────────────────────────────────────
function FloatingHeart({ color, delay, x }) {
  return (
    <motion.div
      initial={{ y: 0, x, opacity: 0, scale: 0 }}
      animate={{ y: -80, opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 3 + Math.random() * 4 }}
      style={{ position: 'absolute', fontSize: 18, pointerEvents: 'none', zIndex: 10, color }}
    >
      ❤️
    </motion.div>
  );
}

// ─── Wish type config ─────────────────────────────────────────────────────────
const WISH_CONFIG = {
  birthday:       { icon: '🎂', particles: ['🎉','🎈','🎁','✨','🎊','⭐'], colors: ['#FF6B9D','#FFD93D','#6BCB77','#4D96FF','#FF6B35'], gradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFD93D 50%, #6BCB77 100%)', bg: 'linear-gradient(160deg, #fff5fb 0%, #fff9e8 100%)' },
  anniversary:    { icon: '💕', particles: ['❤️','🌹','💫','✨','🥂','💑'], colors: ['#FF4B7B','#FF85A1','#FFB347','#FF6B9D'], gradient: 'linear-gradient(135deg, #c0392b 0%, #FF4B7B 50%, #FFB347 100%)', bg: 'linear-gradient(160deg, #fff5f7 0%, #fff0f5 100%)' },
  'mothers-day':  { icon: '💐', particles: ['🌸','💮','🌺','🌼','💝','🦋'], colors: ['#FF85A1','#FFB6C1','#FF69B4','#FFA0C0'], gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF85A1 50%, #FFD1DC 100%)', bg: 'linear-gradient(160deg, #fff0f8 0%, #fff5f0 100%)' },
  'fathers-day':  { icon: '👨', particles: ['⭐','💙','🏆','👔','🎖️','💪'], colors: ['#2980b9','#3498db','#5dade2','#85c1e9'], gradient: 'linear-gradient(135deg, #1a5276 0%, #2980b9 50%, #5dade2 100%)', bg: 'linear-gradient(160deg, #f0f8ff 0%, #e8f4fd 100%)' },
  valentines:     { icon: '❤️', particles: ['❤️','💋','🌹','💌','💘','✨'], colors: ['#FF1744','#FF4569','#FF6384','#FF85A1'], gradient: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #FF6384 100%)', bg: 'linear-gradient(160deg, #fff5f5 0%, #fff0f2 100%)' },
  friendship:     { icon: '👫', particles: ['🌟','✨','🎵','🎶','🤝','💛'], colors: ['#F39C12','#F1C40F','#FDCB6E','#FAB1A0'], gradient: 'linear-gradient(135deg, #F39C12 0%, #F1C40F 50%, #FDCB6E 100%)', bg: 'linear-gradient(160deg, #fffbf0 0%, #fff9e8 100%)' },
  'womens-day':   { icon: '🌸', particles: ['🌸','🦋','💜','✨','🌺','💐'], colors: ['#9B59B6','#AF7AC5','#D2B4DE','#F1948A'], gradient: 'linear-gradient(135deg, #7D3C98 0%, #9B59B6 50%, #F1948A 100%)', bg: 'linear-gradient(160deg, #f9f0ff 0%, #fff0f8 100%)' },
  'teachers-day': { icon: '📚', particles: ['📚','⭐','🎓','✏️','💡','🌟'], colors: ['#1ABC9C','#48C9B0','#76D7C4','#A9DFBF'], gradient: 'linear-gradient(135deg, #1a5276 0%, #1ABC9C 50%, #48C9B0 100%)', bg: 'linear-gradient(160deg, #f0fff8 0%, #e8f8f5 100%)' },
  'first-meeting':{ icon: '🤝', particles: ['✨','⭐','🌟','💫','🎊','🌈'], colors: ['#E67E22','#F39C12','#F8C471','#FAD7A0'], gradient: 'linear-gradient(135deg, #E67E22 0%, #F39C12 50%, #F8C471 100%)', bg: 'linear-gradient(160deg, #fff8f0 0%, #fff5e8 100%)' },
  'period-day':   { icon: '🌷', particles: ['🌷','💗','🌸','💕','🤗','💖'], colors: ['#E91E8C','#F06292','#F48FB1','#F8BBD9'], gradient: 'linear-gradient(135deg, #AD1457 0%, #E91E8C 50%, #F48FB1 100%)', bg: 'linear-gradient(160deg, #fff0f8 0%, #fff5fb 100%)' },
  custom:         { icon: '🌟', particles: ['🌟','✨','💫','⭐','🎊','🎉'], colors: ['#8E44AD','#9B59B6','#AF7AC5','#7D3C98'], gradient: 'linear-gradient(135deg, #8E44AD 0%, #E91E8C 50%, #F39C12 100%)', bg: 'linear-gradient(160deg, #f9f0ff 0%, #fff9e8 100%)' },
  surprise:       { icon: '🎊', particles: ['🎊','🎉','✨','⭐','🌟','💫'], colors: ['#E91E8C','#9B59B6','#F39C12','#1ABC9C'], gradient: 'linear-gradient(135deg, #E91E8C 0%, #9B59B6 50%, #F39C12 100%)', bg: 'linear-gradient(160deg, #fff5fb 0%, #fff9e8 100%)' },
};

// ─── Glitter Overlay ──────────────────────────────────────────────────────────
function GlitterDot({ x, y, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 2 + Math.random() * 5 }}
      style={{
        position: 'fixed', left: `${x}%`, top: `${y}%`,
        width: 4, height: 4, borderRadius: '50%',
        background: color, boxShadow: `0 0 6px ${color}`,
        pointerEvents: 'none', zIndex: 1,
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WishPage() {
  const { slug } = useParams();
  const [data, setData]           = useState(null);
  const [expired, setExpired]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [revealed, setRevealed]   = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);

  useEffect(() => {
    getWishBySlug(slug)
      .then((r) => setData(r.data))
      .catch((err) => { if (err.response?.data?.message === 'expired') setExpired(true); })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (data) {
      setTimeout(() => setShowEnvelope(false), 2200);
      setTimeout(() => setRevealed(true), 2800);
    }
  }, [data]);

  // Auto slideshow
  useEffect(() => {
    if (!data?.photos?.length || data.photos.length < 2) return;
    const id = setInterval(() => setCurrentPhoto(p => (p + 1) % data.photos.length), 4000);
    return () => clearInterval(id);
  }, [data]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff5fb' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 56 }}>✨</motion.div>
    </div>
  );
  if (expired || !data) return <ExpiredPage />;

  const cfg     = WISH_CONFIG[data.wishType] || WISH_CONFIG.custom;
  const primary = data.colorTheme || cfg.colors[0];
  const label   = data.wishType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Generate particles
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    emoji: i % 3 === 0 ? cfg.particles[i % cfg.particles.length] : null,
    color: cfg.colors[i % cfg.colors.length],
    delay: (i * 0.4) % 7,
    startX: `${(i / 28) * 100}vw`,
  }));

  const glitters = Array.from({ length: 20 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    delay: i * 0.3, color: cfg.colors[i % cfg.colors.length],
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&family=Dancing+Script:wght@600;700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.4);opacity:0} }
        @keyframes spin-slow { 100%{transform:rotate(360deg)} }
        .shimmer-text {
          background: linear-gradient(90deg, ${primary}, ${cfg.colors[1] || '#fff'}, ${primary}, ${cfg.colors[0]});
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .float-icon { animation: floatY 3s ease-in-out infinite; }
        .glass {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
        }
      `}</style>

      {/* Background */}
      <div style={{ minHeight: '100vh', background: cfg.bg, position: 'relative', overflow: 'hidden', fontFamily: "'Lato', sans-serif" }}>

        {/* Animated gradient orbs */}
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'fixed', top: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${primary}30, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
        <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${cfg.colors[1] || primary}25, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

        {/* Particles */}
        {particles.map(p => <Particle key={p.id} {...p} />)}
        {glitters.map(g => <GlitterDot key={g.id} {...g} />)}

        {/* ── Envelope Opening Animation ── */}
        <AnimatePresence>
          {showEnvelope && (
            <motion.div
              exit={{ opacity: 0, scale: 0.5, y: -100 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: [0, 1.2, 1], rotate: [- 15, 5, 0] }}
                transition={{ duration: 0.8, ease: 'backOut' }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  animate={{ rotateX: [0, -40, 0] }}
                  transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
                  style={{ fontSize: 100, display: 'block', transformStyle: 'preserve-3d' }}
                >
                  💌
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  style={{ color: '#fff', fontSize: 22, fontFamily: "'Dancing Script', cursive", marginTop: 12 }}
                >
                  Opening your special wish...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Content ── */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px 60px', position: 'relative', zIndex: 2 }}
            >
              {/* Countdown */}
              {data.expiresAt && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ textAlign: 'center', marginBottom: 20 }}>
                  <CountdownTimer expiresAt={data.expiresAt} />
                </motion.div>
              )}

              {/* ── HERO BANNER ── */}
              <TiltCard style={{ marginBottom: 20 }}>
                <motion.div
                  initial={{ y: 60, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
                  className="glass"
                  style={{ borderRadius: 32, overflow: 'hidden', boxShadow: `0 32px 80px ${primary}40, 0 8px 32px rgba(0,0,0,0.12)` }}
                >
                  {/* Gradient header */}
                  <div style={{ background: cfg.gradient, padding: '48px 32px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    {/* Decorative rings */}
                    {[1,2,3].map(i => (
                      <motion.div key={i}
                        animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                        transition={{ duration: 3, delay: i * 0.8, repeat: Infinity }}
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 80 * i, height: 80 * i, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.3)`, pointerEvents: 'none' }}
                      />
                    ))}

                    {/* Decorative dots */}
                    {Array.from({length:12},(_,i) => (
                      <div key={i} style={{ position:'absolute', width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.3)', top:`${10+Math.random()*80}%`, left:`${5+Math.random()*90}%` }} />
                    ))}

                    <motion.div
                      className="float-icon"
                      style={{ fontSize: 88, display: 'block', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))', position: 'relative', zIndex: 1 }}
                    >
                      {cfg.icon}
                    </motion.div>

                    <motion.h1
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#fff', marginTop: 16, fontStyle: 'italic', textShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'relative', zIndex: 1 }}
                    >
                      {label} ✨
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginTop: 10, fontWeight: 300, letterSpacing: '0.05em', position: 'relative', zIndex: 1 }}
                    >
                      A heartfelt wish for <strong style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22 }}>{data.recipientName}</strong>
                    </motion.p>

                    {/* Floating hearts at bottom */}
                    <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', pointerEvents: 'none' }}>
                      {[0,1,2,3,4].map(i => <FloatingHeart key={i} color="rgba(255,255,255,0.8)" delay={i * 0.8} x={0} />)}
                    </div>
                  </div>

                  {/* ── Photo Gallery ── */}
                  {data.photos?.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                      style={{ padding: '28px 28px 0', background: 'rgba(255,255,255,0.5)' }}
                    >
                      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: `0 12px 40px ${primary}25` }}>
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentPhoto}
                            src={data.photos[currentPhoto]}
                            initial={{ opacity: 0, scale: 1.05, x: 40 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -40 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: '100%', maxHeight: 340, objectFit: 'contain', display: 'block', background: '#f8f8f8' }}
                          />
                        </AnimatePresence>

                        {/* Photo overlay gradient */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, rgba(0,0,0,0.15))' }} />

                        {/* Nav arrows */}
                        {data.photos.length > 1 && (
                          <>
                            <button onClick={() => setCurrentPhoto(p => (p - 1 + data.photos.length) % data.photos.length)}
                              style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.15)' }}>‹</button>
                            <button onClick={() => setCurrentPhoto(p => (p + 1) % data.photos.length)}
                              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.15)' }}>›</button>
                          </>
                        )}
                      </div>

                      {/* Dot indicators */}
                      {data.photos.length > 1 && (
                        <div style={{ display:'flex', justifyContent:'center', gap:6, padding:'12px 0 4px' }}>
                          {data.photos.map((_, i) => (
                            <motion.button key={i} onClick={() => setCurrentPhoto(i)}
                              animate={{ width: i === currentPhoto ? 24 : 8, background: i === currentPhoto ? primary : '#d1d5db' }}
                              style={{ height:8, borderRadius:4, border:'none', cursor:'pointer', padding:0 }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── Message Card ── */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ padding: '32px 32px 28px', background: 'rgba(255,255,255,0.6)' }}
                  >
                    {/* Decorative quote mark */}
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 80, color: primary, opacity: 0.15, lineHeight: 0.8, marginBottom: -10, userSelect:'none' }}>"</div>

                    <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 2, color: '#374151', fontFamily: "'Lato', sans-serif", fontWeight: 300, padding: '0 8px' }}>
                      <Typewriter text={data.message} speed={20} />
                    </p>

                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 80, color: primary, opacity: 0.15, lineHeight: 0.8, textAlign: 'right', marginTop: -20, userSelect:'none' }}>"</div>

                    {/* Divider */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
                      <div style={{ flex:1, height:1, background:`linear-gradient(to right, transparent, ${primary}40)` }} />
                      <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize:20 }}>💌</motion.span>
                      <div style={{ flex:1, height:1, background:`linear-gradient(to left, transparent, ${primary}40)` }} />
                    </div>

                    {/* Sender */}
                    <div style={{ textAlign:'center' }}>
                      <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5 }}
                        style={{ fontFamily:"'Dancing Script', cursive", fontSize:'clamp(1.3rem,3.5vw,1.7rem)', color: primary, marginBottom: 6 }}
                      >
                        With all my love, <strong>{data.senderName}</strong> 💕
                      </motion.p>
                      {data.specialDate && (
                        <p style={{ fontSize:13, color:'#9ca3af', letterSpacing:'0.05em' }}>
                          📅 {new Date(data.specialDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </TiltCard>

              {/* ── Share Buttons ──
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap', marginBottom:24 }}
              >
                {[
                  { label:'Share on WhatsApp', icon:'💬', bg:'#25d366', fn: () => window.open(`https://wa.me/?text=${encodeURIComponent(`💌 A special wish for you! ${window.location.href}`)}`) },
                  { label:'Copy Link', icon:'🔗', bg: primary, fn: () => { navigator.clipboard.writeText(window.location.href); } },
                ].map(b => (
                  <motion.button key={b.label} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} onClick={b.fn}
                    style={{ background: b.bg, color:'#fff', border:'none', borderRadius:50, padding:'10px 22px', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow:`0 4px 16px ${b.bg}50` }}>
                    {b.icon} {b.label}
                  </motion.button>
                ))}
              </motion.div> */}

              {/* Footer */}
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.6 }}
                style={{ textAlign:'center', fontSize:12, color:'#9ca3af', letterSpacing:'0.06em' }}>
                Made with ❤️ using <span className="shimmer-text" style={{ fontWeight:700, fontSize:13 }}>Wish Creator</span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}