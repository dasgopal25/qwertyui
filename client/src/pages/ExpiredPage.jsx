import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ExpiredPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff9fc', padding:20 }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', maxWidth:420 }}>
        <div style={{ fontSize:80, marginBottom:20 }}>⌛</div>
        <h1 style={{ fontFamily:"'Dancing Script',cursive", fontSize:'2.2rem', color:'#e91e8c', marginBottom:12 }}>Link Expired</h1>
        <p style={{ color:'#6b7280', lineHeight:1.7, marginBottom:28 }}>
          This wish website link was only valid for 24 hours and has expired. Want to create a new wish?
        </p>
        <Link to="/" className="btn btn-primary">🌟 Create a New Wish</Link>
      </motion.div>
    </div>
  );
}
