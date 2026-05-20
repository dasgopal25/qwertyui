import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWish } from '../context/WishContext';
import { getPaymentQR, uploadPayment } from '../api/wishApi';
import { openWhatsApp } from '../utils/whatsapp';
import StepsBar from '../components/StepsBar';

export default function PaymentPage() {
  const { submissionId, slug } = useWish();
  const navigate = useNavigate();
  const [qrData, setQrData]           = useState(null);
  const [screenshot, setScreenshot]   = useState(null);
  const [preview, setPreview]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [uploaded, setUploaded]       = useState(false);

  useEffect(() => {
    if (!submissionId) { navigate('/'); return; }
    getPaymentQR().then((r) => setQrData(r.data));
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setScreenshot(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!screenshot) return toast.error('Please select screenshot first');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('screenshot', screenshot);
      fd.append('submissionId', submissionId);
      await uploadPayment(fd);
      setUploaded(true);
      toast.success('Screenshot uploaded! Redirecting...');
      setTimeout(() => navigate('/thankyou'), 1500);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendViaWhatsApp = () => {
    const num = qrData?.whatsappNumber || '6295432911';
    const msg = `Hello! I have made the payment of ₹${qrData?.priceInr || 49} for my Wish Creator order.\n\nSubmission ID: ${submissionId}\nSlug: ${slug}\n\nPlease activate my wish link. Screenshot is attached.`;
    openWhatsApp(num, msg);
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <StepsBar current={4} />
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ maxWidth:560, margin:'0 auto', textAlign:'center' }}>
        <h2 className="page-title" style={{ marginBottom:8 }}>Complete Payment</h2>
        <p style={{ color:'#6b7280', marginBottom:32 }}>Your wish is almost ready! Pay ₹{qrData?.priceInr || 49} to activate it.</p>

        {/* QR Code */}
        <div className="card" style={{ padding:28, marginBottom:24 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>💳</div>
          <h3 style={{ fontSize:'1.8rem', fontWeight:700, color:'#e91e8c', marginBottom:4 }}>₹{qrData?.priceInr || 49}</h3>
          <p style={{ fontSize:13, color:'#6b7280', marginBottom:16 }}>Scan QR code to pay via UPI</p>

          {qrData?.qrCodeUrl ? (
            <img src={qrData.qrCodeUrl} alt="Payment QR" style={{ width:200, height:200, border:'3px solid #f3e8ff', borderRadius:12, objectFit:'contain', margin:'0 auto', display:'block' }} />
          ) : (
            <div style={{ width:200, height:200, background:'linear-gradient(135deg,#f3e8ff,#fff0f8)', border:'3px dashed #e91e8c', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', fontSize:14, color:'#9ca3af', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:40 }}>📱</div>
              QR Code will appear here
            </div>
          )}

          <p style={{ fontSize:13, color:'#6b7280', marginTop:16 }}>
            UPI ID: <strong>wishcreator@upi</strong>
          </p>
        </div>

        {/* Steps */}
        <div className="card" style={{ padding:20, marginBottom:24, textAlign:'left' }}>
          <h4 style={{ marginBottom:12, fontWeight:600 }}>📋 Steps to complete:</h4>
          {['Pay ₹49 via any UPI app using the QR code above', 'Take a screenshot of the payment confirmation', 'Upload the screenshot below OR send on WhatsApp', 'Admin will activate your wish link in 10-20 minutes!'].map((s, i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10, fontSize:14 }}>
              <span style={{ background:'linear-gradient(135deg,#e91e8c,#7c3aed)', color:'#fff', borderRadius:'50%', width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, flexShrink:0 }}>{i+1}</span>
              <span style={{ color:'#374151', lineHeight:1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Upload screenshot */}
        <div className="card" style={{ padding:20, marginBottom:16 }}>
          <h4 style={{ marginBottom:12, fontWeight:600 }}>📸 Upload Payment Screenshot</h4>
          <input type="file" accept="image/*" onChange={handleFile} style={{ marginBottom:12, padding:8 }} />
          {preview && <img src={preview} alt="Preview" style={{ width:'100%', maxHeight:200, objectFit:'contain', borderRadius:8, marginBottom:12, border:'2px solid #f3e8ff' }} />}
          <button className="btn btn-primary" style={{ width:'100%' }} onClick={handleUpload} disabled={loading || !screenshot || uploaded}>
            {uploaded ? '✅ Uploaded!' : loading ? '⏳ Uploading...' : '📤 Upload Screenshot'}
          </button>
        </div>

        {/* WhatsApp */}
        <p style={{ color:'#6b7280', fontSize:13, marginBottom:10 }}>— OR —</p>
        <button className="btn" onClick={sendViaWhatsApp} style={{ background:'#25d366', color:'#fff', width:'100%', justifyContent:'center', marginBottom:8 }}>
          💬 Send Screenshot on WhatsApp ({qrData?.whatsappNumber || '6295432911'})
        </button>
        <p style={{ fontSize:12, color:'#9ca3af' }}>WhatsApp message will open with your order details pre-filled</p>
      </motion.div>
    </div>
  );
}
