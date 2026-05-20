import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { WishProvider } from './context/WishContext';
import { AuthProvider } from './context/AuthContext';

import Home           from './pages/Home';
import TemplatePicker from './pages/TemplatePicker';
import WishForm       from './pages/WishForm';
import PaymentPage    from './pages/PaymentPage';
import ThankYou       from './pages/ThankYou';
import WishPage       from './pages/WishPage';
import ExpiredPage    from './pages/ExpiredPage';
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <WishProvider>
        <Toaster position="top-center" />
        <Routes>
          {/* Public user flow */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/templates" element={<><Navbar /><TemplatePicker /></>} />
          <Route path="/create"    element={<><Navbar /><WishForm /></>} />
          <Route path="/payment"   element={<><Navbar /><PaymentPage /></>} />
          <Route path="/thankyou"  element={<><Navbar /><ThankYou /></>} />

          {/* Generated wish page (no navbar) */}
          <Route path="/w/:slug"   element={<WishPage />} />
          <Route path="/expired"   element={<ExpiredPage />} />

          {/* Admin */}
          <Route path="/admin"     element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </WishProvider>
    </AuthProvider>
  );
}
