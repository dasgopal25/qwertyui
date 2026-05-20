import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getStats, getSubmissions, activateLink, deactivateLink, verifyPayment, getSettings, updateSettings } from '../../api/adminApi';

const STATUS_COLORS = {
  active:   { bg:'#d1fae5', color:'#065f46', label:'Active' },
  expired:  { bg:'#fee2e2', color:'#991b1b', label:'Expired' },
  pending:  { bg:'#fef3c7', color:'#92400e', label:'Pending' },
  verified: { bg:'#dbeafe', color:'#1e40af', label:'Verified' },
};

function getStatus(s) {
  if (s.linkActive) return 'active';
  if (s.paymentVerified && s.activatedAt) return 'expired';
  if (s.paymentVerified) return 'verified';
  return 'pending';
}

export default function AdminDashboard() {
  const { token, logout, username } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]               = useState('submissions');
  const [stats, setStats]           = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [filter, setFilter]         = useState('');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState(null);
  const [settings, setSettings]     = useState(null);
  const [settingsForm, setSettingsForm] = useState({});
  const [qrFile, setQrFile]         = useState(null);
  const [saving, setSaving]         = useState(false);

  useEffect(() => { if (!token) navigate('/admin'); }, [token]);

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadSubmissions(); }, [page, filter, search]);
  useEffect(() => { if (tab === 'settings') loadSettings(); }, [tab]);

  const loadStats = () => getStats().then(r => setStats(r.data));
  const loadSubmissions = () =>
    getSubmissions({ page, limit:15, status:filter||undefined, search:search||undefined })
      .then(r => { setSubmissions(r.data.submissions); setTotal(r.data.total); });
  const loadSettings = () => getSettings().then(r => { setSettings(r.data); setSettingsForm(r.data); });

  const doActivate = async (id) => {
    await activateLink(id); toast.success('Link activated!'); loadSubmissions(); loadStats();
  };
  const doDeactivate = async (id) => {
    await deactivateLink(id); toast.success('Link deactivated'); loadSubmissions();
  };
  const doVerify = async (id) => {
    await verifyPayment(id); toast.success('Payment verified'); loadSubmissions(); loadStats();
  };
  const saveSettings = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(settingsForm).forEach(([k,v]) => fd.append(k, v));
      if (qrFile) fd.append('qrCode', qrFile);
      await updateSettings(fd);
      toast.success('Settings saved!');
      loadSettings();
    } finally { setSaving(false); }
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/w/${slug}`);
    toast.success('Link copied!');
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc' }}>
      {/* Admin Navbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:56 }}>
          <span style={{ fontWeight:700, fontSize:18, color:'#e91e8c' }}>🌟 Wish Creator Admin</span>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:13, color:'#6b7280' }}>👤 {username}</span>
            <button className="btn btn-outline" style={{ padding:'6px 14px', fontSize:13 }} onClick={() => { logout(); navigate('/admin'); }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:16, marginBottom:24 }}>
          {[
            { label:'Total Orders', value:stats.total||0, color:'#7c3aed', icon:'📦' },
            { label:'Pending',      value:stats.pending||0, color:'#d97706', icon:'⏳' },
            { label:'Active Links', value:stats.active||0, color:'#059669', icon:'✅' },
            { label:'Verified',     value:stats.verified||0, color:'#2563eb', icon:'💳' },
          ].map((s) => (
            <motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card" style={{padding:'20px 16px',textAlign:'center'}}>
              <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {['submissions','settings'].map((t) => (
            <button key={t} className={`btn ${tab===t?'btn-primary':'btn-outline'}`} style={{padding:'8px 20px',fontSize:13,textTransform:'capitalize'}} onClick={()=>setTab(t)}>
              {t==='submissions'?'📋 Submissions':'⚙️ Settings'}
            </button>
          ))}
        </div>

        {tab === 'submissions' && (
          <>
            {/* Filters */}
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="🔍 Search name / slug..." style={{ maxWidth:260 }} />
              {['','pending','verified','active','expired'].map((s) => (
                <button key={s} className={`btn ${filter===s?'btn-primary':'btn-outline'}`} style={{padding:'8px 14px',fontSize:13}} onClick={()=>{setFilter(s);setPage(1);}}>
                  {s||'All'}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="card" style={{ overflow:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid #f3e8ff' }}>
                    {['Slug','Recipient','Wish Type','Template','Payment Proof','Status','Actions'].map(h => (
                      <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontWeight:600, color:'#6b7280', fontSize:12, textTransform:'uppercase', letterSpacing:'.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => {
                    const status = getStatus(s);
                    const st = STATUS_COLORS[status];
                    return (
                      <tr key={s._id} style={{ borderBottom:'1px solid #f9fafb' }}>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ fontFamily:'monospace', fontSize:13, color:'#7c3aed', cursor:'pointer' }} onClick={()=>copyLink(s.slug)}>
                            {s.slug} 📋
                          </span>
                        </td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ fontWeight:600 }}>{s.recipientName}</div>
                          <div style={{ fontSize:12, color:'#6b7280' }}>from {s.senderName}</div>
                        </td>
                        <td style={{ padding:'12px 14px', textTransform:'capitalize' }}>{s.wishType?.replace(/-/g,' ')}</td>
                        <td style={{ padding:'12px 14px', fontSize:12, color:'#6b7280' }}>{s.templateId}</td>
                        <td style={{ padding:'12px 14px' }}>
                          {s.paymentScreenshot
                            ? <a href={s.paymentScreenshot} target="_blank" rel="noreferrer" style={{ color:'#2563eb', fontSize:12 }}>View 🖼️</a>
                            : <span style={{ color:'#9ca3af', fontSize:12 }}>Not uploaded</span>}
                        </td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ background:st.bg, color:st.color, padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>{st.label}</span>
                        </td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                            {!s.paymentVerified && (
                              <button className="btn btn-primary" style={{padding:'5px 10px',fontSize:11}} onClick={()=>doVerify(s._id)}>✅ Verify</button>
                            )}
                            {!s.linkActive && s.paymentVerified && (
                              <button className="btn btn-primary" style={{padding:'5px 10px',fontSize:11,background:'linear-gradient(135deg,#059669,#10b981)'}} onClick={()=>doActivate(s._id)}>🔓 Activate</button>
                            )}
                            {s.linkActive && (
                              <button className="btn btn-outline" style={{padding:'5px 10px',fontSize:11,borderColor:'#ef4444',color:'#ef4444'}} onClick={()=>doDeactivate(s._id)}>🔒 Deactivate</button>
                            )}
                            <button className="btn btn-outline" style={{padding:'5px 10px',fontSize:11}} onClick={()=>setSelected(s)}>👁️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {submissions.length === 0 && (
                    <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#9ca3af' }}>No submissions found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:16 }}>
              <button className="btn btn-outline" style={{padding:'8px 14px',fontSize:13}} onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>← Prev</button>
              <span style={{ display:'flex', alignItems:'center', fontSize:13, color:'#6b7280' }}>Page {page} · {total} total</span>
              <button className="btn btn-outline" style={{padding:'8px 14px',fontSize:13}} onClick={()=>setPage(p=>p+1)} disabled={submissions.length<15}>Next →</button>
            </div>
          </>
        )}

        {tab === 'settings' && settings && (
          <div className="card" style={{ padding:28, maxWidth:560 }}>
            <h3 style={{ fontWeight:600, marginBottom:20 }}>⚙️ Site Settings</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label>Payment Amount (₹)</label>
                <input type="number" value={settingsForm.priceInr||49} onChange={e=>setSettingsForm({...settingsForm,priceInr:e.target.value})} />
              </div>
              <div>
                <label>WhatsApp Number</label>
                <input value={settingsForm.whatsappNumber||''} onChange={e=>setSettingsForm({...settingsForm,whatsappNumber:e.target.value})} />
              </div>
              <div>
                <label>Link Validity (Hours)</label>
                <input type="number" value={settingsForm.linkValidityHours||24} onChange={e=>setSettingsForm({...settingsForm,linkValidityHours:e.target.value})} />
              </div>
              <div>
                <label>Payment QR Code Image</label>
                {settings.qrCodeUrl && <img src={settings.qrCodeUrl} alt="QR" style={{ width:120, height:120, border:'2px solid #f3e8ff', borderRadius:8, marginBottom:8, display:'block' }} />}
                <input type="file" accept="image/*" onChange={e=>setQrFile(e.target.files[0])} style={{ padding:8 }} />
              </div>
              <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20 }} onClick={()=>setSelected(null)}>
          <div className="card" style={{ maxWidth:500, width:'100%', padding:28, maxHeight:'85vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontWeight:600, marginBottom:16 }}>📋 Submission Details</h3>
            {[
              ['Slug', selected.slug],
              ['Wish Type', selected.wishType],
              ['Template', selected.templateId],
              ['Recipient', selected.recipientName],
              ['Sender', selected.senderName],
              ['Language', selected.language],
              ['WhatsApp', selected.userWhatsApp],
              ['Message', selected.message],
              ['Submitted', new Date(selected.createdAt).toLocaleString('en-IN')],
            ].map(([k,v]) => v ? (
              <div key={k} style={{ display:'flex', gap:10, marginBottom:10, fontSize:14, borderBottom:'1px solid #f9fafb', paddingBottom:8 }}>
                <strong style={{ minWidth:90, color:'#6b7280' }}>{k}:</strong>
                <span style={{ flex:1 }}>{v}</span>
              </div>
            ) : null)}
            {selected.photos?.map((p,i) => (
              <img key={i} src={p} alt="" style={{ width:'100%', borderRadius:8, marginBottom:8 }} />
            ))}
            <button className="btn btn-outline" style={{ width:'100%', justifyContent:'center', marginTop:8 }} onClick={()=>setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
