import api from './axios';
export const getWishTypes    = ()     => api.get('/wishes/types');
export const getTemplates    = (type) => api.get(`/templates?wishType=${type}`);
export const submitWish      = (data) => api.post('/wishes/submit', data);
export const uploadPayment   = (data) => api.post('/wishes/payment-screenshot', data);
export const getWishBySlug   = (slug) => api.get(`/wishes/${slug}`);
export const getPaymentQR    = ()     => api.get('/settings/payment-qr');
