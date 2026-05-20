import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWish } from '../context/WishContext';

export default function ThankYou() {
  const { slug } = useWish();

  return (
    <div className="container" style={{ padding:'60px 20px', textAlign:'center' }}>
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', bounce:.5 }} style={{ fontSize:80, marginBottom:24 }}>
        🎉
      </motion.div>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}>
        <h1 className="page-title" style={{ marginBottom:16 }}>Thank You!</h1>
        <div className="card" style={{ maxWidth:480, margin:'0 auto', padding:32 }}>
          <p style={{ fontSize:16, lineHeight:1.8, color:'#374151', marginBottom:20 }}>
            Your wish is being prepared with love. 💕<br />
            Our team will verify your payment and activate your wish website link within
            <strong style={{ color:'#e91e8c' }}> 10–20 minutes</strong>.
          </p>
          <div style={{ background:'#fff0f8', border:'2px solid #f9a8d4', borderRadius:10, padding:16, marginBottom:20, fontSize:14, color:'#374151' }}>
            <div>📌 Your reference: <strong style={{ fontFamily:'monospace', color:'#7c3aed' }}>{slug || 'Processing...'}</strong></div>
            <div style={{ marginTop:6, fontSize:12, color:'#6b7280' }}>Keep this for support queries</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'#f0fdf4', borderRadius:8, padding:'12px 16px', fontSize:14 }}>
              <span>⏰</span> Link will be active for <strong>24 hours</strong> after activation
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'#eff6ff', borderRadius:8, padding:'12px 16px', fontSize:14 }}>
              <span>📱</span> You will receive the link on WhatsApp
            </div>
          </div>
        </div>
        <Link to="/" className="btn btn-outline" style={{ marginTop:24, display:'inline-flex' }}>
          🏠 Create Another Wish
        </Link>
      </motion.div>
    </div>
  );
}
