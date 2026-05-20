import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getWishBySlug } from '../api/wishApi';
import CountdownTimer from '../components/CountdownTimer';
import ExpiredPage from './ExpiredPage';

// Simple confetti animation
function Confetti({ color }) {
  return (
    <motion.div
      initial={{ top: '-5%', left: `${Math.random()*100}%`, opacity: 1, rotate: 0 }}
      animate={{ top: '105%', opacity: [1,1,0], rotate: Math.random()*720 }}
      transition={{ duration: 3 + Math.random()*2, delay: Math.random()*3, repeat: Infinity, repeatDelay: Math.random()*4 }}
      style={{ position:'fixed', width:10, height:10, background:color, borderRadius:2, zIndex:999, pointerEvents:'none' }}
    />
  );
}

const WISH_ICONS = { birthday:'🎂', anniversary:'💕', 'mothers-day':'💐', 'fathers-day':'👨', valentines:'❤️', friendship:'👫', 'womens-day':'🌸', 'teachers-day':'📚', 'first-meeting':'🤝', 'period-day':'🩸', custom:'🌟', surprise:'✨' };

export default function WishPage() {
  const { slug } = useParams();
  const [data, setData]     = useState(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    getWishBySlug(slug)
      .then((r) => setData(r.data))
      .catch((err) => {
        if (err.response?.data?.message === 'expired') setExpired(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontSize:40 }}>⏳</div>;
  if (expired || !data) return <ExpiredPage />;

  const primary = data.colorTheme || '#e91e8c';
  const icon    = WISH_ICONS[data.wishType] || '🌟';

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(135deg,${primary}15,${primary}05,white)`, position:'relative', overflow:'hidden' }}>
      {/* Confetti */}
      {['#e91e8c','#7c3aed','#f59e0b','#10b981','#3b82f6','#ef4444'].map((c,i) => <Confetti key={i} color={c} />)}

      {/* Main content */}
      <div style={{ maxWidth:700, margin:'0 auto', padding:'40px 20px', position:'relative', zIndex:2 }}>

        {/* Countdown */}
        {data.expiresAt && (
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <CountdownTimer expiresAt={data.expiresAt} />
          </div>
        )}

        {/* Hero card */}
        <motion.div
          initial={{ opacity:0, scale:.9 }}
          animate={{ opacity:1, scale:1 }}
          style={{
            background:'rgba(255,255,255,0.95)', borderRadius:24,
            boxShadow:`0 20px 60px ${primary}30`,
            border:`2px solid ${primary}30`,
            overflow:'hidden', marginBottom:20,
          }}
        >
          {/* Header */}
          <div style={{ background:`linear-gradient(135deg,${primary},${primary}cc)`, padding:'40px 32px', textAlign:'center' }}>
            <motion.div animate={{ scale:[1,1.15,1], rotate:[0,10,-10,0] }} transition={{ duration:2, repeat:Infinity }} style={{ fontSize:80 }}>
              {icon}
            </motion.div>
            <h1 style={{ fontFamily:"'Dancing Script',cursive", fontSize:'2.8rem', color:'#fff', marginTop:12, textShadow:'0 2px 8px rgba(0,0,0,.2)' }}>
              {data.wishType?.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} ✨
            </h1>
            <p style={{ color:'rgba(255,255,255,.9)', fontSize:16, marginTop:8 }}>
              A special message for <strong>{data.recipientName}</strong>
            </p>
          </div>

          {/* Photos */}
          {data.photos?.length > 0 && (
            <div style={{ padding:'28px 32px 0', textAlign:'center' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto}
                  src={data.photos[currentPhoto]}
                  initial={{ opacity:0, scale:.95 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0 }}
                  style={{ width:'100%', maxHeight:320, objectFit:'cover', borderRadius:16, border:`3px solid ${primary}30` }}
                />
              </AnimatePresence>
              {data.photos.length > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:12 }}>
                  {data.photos.map((_, i) => (
                    <button key={i} onClick={() => setCurrentPhoto(i)} style={{ width:10, height:10, borderRadius:'50%', border:'none', background:i===currentPhoto?primary:'#e5e7eb', cursor:'pointer' }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <div style={{ padding:'32px' }}>
            <div style={{ fontSize:48, textAlign:'center', marginBottom:16 }}>💌</div>
            <p style={{ fontSize:17, lineHeight:1.9, color:'#374151', textAlign:'center', fontStyle:'italic', background:`${primary}08`, borderRadius:12, padding:'20px 24px', border:`1px solid ${primary}20` }}>
              {data.message}
            </p>

            <div style={{ textAlign:'center', marginTop:24 }}>
              <p style={{ fontSize:20, fontFamily:"'Dancing Script',cursive", color:primary }}>
                With love, <strong>{data.senderName}</strong> 💕
              </p>
              {data.specialDate && (
                <p style={{ fontSize:14, color:'#6b7280', marginTop:8 }}>
                  📅 {new Date(data.specialDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p style={{ textAlign:'center', fontSize:13, color:'#9ca3af' }}>
          Made with ❤️ using <strong style={{ color:primary }}>Wish Creator</strong>
        </p>
      </div>
    </div>
  );
}
