import React, { useState, createContext, useContext, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, Star, Filter, Heart, Plus, Minus, Truck, Shield, Leaf, Award } from 'lucide-react';

// Context for managing app state
const AppContext = createContext();

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Himalayan Rose Lip Butter",
    price: 899,
    originalPrice: 1199,
    category: "lip-care",
    rating: 4.8,
    reviews: 127,
    image: "https://nectarlife.com/cdn/shop/files/Lips_Collection_1080x1080_a3c99b64-bf32-488c-b97c-43ac20383bc1.jpg?v=1722637866",
    description: "Luxurious handcrafted lip butter infused with Himalayan rose petals",
    ingredients: ["Rose Petals", "Shea Butter", "Coconut Oil", "Vitamin E"],
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Lavender Dreams Body Mist",
    price: 1299,
    originalPrice: 1599,
    category: "body-care",
    rating: 4.9,
    reviews: 89,
    image: "/body_mist.png",
    description: "Refreshing lavender-infused body mist for daily aromatherapy",
    ingredients: ["Lavender Oil", "Rose Water", "Aloe Vera", "Glycerin"],
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Bodywash & Soaps Combo",
    price: 1599,
    originalPrice: 1999,
    category: "face-care",
    rating: 4.7,
    reviews: 203,
    image: "/Bodywash_&_Soaps_Combo.png",
    description: "Comprehensive body wash and soaps combo for all your cleansing needs",
    ingredients: ["Turmeric", "Bentonite Clay", "Neem", "Honey"],
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Coconut Vanilla Body Butter",
    price: 1099,
    originalPrice: 1399,
    category: "body-care",
    rating: 4.6,
    reviews: 156,
    image: "https://images.squarespace-cdn.com/content/v1/62ec3847fc7a110cbf3bb559/a2510526-e13d-4253-ab69-9fcbcbb27ee0/mini-body-butter-sugar-scrub-coconut.jpg?format=1000w",
    description: "Rich moisturizing body butter with tropical coconut and vanilla",
    ingredients: ["Coconut Oil", "Vanilla Extract", "Shea Butter", "Cocoa Butter"],
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "Green Tea Eye Serum",
    price: 2299,
    originalPrice: 2799,
    category: "face-care",
    rating: 4.8,
    reviews: 92,
    image: "https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/8/1/81zvdaXvvZL._SL1500_.jpg",
    description: "Rejuvenating eye serum with green tea and peptides",
    ingredients: ["Green Tea Extract", "Peptides", "Hyaluronic Acid", "Vitamin C"],
    inStock: false,
    featured: false
  },
  {
    id: 6,
    name: "Sandalwood Face Toner",
    price: 999,
    originalPrice: 1299,
    category: "face-care",
    rating: 4.5,
    reviews: 74,
    image: "https://juicychemistry.com/cdn/shop/files/Saffron_Rose_and_Australian_Sandalwood_Face_Scrub_2_TestedStudy.jpg?v=1756188696&width=1500",
    description: "Balancing face toner with pure sandalwood extract",
    ingredients: ["Sandalwood", "Rose Water", "Witch Hazel", "Aloe Vera"],
    inStock: true,
    featured: false
  }
];

const categories = [
  { id: 'all', name: 'All Products', count: 50 },
  { id: 'face-care', name: 'Face Care', count: 18 },
  { id: 'body-care', name: 'Body Care', count: 15 },
  { id: 'lip-care', name: 'Lip Care', count: 8 },
  { id: 'hair-care', name: 'Hair Care', count: 9 }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const contextValue = {
    currentPage, setCurrentPage,
    user, setUser,
    cart, setCart,
    orders, setOrders,
    mobileMenuOpen, setMobileMenuOpen
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <Header />
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
      </div>
    </AppContext.Provider>
  );
}
const ScrollToTop = () => {
  const { currentPage } = useContext(AppContext);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  return null;
}
function Header() {
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

function HomePage() {
  const { setCurrentPage } = useContext(AppContext);

  const featuredProducts = mockProducts.filter(product => product.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
            Pure Luxury
            <br />
            <span className="text-4xl md:text-6xl">Handcrafted for You</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover our premium collection of handcrafted herbal skincare solutions,
            where nature meets luxury in every drop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Explore Collection
            </button>
            <button className="border-2 border-rose-300 text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-50 transform hover:scale-105 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Skin Sugars?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference of premium handcrafted skincare
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "100% Natural", desc: "Pure herbal ingredients sourced from nature" },
              { icon: Award, title: "Handcrafted", desc: "Artisanally made in small batches" },
              { icon: Shield, title: "Tested & Safe", desc: "Dermatologically tested for all skin types" },
              { icon: Truck, title: "Free Delivery", desc: "Complimentary shipping on orders above ₹999" }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Our most loved skincare essentials</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = mockProducts.filter(product =>
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return b.featured - a.featured;
    }
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-xl text-gray-600">Discover our complete range of premium skincare solutions</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`block w-full text-left py-2 px-3 rounded-lg mb-2 transition-colors ${selectedCategory === category.id
                          ? 'bg-rose-100 text-rose-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">{sortedProducts.length} products found</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const { setCurrentPage } = useContext(AppContext);

  const viewProduct = () => {
    setCurrentPage('product-details');
    // You might want to pass the product ID to the details page
    // This can be done via context or URL parameters
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                  }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={viewProduct}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
}

// Add this new component for product details page
function ProductDetailsPage() {
  const { setCurrentPage, cart, setCart } = useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // For now, using the first product as demo
  // In a real app, you'd get the product ID from URL params or context
  useEffect(() => {
    setSelectedProduct(mockProducts[0]);
  }, []);

  if (!selectedProduct) {
    return <div>Loading...</div>;
  }


  const addToCart = () => {
    setCart(prev => {
      const existing = prev.find(item => item.id === selectedProduct.id);
      if (existing) {
        return prev.map(item =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...selectedProduct, quantity }];
    });
    // Optional: Show confirmation message or redirect to cart
    alert('Product added to cart!');
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => setCurrentPage('products')}
          className="mb-6 text-rose-600 hover:text-rose-700 font-medium flex items-center"
        >
          ← Back to Products
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{selectedProduct.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.ingredients.map((ingredient, index) => (
                    <span key={index} className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Price</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-xl text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                  )}
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      Save ₹{selectedProduct.originalPrice - selectedProduct.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-gray-600">
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={!selectedProduct.inStock}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart();
                    setCurrentPage('cart');
                  }}
                  disabled={!selectedProduct.inStock}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-4 rounded-lg font-semibold hover:from-gray-800 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 100% natural and herbal ingredients</li>
                <li>• Suitable for all skin types</li>
                <li>• Dermatologically tested</li>
                <li>• Cruelty-free and vegan</li>
                <li>• Environmentally friendly packaging</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Apply on clean, dry skin</li>
                <li>• Use twice daily for best results</li>
                <li>• Store in a cool, dry place</li>
                <li>• Avoid contact with eyes</li>
                <li>• Patch test recommended before first use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const { setCurrentPage, setUser } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login
    setUser({ name: 'John Doe', email });
    setCurrentPage('home');
  };

  return (
    <div className="py-16 min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-rose-600 font-medium hover:text-rose-700"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupPage() {
  const { setCurrentPage, setUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Mock signup
    setUser({ name: formData.name, email: formData.email });
    setCurrentPage('home');
  };

  return (
    <div className="py-16 min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Join Skin Sugars
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-rose-600 font-medium hover:text-rose-700"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, setCurrentPage, setUser } = useContext(AppContext);

  if (!user) {
    setCurrentPage('login');
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="bg-white p-4 rounded-full">
                <User className="w-12 h-12 text-rose-500" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-rose-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentPage('orders')}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">My Orders</div>
                    <div className="text-sm text-gray-600">View your order history</div>
                  </button>
                  <button
                    onClick={() => setCurrentPage('cart')}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Shopping Cart</div>
                    <div className="text-sm text-gray-600">Review items in your cart</div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-red-600"
                  >
                    <div className="font-medium">Logout</div>
                    <div className="text-sm">Sign out of your account</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const { cart, setCart, setCurrentPage } = useContext(AppContext);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cart.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {cart.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{total + savings}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-₹{savings}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{total >= 999 ? 'Free' : '₹99'}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total + (total >= 999 ? 0 : 99)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('checkout')}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const { cart, setCart, setOrders, setCurrentPage, user } = useContext(AppContext);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setShippingInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = total >= 999 ? 0 : 99;
  const finalTotal = total + shippingCost;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!user) {
      setCurrentPage('login');
      return;
    }

    const order = {
      id: Date.now(),
      items: [...cart],
      total: finalTotal,
      shippingInfo,
      date: new Date().toLocaleDateString(),
      status: 'Confirmed'
    };

    setOrders(prev => [...prev, order]);
    setCart([]);
    setCurrentPage('orders');
  };

  if (cart.length === 0) {
    setCurrentPage('cart');
    return null;
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    required
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrdersPage() {
  const { orders, user, setCurrentPage } = useContext(AppContext);

  if (!user) {
    setCurrentPage('login');
    return null;
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Truck className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Placed on {order.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-1">₹{order.total}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQPage() {
  const { setCurrentPage } = useContext(AppContext);
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Are your products 100% natural?",
      answer: "Yes, all our products are made with 100% natural and herbal ingredients. We source the finest botanical extracts and essential oils to create our luxury skincare solutions."
    },
    {
      question: "How long does shipping take?",
      answer: "We offer free shipping on orders above ₹999. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days with additional charges."
    },
    {
      question: "Can I return products if I'm not satisfied?",
      answer: "Yes, we offer a 30-day return policy. If you're not completely satisfied with your purchase, you can return the unused product for a full refund."
    },
    {
      question: "Are your products suitable for sensitive skin?",
      answer: "Our products are dermatologically tested and suitable for all skin types, including sensitive skin. However, we recommend doing a patch test before first use."
    },
    {
      question: "How should I store the products?",
      answer: "Store our products in a cool, dry place away from direct sunlight. Some products may require refrigeration - please check individual product instructions."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within India. We're working on expanding our shipping to international locations soon."
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about our products and services</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <div className={`transform transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  <Plus className="w-5 h-5 text-rose-500" />
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Our customer support team is here to help you</p>
          <button
            onClick={() => setCurrentPage('contact')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                    <p className="text-rose-100">
                      123 Beauty Street<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Phone</h3>
                    <p className="text-rose-100">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-rose-100">hello@skinsugars.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                    <p className="text-rose-100">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat - Sun: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { setCurrentPage } = useContext(AppContext);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-full">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Skin Sugars
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Premium handcrafted herbal skincare solutions for your natural beauty routine.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-rose-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-rose-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-rose-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('faq')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Face Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Body Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Lip Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Hair Care
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get updates on new products and offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-rose-500"
              />
              <button className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 rounded-r-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Skin Sugars. All rights reserved. Made with ❤️ for natural beauty.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;