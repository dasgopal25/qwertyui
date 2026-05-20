import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWish } from '../context/WishContext';
import { submitWish } from '../api/wishApi';
import { t, getDefaultMessage } from '../utils/i18n';
import StepsBar from '../components/StepsBar';
import ColorPicker from '../components/ColorPicker';
import LanguageSelector from '../components/LanguageSelector';

export default function WishForm() {
  const { wish, update, setSubmissionId, setSlug, setStep } = useWish();
  const navigate = useNavigate();
  const [useDefault, setUseDefault] = useState(true);
  const [loading, setLoading]       = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [previews, setPreviews]     = useState([]);

  const T = (key) => t(wish.language, key);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setPhotoFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wish.recipientName || !wish.senderName)
      return toast.error('Please fill recipient and sender names');

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(wish).forEach(([k, v]) => {
        if (k !== 'photos' && v) fd.append(k, v);
      });
      const finalMsg = useDefault ? getDefaultMessage(wish.wishType, wish.language) : wish.message;
      fd.set('message', finalMsg);
      photoFiles.forEach((f) => fd.append('photos', f));

      const { data } = await submitWish(fd);
      setSubmissionId(data.submissionId);
      setSlug(data.slug);
      setStep(4);
      navigate('/payment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <StepsBar current={3} />
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <h2 className="page-title" style={{ textAlign:'center', marginBottom:32 }}>{T('fillDetails')}</h2>

        <form onSubmit={handleSubmit} style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Names */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label>{T('recipientName')} *</label>
              <input value={wish.recipientName} onChange={(e) => update({ recipientName: e.target.value })} placeholder="e.g. Priya" required />
            </div>
            <div>
              <label>{T('yourName')} *</label>
              <input value={wish.senderName} onChange={(e) => update({ senderName: e.target.value })} placeholder="e.g. Rahul" required />
            </div>
          </div>

          {/* Special date */}
          <div>
            <label>{T('specialDate')}</label>
            <input type="date" value={wish.specialDate} onChange={(e) => update({ specialDate: e.target.value })} />
          </div>

          {/* Language */}
          <LanguageSelector value={wish.language} onChange={(v) => update({ language: v })} />

          {/* Message */}
          <div>
            <label>{T('yourMessage')}</label>
            <div style={{ display:'flex', gap:8, marginBottom:10 }}>
              <button type="button" className={`btn ${useDefault ? 'btn-primary' : 'btn-outline'}`} style={{ padding:'8px 16px', fontSize:13 }} onClick={() => setUseDefault(true)}>
                ✨ Default
              </button>
              <button type="button" className={`btn ${!useDefault ? 'btn-primary' : 'btn-outline'}`} style={{ padding:'8px 16px', fontSize:13 }} onClick={() => setUseDefault(false)}>
                ✍️ Custom
              </button>
            </div>
            {useDefault ? (
              <div style={{ padding:'14px', background:'#fff0f8', borderRadius:10, fontSize:14, color:'#374151', lineHeight:1.6, border:'2px solid #f9a8d4' }}>
                {getDefaultMessage(wish.wishType, wish.language)}
              </div>
            ) : (
              <textarea
                rows={5}
                value={wish.message}
                onChange={(e) => update({ message: e.target.value })}
                placeholder="Write your personal message here..."
              />
            )}
          </div>

          {/* Photos */}
          <div>
            <label>{T('uploadPhotos')} (max 10)</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ padding:8 }} />
            {previews.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10 }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" style={{ width:80, height:80, objectFit:'cover', borderRadius:8, border:'2px solid #f3e8ff' }} />
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <ColorPicker value={wish.colorTheme} onChange={(v) => update({ colorTheme: v })} />

          {/* Contact */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label>Your WhatsApp Number</label>
              <input value={wish.userWhatsApp} onChange={(e) => update({ userWhatsApp: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label>Your Email (optional)</label>
              <input type="email" value={wish.userEmail} onChange={(e) => update({ userEmail: e.target.value })} placeholder="you@email.com" />
            </div>
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:8 }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/templates')}>← Back</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Submitting...' : `${T('submit')} →`}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
