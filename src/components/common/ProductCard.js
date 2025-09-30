import { useContext } from "react";
import { AppContext } from "../../App";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, category="all" }) {
  const { setSelectedProductId } = useContext(AppContext);
  const navigate = useNavigate();

  const viewProduct = (id) => {
    setSelectedProductId(id);
    navigate(`/products/${id}`);
  };

  if (category !== 'all' && product.category !== category) {
    return null;
  }

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
            onClick={() => viewProduct(product.id)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
}