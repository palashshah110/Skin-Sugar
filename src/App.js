import { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './components/pages/HomePage';
import ProductsPage from './components/pages/ProductsPage';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import ProfilePage from './components/pages/ProfilePage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import OrdersPage from './components/pages/OrdersPage';
import FAQPage from './components/pages/FAQPage';
import ContactPage from './components/pages/ContactPage';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import './App.css'

// Context for managing app state
export const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const contextValue = {
    user, setUser,
    cart, setCart,
    orders, setOrders,
    mobileMenuOpen, setMobileMenuOpen,
    selectedProductId, setSelectedProductId 
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
          <Header />
          <ScrollToTop/>
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster/>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;