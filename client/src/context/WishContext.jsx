import { createContext, useContext, useState } from 'react';

const WishContext = createContext(null);

export function WishProvider({ children }) {
  const [wish, setWish] = useState({
    wishType:      '',
    templateId:    '',
    recipientName: '',
    senderName:    '',
    specialDate:   '',
    message:       '',
    language:      'en',
    colorTheme:    '#e91e8c',
    photos:        [],
    userWhatsApp:  '',
    userEmail:     '',
  });
  const [submissionId, setSubmissionId] = useState(null);
  const [slug, setSlug]                 = useState(null);
  const [step, setStep]                 = useState(1); // 1-4

  const update = (fields) => setWish((prev) => ({ ...prev, ...fields }));
  const reset  = () => { setWish({ wishType:'',templateId:'',recipientName:'',senderName:'',specialDate:'',message:'',language:'en',colorTheme:'#e91e8c',photos:[],userWhatsApp:'',userEmail:'' }); setSubmissionId(null); setSlug(null); setStep(1); };

  return (
    <WishContext.Provider value={{ wish, update, reset, submissionId, setSubmissionId, slug, setSlug, step, setStep }}>
      {children}
    </WishContext.Provider>
  );
}

export const useWish = () => useContext(WishContext);
