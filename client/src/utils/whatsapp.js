export const openWhatsApp = (number, message = '') => {
  const clean = number.replace(/\D/g, '');
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
