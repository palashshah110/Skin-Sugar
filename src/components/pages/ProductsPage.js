import { useEffect, useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { fetchCategoriesAndSubcategories } from "../data/categories";
import ProductCard from "../common/ProductCard";
import api from "../../api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
 const { categoryId } = useParams(); 
  const navigate = useNavigate();
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
useEffect(() => {
    if (categoryId && categories.length > 0) {
      const categoryFromRoute = categories.find(cat => cat._id === categoryId);
      if (categoryFromRoute) {
        setSelectedCategory(categoryFromRoute._id);
        setExpandedCategories(prev => [...prev, categoryFromRoute._id]);
      }
    }
  }, [categoryId, categories]);

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
    const routeName = Object.keys(categories).find(
        key => categories[key]._id === categoryId
      );
      if (routeName) {
        navigate(`/categories/${routeName}`, { replace: true });
      }
     else {
      navigate('/products', { replace: true });
    }
  };

  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-xl text-gray-600">Discover our complete range of premium herbal solutions</p>
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
              {/* All Products Option */}
              <div className="mb-6">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === 'all'
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
                      className={`w-full flex items-center justify-between p-4 font-semibold text-left transition-colors ${
                        selectedCategory === category._id
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
                          className={`w-full text-left py-2 px-6 text-sm transition-colors ${
                            selectedCategory === category._id && selectedSubcategory === 'all'
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
                                setShowFilters(false);
                              }}
                              className={`w-full text-left py-2 px-6 text-sm transition-colors border-t border-green-100 ${
                                selectedSubcategory === subcategory._id
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
              {/* <div className="mt-6 pt-6 border-t border-green-200">
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
              </div> */}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
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
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}