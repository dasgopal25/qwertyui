import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminLogin } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await adminLogin(form);
      login(data.token, data.username);
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#e91e8c15,#7c3aed15)' }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ width:'100%', maxWidth:380, padding:20 }}>
        <div className="card" style={{ padding:36 }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🔐</div>
            <h1 style={{ fontFamily:"'Dancing Script',cursive", fontSize:'1.8rem', color:'#e91e8c' }}>Admin Panel</h1>
            <p style={{ fontSize:13, color:'#6b7280', marginTop:4 }}>Wish Creator Dashboard</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label>Username</label>
              <input value={form.username} onChange={(e) => setForm({...form, username:e.target.value})} placeholder="admin" required />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary" style={{ justifyContent:'center', marginTop:8 }} disabled={loading}>
              {loading ? '⏳ Logging in...' : '🔓 Login'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
