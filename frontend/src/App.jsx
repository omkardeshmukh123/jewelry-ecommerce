import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Collections from './pages/Collections/Collections';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Auth from './pages/Auth/Auth';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';

// Protected route wrapper
function Protected({ children, adminOnly = false }) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('drisora_user')); }
    catch { return null; }
  })();
  if (!user) return <Navigate to="/auth" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

// Layout without navbar/footer (auth, admin)
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 0 }}>{children}</div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Auth - no navbar/footer */}
          <Route path="/auth" element={<Auth />} />

          {/* Admin - no footer, its own layout */}
          <Route path="/admin" element={
            <Protected adminOnly>
              <Admin />
            </Protected>
          } />

          {/* Main app routes */}
          <Route path="/" element={
            <AppLayout><Home /></AppLayout>
          } />
          <Route path="/collections" element={
            <AppLayout><Collections /></AppLayout>
          } />
          <Route path="/products/:id" element={
            <AppLayout><ProductDetail /></AppLayout>
          } />
          <Route path="/cart" element={
            <AppLayout><Cart /></AppLayout>
          } />
          <Route path="/profile" element={
            <Protected>
              <AppLayout><Profile /></AppLayout>
            </Protected>
          } />
          <Route path="/orders" element={
            <Protected>
              <AppLayout><Profile /></AppLayout>
            </Protected>
          } />
          <Route path="/about"   element={<AppLayout><Home /></AppLayout>} />
          <Route path="/contact" element={<AppLayout><Home /></AppLayout>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
