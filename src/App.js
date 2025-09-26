import { useState, createContext } from 'react';
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

// Mock products data


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const contextValue = {
    currentPage, setCurrentPage,
    user, setUser,
    cart, setCart,
    orders, setOrders,
    mobileMenuOpen, setMobileMenuOpen,
    selectedProductId, setSelectedProductId 
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <Header />
        <ScrollToTop/>
        <main>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'products' && <ProductsPage />}
          {currentPage === 'product-details' && <ProductDetailsPage />}
          {currentPage === 'login' && <LoginPage />}
          {currentPage === 'signup' && <SignupPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'cart' && <CartPage />}
          {currentPage === 'checkout' && <CheckoutPage />}
          {currentPage === 'orders' && <OrdersPage />}
          {currentPage === 'faq' && <FAQPage />}
          {currentPage === 'contact' && <ContactPage />}
        </main>
        <Footer />
        <Toaster/>
      </div>
    </AppContext.Provider>
  );
}

export default App;