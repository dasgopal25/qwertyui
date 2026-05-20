import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWish } from '../context/WishContext';
import { getWishTypes } from '../api/wishApi';

export default function Home() {
  const [types, setTypes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { update, setStep } = useWish();
  const navigate            = useNavigate();

  useEffect(() => {
    setStep(1);
    getWishTypes().then((r) => setTypes(r.data)).finally(() => setLoading(false));
  }, []);

  const select = (type) => {
    update({ wishType: type.id });
    setStep(2);
    navigate('/templates');
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', marginBottom: 40 }}>
        <h1 className="page-title">Create Beautiful Wish Websites</h1>
        <p style={{ color:'#6b7280', fontSize:16, marginTop:12, maxWidth:500, margin:'12px auto 0' }}>
          Choose an occasion and create a personalised wish website in minutes — just ₹49!
        </p>
      </motion.div>

      {loading ? <div className="spinner" /> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 }}>
          {types.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity:0, scale:.9 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay: i * .05 }}
              whileHover={{ y:-4, boxShadow:'0 8px 32px rgba(233,30,140,.2)' }}
              onClick={() => select(t)}
              style={{
                background:'#fff', border:'2px solid #f3e8ff', borderRadius:16,
                padding:'28px 16px', cursor:'pointer', textAlign:'center',
                transition:'all .2s',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}>{t.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{t.label}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{t.templateCount} templates</div>
            </motion.button>
          ))}
        </div>
      )}

      {/* How it works */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}} style={{marginTop:64,textAlign:'center'}}>
        <h2 style={{fontSize:'1.4rem',marginBottom:32,color:'#1a1a2e'}}>How It Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
          {[
            {icon:'🎨',step:'1',title:'Choose Template',desc:'Pick from 7-11 beautiful animated templates for your occasion'},
            {icon:'✍️',step:'2',title:'Add Details',desc:'Upload photos, names, a special date and personal message'},
            {icon:'💳',step:'3',title:'Pay ₹49',desc:'Complete payment via UPI QR code and send screenshot'},
            {icon:'🔗',step:'4',title:'Get Your Link',desc:'Receive your wish website link in 10-20 minutes. Valid 24 hours!'},
          ].map((h) => (
            <div key={h.step} className="card" style={{padding:'24px 20px',textAlign:'center'}}>
              <div style={{fontSize:36,marginBottom:12}}>{h.icon}</div>
              <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#e91e8c,#7c3aed)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,margin:'0 auto 10px'}}>{h.step}</div>
              <h3 style={{fontWeight:600,fontSize:15,marginBottom:6}}>{h.title}</h3>
              <p style={{fontSize:13,color:'#6b7280',lineHeight:1.5}}>{h.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
