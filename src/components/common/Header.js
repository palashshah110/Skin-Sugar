import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { ShoppingCart, User, X, Menu, LogOut, ListOrdered } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const { user, cart, mobileMenuOpen, setMobileMenuOpen, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const history = useLocation();
  const [open, setOpen] = useState(false);
  const currentRoute = history.pathname;
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [setUser])
  const handleLogout = () => {
    setOpen(false);
    setUser(null);
    localStorage.clear()
    navigate("/login");
  };
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const menuItem = [{ name: 'home', route: "/" }, { name: 'products', route: "/products" }, { name: 'Personalized Hampers', route: "/customizebasket" }, { name: 'faq', route: "/faq" }, { name: 'contact', route: "/contact" }];
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="logo" className="w-24 h-24" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItem.map((page) => (
              <button
                key={page.name}
                onClick={() => {
                  navigate(page.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors capitalize hover:text-green-600 ${currentRoute === page.route ? 'text-green-600' : 'text-gray-700'
                  }`}
              >
                {page.name}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <div className="w-5 h-5 text-gray-600" />

            {user ? (
              <button
                onClick={() => setOpen(!open)}
                onMouseEnter={() => setOpen(true)} // hover (desktop)
                onMouseLeave={() => setOpen(false)}
                className="p-2 hover:bg-green-50 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Login
              </button>
            )}
            {user && open && (
              <div
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className="absolute top-10 right-20 mt-2 w-30 bg-white rounded-lg shadow-lg border border-green-200 z-50"
              >
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-green-50"
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/cart")}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-green-50"
                    >
                      <ShoppingCart className="w-4 h-4" /> Cart
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/orders")}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-green-50"
                    >
                      <ListOrdered className="w-4 h-4" /> Orders
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-green-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-green-50 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 hover:bg-green-50 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-green-100 py-4">
            <nav className="flex flex-col space-y-3">
              {menuItem.map((page) => (
                <button
                  key={page.name}
                  onClick={() => {
                    navigate(page.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium transition-colors capitalize hover:text-green-600 ${currentRoute === page.route ? 'text-green-600' : 'text-gray-700'
                    }`}
                >
                  {page.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}