import { useContext } from "react";
import { AppContext } from "../../App";
import { Leaf, Search, ShoppingCart, User, X, Menu } from "lucide-react";

export default function Header() {
  const { currentPage, setCurrentPage, user, cart, mobileMenuOpen, setMobileMenuOpen } = useContext(AppContext);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentPage('home')}
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
            {['home', 'products', 'faq', 'contact'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`text-sm font-medium transition-colors capitalize hover:text-rose-600 ${currentPage === page ? 'text-rose-600' : 'text-gray-700'
                  }`}
              >
                {page === 'faq' ? 'FAQ' : page}
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
                onClick={() => setCurrentPage('profile')}
                className="p-2 hover:bg-rose-50 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 hover:bg-rose-50 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
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
              {['home', 'products', 'faq', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium transition-colors capitalize hover:text-rose-600 ${currentPage === page ? 'text-rose-600' : 'text-gray-700'
                    }`}
                >
                  {page === 'faq' ? 'FAQ' : page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}