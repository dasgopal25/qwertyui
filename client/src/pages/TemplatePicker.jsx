import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWish } from '../context/WishContext';
import { getTemplates } from '../api/wishApi';
import StepsBar from '../components/StepsBar';

// Demo templates with photos
const DEMO_TEMPLATES = (wishType) => [
  {
    _id: '1',
    templateId: 'tpl-1',
    name: 'Romantic Rose',
    description: 'Beautiful floral birthday theme',
    previewImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: '2',
    templateId: 'tpl-2',
    name: 'Luxury Gold',
    description: 'Elegant golden celebration',
    previewImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: '3',
    templateId: 'tpl-3',
    name: 'Cute Pink',
    description: 'Soft pastel dream design',
    previewImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: '4',
    templateId: 'tpl-4',
    name: 'Party Night',
    description: 'Modern celebration look',
    previewImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: '5',
    templateId: 'tpl-5',
    name: 'Nature Love',
    description: 'Green natural aesthetic',
    previewImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: '6',
    templateId: 'tpl-6',
    name: 'Royal Blue',
    description: 'Premium stylish template',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
  },
];

export default function TemplatePicker() {
  const { wish, update, setStep } = useWish();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(wish.templateId || '');

  const navigate = useNavigate();

  useEffect(() => {
    if (!wish.wishType) {
      navigate('/');
      return;
    }

    setStep(2);

    getTemplates(wish.wishType)
      .then((r) =>
        setTemplates(
          r.data.length ? r.data : DEMO_TEMPLATES(wish.wishType)
        )
      )
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
          Showing templates for :
          <strong
            style={{
              color: '#e91e8c',
              textTransform: 'capitalize',
              marginLeft: 6,
            }}
          >
            {wish.wishType?.replace(/-/g, ' ')}
          </strong>
        </p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
              gap: 20,
            }}
          >
            {templates.map((tpl, i) => (
              <motion.div
                key={tpl._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(tpl.templateId)}
                whileHover={{ scale: 1.03 }}
                style={{
                  cursor: 'pointer',
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: '#fff',
                  border:
                    selected === tpl.templateId
                      ? '3px solid #e91e8c'
                      : '2px solid #eee',
                  boxShadow:
                    selected === tpl.templateId
                      ? '0 0 20px rgba(233,30,140,.35)'
                      : '0 4px 15px rgba(0,0,0,.08)',
                  transition: '.3s',
                }}
              >
                {/* IMAGE PREVIEW */}
                <div
                  style={{
                    height: 280,
                    backgroundImage: `url(${tpl.previewImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  {/* overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,.1))',
                    }}
                  />

                  {/* selected icon */}
                  {selected === tpl.templateId && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: '#e91e8c',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        zIndex: 2,
                      }}
                    >
                      ✓
                    </div>
                  )}

                  {/* text */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 15,
                      left: 15,
                      color: '#fff',
                      zIndex: 2,
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 18 }}>
                      {tpl.name}
                    </h3>

                    <p
                      style={{
                        marginTop: 5,
                        fontSize: 13,
                        opacity: 0.9,
                      }}
                    >
                      {tpl.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 35,
              display: 'flex',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            <button
              className="btn btn-outline"
              onClick={() => navigate('/')}
            >
              ← Back
            </button>

            <button
              className="btn btn-primary"
              onClick={next}
              disabled={!selected}
            >
              Continue →
            </button>
          </div>
        </>
      )}
    </div>
  );
}