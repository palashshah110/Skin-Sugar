import { useContext } from "react";
import { AppContext } from "../../App";
import { Leaf, Search, ShoppingCart, User, X, Menu } from "lucide-react";
import { useNavigate,useLocation } from "react-router-dom";

export default function Header() {
  const { user, cart, mobileMenuOpen, setMobileMenuOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const history = useLocation();
  const currentRoute = history.pathname;

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const menuItem = [{name:'home',route:"/"}, {name:'products', route:"/products"}, {name:'faq', route:"/faq"}, {name:'contact', route:"/contact"}];
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-full">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Skin Sugars
            </span>
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
                  className={`text-left text-sm font-medium transition-colors capitalize hover:text-rose-600 ${currentRoute === page.route ? 'text-rose-600' : 'text-gray-700'
                    }`}
                >
                  {page.name}
                </button>
              ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-rose-50 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {user ? (
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-rose-50 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
              >
                Login
              </button>
            )}

            <button
              onClick={() => navigate('/cart')} 
              className="relative p-2 hover:bg-rose-50 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 hover:bg-rose-50 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rose-100 py-4">
            <nav className="flex flex-col space-y-3">
              {menuItem.map((page) => (
                <button
                  key={page.name}
                  onClick={() => {
                    navigate(page.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium transition-colors capitalize hover:text-rose-600 ${currentRoute === page.route ? 'text-rose-600' : 'text-gray-700'
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