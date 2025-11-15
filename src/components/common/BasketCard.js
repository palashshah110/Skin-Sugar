import React from 'react';
import { Plus, Minus, Trash2, Leaf, Star } from 'lucide-react';

function BasketCard({ 
  item, 
  onIncrease, 
  onDecrease, 
  onRemove 
}) {
  const productId = item._id || item.id;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-emerald-100 overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        
        {/* Product Image */}
        <div className="relative sm:w-1/3">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-48 sm:h-full object-cover"
          />

          {/* Natural Badge */}
          <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
            <Leaf className="w-3 h-3" />
            <span>Natural</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-green-600 font-medium mb-1">Key Ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.slice(0, 2).map((ingredient, index) => (
                    <span 
                      key={index}
                      className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs border border-green-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                  {item.ingredients.length > 2 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      +{item.ingredients.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.floor(item.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`} 
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {item.rating || 0} ({item.reviews || 0})
              </span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between mt-4">
            {/* Price Info */}
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
              {item.originalPrice > item.price && (
                <>
                  <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Save ₹{item.originalPrice - item.price}
                  </span>
                </>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onDecrease(productId)}
                className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="text-emerald-700 font-bold text-sm min-w-[24px] text-center">
                {item.quantity || 1}
              </span>

              <button
                onClick={() => onIncrease(productId)}
                className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(productId)}
                className="ml-2 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                title="Remove from basket"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketCard;
