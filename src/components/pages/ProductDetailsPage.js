import { useContext } from "react";
import { AppContext } from "../../App";
import mockProducts from "../data/mockProducts";
import { useState, useEffect } from "react";
import { Star, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
export default function ProductDetailsPage() {
  const { setCurrentPage, cart, setCart, selectedProductId } = useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // For now, using the first product as demo
  // In a real app, you'd get the product ID from URL params or context
  useEffect(() => {
    setSelectedProduct(mockProducts.find(p => p.id === selectedProductId));
  }, [selectedProductId]);

  if (!selectedProduct) {
    return <div>Loading...</div>;
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
    setCurrentPage('cart');
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
                  onClick={buyNow}
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