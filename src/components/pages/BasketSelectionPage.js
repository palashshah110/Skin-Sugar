import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Check, Star, ArrowRight, Filter, Search } from 'lucide-react';
import { AppContext } from '../../App';
import { baskets } from '../data/baskets';

export default function BasketSelectionPage() {
    const [selectedBasket, setSelectedBasket] = useState(null);
    const [filteredBaskets, setFilteredBaskets] = useState(baskets);
    const [selectedSize, setSelectedSize] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const { setSelectedBasket: setContextBasket } = useContext(AppContext);
    const navigate = useNavigate();

    // Get unique sizes and categories for filters
    const sizes = ['all', ...new Set(baskets.map(basket => basket.size))];
    const categories = ['all', ...new Set(baskets.map(basket => basket.category))];


    const filterBaskets = useCallback(() => {
        let filtered = baskets;

        // Filter by size
        if (selectedSize !== 'all') {
            filtered = filtered.filter(basket => basket.size === selectedSize);
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(basket => basket.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(basket =>
                basket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                basket.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBaskets(filtered);
    }, [selectedSize, selectedCategory, searchTerm]);

    const handleBasketSelect = (basket) => {
        setSelectedBasket(basket);
        setContextBasket(basket);
    };

    const proceedToCustomization = () => {
        if (!selectedBasket) {
            alert('Please select a basket first');
            return;
        }
        navigate('/customize-basket', { state: { basket: selectedBasket } });
    };
    
    useEffect(() => {
        filterBaskets();
    }, [selectedSize, selectedCategory, searchTerm, filterBaskets]);

    const clearFilters = () => {
        setSelectedSize('all');
        setSelectedCategory('all');
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Gift className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Perfect Hamper
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Browse our collection of beautifully designed hampers and select the perfect one for your occasion.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search hampers by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        {/* Filter Toggle for Mobile */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>

                        {/* Filters */}
                        <div className={`flex flex-col lg:flex-row gap-4 w-full lg:w-auto ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {sizes.map(size => (
                                    <option key={size} value={size}>
                                        {size === 'all' ? 'All Sizes' : `${size.charAt(0).toUpperCase() + size.slice(1)}`}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : `${category.charAt(0).toUpperCase() + category.slice(1)}`}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={clearFilters}
                                className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                        Showing {filteredBaskets.length} of {baskets.length} hampers
                    </p>
                    {selectedBasket && (
                        <div className="flex items-center gap-2 text-green-600">
                            <Gift className="w-5 h-5" />
                            <span className="font-semibold">Selected: {selectedBasket.name}</span>
                        </div>
                    )}
                </div>

                {/* Basket Selection Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredBaskets.map((basket, index) => (
                        <div
                            key={basket.id}
                            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${selectedBasket?.id === basket.id
                                    ? 'border-green-500 shadow-xl'
                                    : 'border-gray-200 hover:border-green-300'
                                }`}
                            onClick={() => handleBasketSelect(basket)}
                        >
                            {/* Rating Badge */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                {basket.rating}
                            </div>

                            {/* Popular Badge */}
                            {basket.rating >= 4.8 && (
                                <div className="absolute top-4 right-4">
                                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Popular
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Image */}
                                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                                    <img
                                        src={basket.image}
                                        alt={basket.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedBasket?.id === basket.id && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                {/* Basket Info */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {basket.name}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">{basket.description}</p>

                                {/* Capacity and Size */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-gray-600">Capacity:</span>
                                        <span className="font-semibold text-green-600">
                                            {basket.maxItems} items
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Size:</span>
                                        <span className="font-medium capitalize">{basket.size}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-2 mb-4">
                                    {basket.features.slice(0, 2).map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                            <span className="truncate">{feature}</span>
                                        </div>
                                    ))}
                                    {basket.features.length > 2 && (
                                        <div className="text-xs text-gray-500 text-center">
                                            +{basket.features.length - 2} more features
                                        </div>
                                    )}
                                </div>

                                {/* Price and Reviews */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900">₹{basket.price}</span>
                                        <span className="text-gray-500 text-sm ml-2">basket</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">
                                            {basket.reviews} reviews
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBaskets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎁</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No hampers found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters to see more options.</p>
                        <button
                            onClick={clearFilters}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Action Button */}
                <div className="text-center">
                    <button
                        onClick={proceedToCustomization}
                        disabled={!selectedBasket}
                        className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto ${selectedBasket
                                ? 'hover:from-green-500 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                    >
                        <span>Customize Your {selectedBasket?.name || 'Hamper'}</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {!selectedBasket && (
                        <p className="text-gray-500 mt-4">Please select a hamper to continue</p>
                    )}
                </div>
            </div>
        </div>
    );
}