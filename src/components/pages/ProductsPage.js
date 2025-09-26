import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import mockProducts from "../data/mockProducts";
import categories, { getAllSubcategories } from "../data/categories";
import ProductCard from "../common/ProductCard";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);

  const allSubcategories = getAllSubcategories();

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = mockProducts.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const subcategoryMatch = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    return categoryMatch && subcategoryMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
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
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
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
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    All Products
                  </button>
                </div>

                {/* Main Categories */}
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className={`w-full flex items-center justify-between p-4 font-semibold text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        {expandedCategories.includes(category.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedCategories.includes(category.id) && (
                        <div className="border-t border-gray-200">
                          {/* All in Category Option */}
                          <button
                            onClick={() => handleCategorySelect(category.id)}
                            className={`w-full text-left py-2 px-6 text-sm transition-colors ${
                              selectedCategory === category.id && selectedSubcategory === 'all'
                                ? 'bg-rose-100 text-rose-600 font-medium'
                                : 'text-gray-600 hover:bg-rose-50'
                            }`}
                          >
                            All {category.name}
                          </button>

                          {/* Subcategories */}
                          {category.subcategories.map((subcategoryId) => {
                            const subcategory = allSubcategories.find(sub => sub.id === subcategoryId);
                            return (
                              <button
                                key={subcategoryId}
                                onClick={() => {
                                  setSelectedCategory(category.id);
                                  handleSubcategorySelect(subcategoryId);
                                }}
                                className={`w-full text-left py-2 px-6 text-sm transition-colors border-t border-gray-100 ${
                                  selectedSubcategory === subcategoryId
                                    ? 'bg-rose-100 text-rose-600 font-medium'
                                    : 'text-gray-600 hover:bg-rose-50'
                                }`}
                              >
                                {subcategory?.name || subcategoryId}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sort By */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
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
                  {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
                  {selectedCategory !== 'all' && (
                    <span className="text-rose-600 font-medium">
                      {' '}in {categories.find(cat => cat.id === selectedCategory)?.name || 'Category'}
                    </span>
                  )}
                  {selectedSubcategory !== 'all' && (
                    <span className="text-rose-600 font-medium">
                      {' '}› {allSubcategories.find(sub => sub.id === selectedSubcategory)?.name}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more products.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}