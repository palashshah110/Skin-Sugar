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
import Dashboard from './components/admin/Dashboard';
import AdminLayout from './components/admin/AdminLayout';
import Categories from './components/admin/Categories';
import Subcategories from './components/admin/Subcategories';
import Products from './components/admin/Products';
import Orders from './components/admin/Orders';
import Users from './components/admin/Users';
import CustomizeBasket from './components/pages/CustomizeBasketPage';
// Context for managing app state
export const AppContext = createContext();

// Main Layout Component (with Header and Footer)
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      <Header />
      <ScrollToTop />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [basketItems, setBasketItems] = useState([]);

  const contextValue = {
    user, setUser,
    cart, setCart,
    orders, setOrders,
    mobileMenuOpen, setMobileMenuOpen,
    selectedProductId, setSelectedProductId,

    basketItems, setBasketItems
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* Main App Routes - With Header and Footer */}
          <Route path="*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/categories/:categoryId" element={<ProductsPage />} />
                <Route path="/customizebasket" element={<CustomizeBasket />} />
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
            </MainLayout>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AppContext.Provider>
  );
}

export default App;