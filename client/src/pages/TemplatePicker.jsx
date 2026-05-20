import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWish } from '../context/WishContext';
import { getTemplates } from '../api/wishApi';
import StepsBar from '../components/StepsBar';

// Fallback demo templates when DB is empty
const DEMO_TEMPLATES = (wishType) =>
  Array.from({ length: 8 }, (_, i) => ({
    _id: `${wishType}-${i+1}`,
    templateId: `${wishType}-tpl-${i+1}`,
    name: `Template ${i+1}`,
    description: ['Confetti & Balloons','Elegant Dark','Floral Garden','Starry Night','Pastel Dream','Bold & Bright','Minimalist','Vintage'][i] || `Style ${i+1}`,
    previewImage: '',
  }));

const GRADIENTS = [
  'linear-gradient(135deg,#e91e8c,#7c3aed)',
  'linear-gradient(135deg,#7c3aed,#0ea5e9)',
  'linear-gradient(135deg,#f97316,#ef4444)',
  'linear-gradient(135deg,#16a34a,#0ea5e9)',
  'linear-gradient(135deg,#d97706,#e91e8c)',
  'linear-gradient(135deg,#1e293b,#7c3aed)',
  'linear-gradient(135deg,#f472b6,#fb923c)',
  'linear-gradient(135deg,#38bdf8,#4ade80)',
];

export default function TemplatePicker() {
  const { wish, update, setStep } = useWish();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(wish.templateId || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (!wish.wishType) { navigate('/'); return; }
    setStep(2);
    getTemplates(wish.wishType)
      .then((r) => setTemplates(r.data.length ? r.data : DEMO_TEMPLATES(wish.wishType)))
      .finally(() => setLoading(false));
  }, [wish.wishType]);

  const next = () => {
    if (!selected) return;
    update({ templateId: selected });
    setStep(3);
    navigate('/create');
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <StepsBar current={2} />
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 className="page-title">Choose Your Template</h2>
        <p style={{ color: '#6b7280', marginTop: 8 }}>
          Showing templates for: <strong style={{ color: '#e91e8c', textTransform: 'capitalize' }}>{wish.wishType?.replace(/-/g, ' ')}</strong>
        </p>
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
            {templates.map((tpl, i) => (
              <motion.div
                key={tpl._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * .06 }}
                onClick={() => setSelected(tpl.templateId)}
                style={{
                  cursor: 'pointer', borderRadius: 16, overflow: 'hidden',
                  border: selected === tpl.templateId ? '3px solid #e91e8c' : '3px solid transparent',
                  boxShadow: selected === tpl.templateId ? '0 0 0 3px #f9a8d4' : '0 2px 12px rgba(0,0,0,.08)',
                  transform: selected === tpl.templateId ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all .2s',
                }}
              >
                {/* Preview area */}
                <div style={{
                  height: 160, background: tpl.previewImage ? `url(${tpl.previewImage}) center/cover` : GRADIENTS[i % 8],
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative',
                }}>
                  {!tpl.previewImage && '🎨'}
                  {selected === tpl.templateId && (
                    <div style={{ position: 'absolute', top: 10, right: 10, background: '#e91e8c', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✓</div>
                  )}
                </div>
                <div style={{ padding: '12px 14px', background: '#fff' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tpl.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{tpl.description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => navigate('/')}>← Back</button>
            <button className="btn btn-primary" onClick={next} disabled={!selected}>
              Continue with this Template →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
