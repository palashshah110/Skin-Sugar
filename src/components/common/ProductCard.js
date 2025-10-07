import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Star, Plus, Minus, ShoppingCart, Leaf } from 'lucide-react';
import { AppContext } from "../../App";

function ProductCard({ product, onAddToBasket, onRemoveFromBasket, showBasketButton = false, basketItems = [], currentBasket = 1 }) {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(AppContext);
  
  // Get a consistent product identifier
  const productId = product._id || product.id;
  
  // Check if this specific product is in cart and get its quantity
  const cartItem = cart.find(item => {
    const itemId = item._id || item.id;
    return itemId === productId;
  });
  
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Check if this specific product is in the current basket and get its quantity
  const basketItem = basketItems.find(item => {
    const itemId = item._id || item.id;
    return itemId === productId && item.basketNumber === currentBasket;
  });
  
  const quantityInBasket = basketItem ? basketItem.quantity : 0;

  const viewProduct = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => {
        const itemId = item._id || item.id;
        return itemId === productId;
      });
      
      if (existing) {
        return prev.map(item => {
          const itemId = item._id || item.id;
          return itemId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (e) => {
    e.stopPropagation();
    setCart(prev => 
      prev.map(item => {
        const itemId = item._id || item.id;
        return itemId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      })
    );
  };

  const decreaseQuantity = (e) => {
    e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => {
        const itemId = item._id || item.id;
        return itemId === productId;
      });
      
      if (existing && existing.quantity === 1) {
        return prev.filter(item => {
          const itemId = item._id || item.id;
          return itemId !== productId;
        });
      }
      
      return prev.map(item => {
        const itemId = item._id || item.id;
        return itemId === productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item;
      });
    });
  };

  const handleAddToBasket = (e) => {
    e.stopPropagation();
    if (onAddToBasket) {
      onAddToBasket(product);
    }
  };

  const increaseBasketQuantity = (e) => {
    e.stopPropagation();
    if (onAddToBasket) {
      onAddToBasket(product);
    }
  };

  const decreaseBasketQuantity = (e) => {
    e.stopPropagation();
    if (onRemoveFromBasket) {
      onRemoveFromBasket(productId, currentBasket);
    }
  };

  // Determine which UI to show based on context
  const renderCartControls = () => {
    if (quantityInCart > 0) {
      return (
        <div className="flex-1 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <button
            onClick={decreaseQuantity}
            className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="text-green-700 font-bold text-sm">
            {quantityInCart}
          </span>
          
          <button
            onClick={increaseQuantity}
            className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Cart</span>
        </button>
      );
    }
  };

  const renderBasketControls = () => {
    if (quantityInBasket > 0) {
      return (
        <div className="flex-1 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <button
            onClick={decreaseBasketQuantity}
            className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="text-emerald-700 font-bold text-sm">
            {quantityInBasket}
          </span>
          
          <button
            onClick={increaseBasketQuantity}
            className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={handleAddToBasket}
          disabled={!product.inStock}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <Gift className="w-4 h-4" />
          <span>Add to Basket</span>
        </button>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Natural Product Badge */}
        <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
          <Leaf className="w-3 h-3" />
          <span>Natural</span>
        </div>
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Cart Quantity Badge */}
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
            {quantityInCart}
          </div>
        )}
        
        {/* Basket Quantity Badge */}
        {showBasketButton && quantityInBasket > 0 && (
          <div className="absolute top-10 right-2 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
            {quantityInBasket}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Ingredients Preview */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-green-600 font-medium mb-1">Key Ingredients:</p>
            <div className="flex flex-wrap gap-1">
              {product.ingredients.slice(0, 2).map((ingredient, index) => (
                <span 
                  key={index}
                  className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs border border-green-200"
                >
                  {ingredient}
                </span>
              ))}
              {product.ingredients.length > 2 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  +{product.ingredients.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.rating || 0} ({product.reviews || 0})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
            {product.originalPrice > product.price && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          {!showBasketButton && (
            <button
              onClick={viewProduct}
              className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
            >
              View Details
            </button>
          )}
          
          {showBasketButton ? renderBasketControls() : renderCartControls()}
        </div>

      </div>
    </div>
  );
}

export default ProductCard;