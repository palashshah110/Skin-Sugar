import { useContext, useEffect, useState } from "react";
import { Filter, ChevronDown, ChevronUp, Gift, ShoppingCart } from "lucide-react";
import { fetchCategoriesAndSubcategories } from "../data/categories";
import ProductCard from "../common/ProductCard";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import api from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function CustomizeBasket() {
  const location = useLocation();
  const selectedBasket = location.state?.basket || null;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [currentBasket, setCurrentBasket] = useState(1);
  const { setBasketItems, basketItems, user } = useContext(AppContext);

  const MAX_ITEMS_PER_BASKET = selectedBasket?.maxItems || 3;
  const BASKET_PRICE = selectedBasket?.price || 100;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategoriesAndSubcategories();
        setCategories(data.categories || []);
        setAllSubcategories(data.subcategories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Unable to load categories');
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [categoryId]
    );
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category?._id === selectedCategory || product.category === selectedCategory;
    const subcategoryMatch = selectedSubcategory === 'all' || product.subcategory?._id === selectedSubcategory || product.subcategory === selectedSubcategory;
    return categoryMatch && subcategoryMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'name': return (a.name || '').localeCompare(b.name || '');
      default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('all');
    if (categoryId !== 'all') {
      setExpandedCategories(prev => [...prev, categoryId]);
    }
  };

  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  // Basket Functions
  const addToBasket = async (product) => {
    const currentBasketItems = basketItems.filter(item => item.basketNumber === currentBasket);
    const productLength = currentBasketItems.reduce((acc, item) => acc + item.quantity, 0);

    // Check if product already exists in current basket
    const existingProduct = currentBasketItems.find(item => {
      const itemId = item._id || item.id;
      const productId = product._id || product.id;
      return itemId === productId;
    });
    if (existingProduct) {
      if (currentBasketItems.length >= MAX_ITEMS_PER_BASKET || productLength >= MAX_ITEMS_PER_BASKET) {
        const result = await Swal.fire({
          title: 'Basket Full!',
          html: `This gift basket can only contain ${MAX_ITEMS_PER_BASKET} products. <br><br>Do you want to start a new basket?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ec4899',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Start New Basket',
          cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
          // Start new basket
          const newBasketNumber = Math.max(...getUniqueBaskets()) + 1;
          setCurrentBasket(newBasketNumber);
          setBasketItems(prev => [...prev, {
            ...product,
            basketNumber: newBasketNumber,
            quantity: 1
          }]);

          Swal.fire({
            title: 'New Basket Created!',
            text: `You are now customizing Basket #${newBasketNumber}`,
            icon: 'success',
            confirmButtonColor: '#ec4899'
          });
        }
        return;
      }
      // Increase quantity of existing product
      setBasketItems(prev =>
        prev.map(item => {
          const itemId = item._id || item.id;
          const productId = product._id || product.id;
          return itemId === productId && item.basketNumber === currentBasket
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        })
      );
      return;
    }

    // Check if basket is full for new products
    if (currentBasketItems.length >= MAX_ITEMS_PER_BASKET || productLength >= MAX_ITEMS_PER_BASKET) {
      const result = await Swal.fire({
        title: 'Basket Full!',
        html: `This gift basket can only contain ${MAX_ITEMS_PER_BASKET} products. <br><br>Do you want to start a new basket?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ec4899',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Start New Basket',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Start new basket
        const newBasketNumber = Math.max(...getUniqueBaskets()) + 1;
        setCurrentBasket(newBasketNumber);
        setBasketItems(prev => [...prev, {
          ...product,
          basketNumber: newBasketNumber,
          quantity: 1
        }]);

        Swal.fire({
          title: 'New Basket Created!',
          text: `You are now customizing Basket #${newBasketNumber}`,
          icon: 'success',
          confirmButtonColor: '#ec4899'
        });
      }
      return;
    }

    // Add new product to current basket
    setBasketItems(prev => [...prev, {
      ...product,
      basketNumber: currentBasket,
      quantity: 1
    }]);
  };

  const removeFromBasket = (productId, basketNumber = currentBasket) => {
    setBasketItems(prev => {
      // Find the item to check its quantity
      const existingItem = prev.find(item => {
        const itemId = item._id || item.id;
        return itemId === productId && item.basketNumber === basketNumber;
      });

      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prev.map(item => {
          const itemId = item._id || item.id;
          return itemId === productId && item.basketNumber === basketNumber
            ? { ...item, quantity: item.quantity - 1 }
            : item;
        });
      } else {
        // Remove completely if quantity is 1 or less
        return prev.filter(item => {
          const itemId = item._id || item.id;
          return !(itemId === productId && item.basketNumber === basketNumber);
        });
      }
    });
  };

  const clearBasket = (basketNumber = null) => {
    if (basketNumber) {
      setBasketItems(prev => prev.filter(item => item.basketNumber !== basketNumber));
    } else {
      setBasketItems([]);
      setCurrentBasket(1);
    }
  };

  const switchBasket = (basketNumber) => {
    setCurrentBasket(basketNumber);
  };

  const getBasketTotal = (basketNumber) => {
    const basketProducts = basketItems.filter(item => item.basketNumber === basketNumber);
    const productsTotal = basketProducts.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    return productsTotal + BASKET_PRICE;
  };

  const getBasketItems = (basketNumber) => {
    return basketItems.filter(item => item.basketNumber === basketNumber);
  };

  const getUniqueBaskets = () => {
    return [...new Set(basketItems.map(item => item.basketNumber))].sort((a, b) => a - b);
  };
  const navigate = useNavigate()
  const proceedToCheckout = () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }
    if (basketItems.length === 0) {
      Swal.fire({
        title: 'Empty Basket!',
        text: 'Please add some products to your gift basket',
        icon: 'warning',
        confirmButtonColor: '#ec4899'
      });
      return;
    }

    const totalBaskets = getUniqueBaskets().length;
    const totalItems = basketItems.length;
    const totalAmount = getUniqueBaskets().reduce((sum, basket) => sum + getBasketTotal(basket), 0);

    Swal.fire({
      title: 'Ready to Checkout!',
      html: `
      <div class="text-left">
        <p>You have <strong>${totalItems} product(s)</strong> in <strong>${totalBaskets} basket(s)</strong></p>
        <div class="mt-3 space-y-2">
          ${getUniqueBaskets().map(basketNum => `
            <div class="flex justify-between text-sm">
              <span>Basket #${basketNum}:</span>
              <span>₹${getBasketTotal(basketNum)}</span>
            </div>
          `).join('')}
        </div>
        <div class="mt-3 border-t pt-2 flex justify-between font-bold">
          <span>Total Amount:</span>
          <span>₹${totalAmount}</span>
        </div>
      </div>
    `,
      icon: 'success',
      confirmButtonColor: '#ec4899',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Checkout',
      cancelButtonText: 'Continue Shopping',
      width: '500px'
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to checkout page with basket data
        navigate('/checkout', {
          state: {
            basketItems,
            basketType: 'gift',
            baskets: getUniqueBaskets().map(basketNum => ({
              basketNumber: basketNum,
              items: basketItems.filter(item => item.basket === basketNum),              
              total: getBasketTotal(basketNum)
            }))
          }
        });
      }
    });
  };

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  // Find category and subcategory names for display
  const getCategoryName = (categoryId) => {
    if (categoryId === 'all') return '';
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || '';
  };

  const getSubcategoryName = (subcategoryId) => {
    if (subcategoryId === 'all') return '';
    const subcategory = allSubcategories.find(sub => sub._id === subcategoryId);
    return subcategory?.name || '';
  };

  if (loading && products.length === 0) {
    return <Loader />;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customize Your {selectedBasket?.name || 'Gift Basket'}
          </h1>
          <p className="text-xl text-gray-600">
            Add products to your {selectedBasket?.name?.toLowerCase() || 'basket'} (Max: {MAX_ITEMS_PER_BASKET} items)
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Gift className="w-6 h-6 text-rose-600" />
                <div>
                  <p className="text-rose-800 font-semibold">
                    {selectedBasket?.name} - ₹{BASKET_PRICE} + Product Costs
                  </p>
                  <p className="text-rose-700 text-sm">
                    Capacity: {MAX_ITEMS_PER_BASKET} items • Size: {selectedBasket?.dimensions}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/basket-selection')}
                className="text-rose-600 hover:text-rose-700 text-sm font-medium"
              >
                Change Basket
              </button>
            </div>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-green-100">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                {/* Basket Summary */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <Gift className="w-4 h-4 mr-2" />
                    Your Gift Baskets
                  </h4>

                  {getUniqueBaskets().map(basketNum => (
                    <div key={basketNum} className={`mb-3 p-3 rounded border ${currentBasket === basketNum ? 'bg-white border-green-300' : 'bg-green-100 border-green-200'
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-800">Basket #{basketNum}</span>
                        <button
                          onClick={() => switchBasket(basketNum)}
                          className={`text-xs px-2 py-1 rounded ${currentBasket === basketNum
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-green-600 border border-green-300'
                            }`}
                        >
                          {currentBasket === basketNum ? 'Active' : 'Switch'}
                        </button>
                      </div>

                      {/* Basket items preview */}
                      <div className="mb-2">
                        <div className="text-xs text-green-600 mb-1">
                          {getBasketItems(basketNum).length}/{MAX_ITEMS_PER_BASKET} items
                        </div>

                        {getBasketItems(basketNum).length > 0 ? (
                          <div className="space-y-2">
                            {/* Show first 2-3 items with images */}
                            {getBasketItems(basketNum).slice(0, 3).map((item, index) => (
                              <div
                                key={item.id || index}
                                className="group relative flex items-center gap-2 p-2 bg-white rounded border hover:bg-green-50 transition-colors duration-200"
                              >
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-800 truncate">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    Qty: {item.quantity} × ₹{item.price}
                                  </div>
                                </div>

                                {/* Delete button that appears on hover */}
                                <button
                                  onClick={() => removeFromBasket(item._id, basketNum)}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
                                  title="Remove item"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}

                            {/* Show "+X more" if there are more items */}
                            {getBasketItems(basketNum).length > 3 && (
                              <div className="text-xs text-green-600 text-center py-1 bg-green-50 rounded">
                                +{getBasketItems(basketNum).length - 3} more items
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic py-2 text-center">
                            Basket is empty
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center border-t border-green-200 pt-2">
                        <div className="text-sm font-semibold text-green-900">
                          Total: ₹{getBasketTotal(basketNum)}
                        </div>

                        {getBasketItems(basketNum).length > 0 && (
                          <button
                            onClick={() => clearBasket(basketNum)}
                            className="text-xs text-red-600 hover:text-red-800 hover:underline"
                          >
                            Clear Basket
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {basketItems.length > 0 && (
                    <button
                      onClick={proceedToCheckout}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Checkout All Baskets</span>
                    </button>
                  )}
                </div>

                {/* All Products Option */}
                <div className="mb-6">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-600'
                      }`}
                  >
                    All Products
                  </button>
                </div>

                {/* Main Categories */}
                <div className="space-y-4">
                  {categories?.map((category) => (
                    <div key={category._id} className="border border-green-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category._id)}
                        className={`w-full flex items-center justify-between p-4 font-semibold text-left transition-colors ${selectedCategory === category._id
                          ? 'bg-green-50 text-green-600'
                          : 'bg-white text-gray-700 hover:bg-green-50'
                          }`}
                      >
                        <span>{category.name}</span>
                        {expandedCategories?.includes(category._id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedCategories?.includes(category._id) && (
                        <div className="border-t border-green-200">
                          {/* All in Category Option */}
                          <button
                            onClick={() => handleCategorySelect(category._id)}
                            className={`w-full text-left py-2 px-6 text-sm transition-colors ${selectedCategory === category._id && selectedSubcategory === 'all'
                              ? 'bg-green-100 text-green-600 font-medium'
                              : 'text-gray-600 hover:bg-green-50'
                              }`}
                          >
                            All {category.name}
                          </button>

                          {/* Subcategories */}
                          {category?.subcategories?.map((subcategoryId) => {
                            const subcategory = allSubcategories.find(sub => sub._id === subcategoryId.id);
                            if (!subcategory) return null;

                            return (
                              <button
                                key={subcategory._id}
                                onClick={() => {
                                  setSelectedCategory(category._id);
                                  handleSubcategorySelect(subcategory._id);
                                }}
                                className={`w-full text-left py-2 px-6 text-sm transition-colors border-t border-green-100 ${selectedSubcategory === subcategory._id
                                  ? 'bg-green-100 text-green-600 font-medium'
                                  : 'text-gray-600 hover:bg-green-50'
                                  }`}
                              >
                                {subcategory.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sort By */}
                <div className="mt-6 pt-6 border-t border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
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
              <div>
                <p className="text-gray-600">
                  {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} available
                  {selectedCategory !== 'all' && (
                    <span className="text-green-600 font-medium">
                      {' '}in {getCategoryName(selectedCategory)}
                    </span>
                  )}
                  {selectedSubcategory !== 'all' && (
                    <span className="text-green-600 font-medium">
                      {' '}› {getSubcategoryName(selectedSubcategory)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Gift className="w-5 h-5" />
                <span className="font-semibold">Current Basket: #{currentBasket}</span>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more herbal products.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToBasket={addToBasket}
                    onRemoveFromBasket={removeFromBasket}
                    basketItems={basketItems}
                    showBasketButton={true}
                    currentBasket={currentBasket}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}