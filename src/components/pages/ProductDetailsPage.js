import { useContext } from "react";
import { AppContext } from "../../App";
import { useState, useEffect } from "react";
import { Star, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
export default function ProductDetailsPage() {
  const { cart, setCart, selectedProductId } = useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useParams();

  // For now, using the first product as demo
  // In a real app, you'd get the product ID from URL params or context
  const fetchProductsById = async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setSelectedProduct(data);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      toast.error('Unable to load product details');
    }
  };
  useEffect(() => {
    fetchProductsById(location.id);
  }, [selectedProductId, location.id]);

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
  
  if (!selectedProduct) {
    return <Loader />;
  }
  const buyNow = () => {
    if (!selectedProduct.inStock) {
      toast.error('Product is out of stock!');
      return;
    }
    const existing = cart.find(item => item.id === selectedProduct.id);
    if (!existing) {
      addToCart();
    }
    navigate('/cart');
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
    toast.success('Product added to cart!');
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
   <div className="py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <button
      onClick={() => navigate('/products')}
      className="mb-6 text-green-600 hover:text-green-700 font-medium flex items-center transition-colors"
    >
      ← Back to Products
    </button>

    <div className="lg:grid lg:grid-cols-2 lg:gap-12">
      {/* Product Images */}
      <div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 border border-green-100">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Natural</span>
            </div>
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
                <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
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
              <div className="flex items-center border border-green-300 rounded-lg">
                <button
                  onClick={decreaseQuantity}
                  className="p-3 hover:bg-green-50 transition-colors text-green-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium text-gray-900">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-3 hover:bg-green-50 transition-colors text-green-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-sm font-medium ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addToCart}
              disabled={!selectedProduct.inStock}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={!selectedProduct.inStock}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-4 rounded-lg font-semibold hover:from-gray-800 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Buy Now
            </button>
          </div>

          {/* Product Features */}
          <div className="mt-6 pt-6 border-t border-green-200">
            <div className="flex flex-wrap gap-4 text-sm text-green-600">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>100% Natural</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Cruelty Free</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                <span>Vegan</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Additional Information Section */}
    <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-green-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>100% natural and herbal ingredients</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Suitable for all skin types</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Dermatologically tested</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Cruelty-free and vegan</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Environmentally friendly packaging</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Apply on clean, dry skin</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Use twice daily for best results</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Store in a cool, dry place</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Avoid contact with eyes</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Patch test recommended before first use</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}