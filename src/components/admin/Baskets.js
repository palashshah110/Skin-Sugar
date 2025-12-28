import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, ShoppingBasket, Upload, X, Star, ChevronRight, ChevronLeft, ChevronDown, RefreshCw, ChevronsLeft } from 'lucide-react';
import api from '../../api';

const Baskets = () => {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBasket, setEditingBasket] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBaskets, setTotalBaskets] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedSize, setSelectedSize] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    maxItems: '',
    size: 'small',
    dimensions: '',
    features: [],
    category: '',
    inStock: true,
    rating: 0,
    reviews: 0,
    imageFile: null,
  });

  const sizeOptions = ['small', 'medium', 'large'];
  const categoryOptions = ['eco', 'traditional', 'luxury', 'modern', 'premium', 'corporate'];

  const fetchBaskets = useCallback(async (page = 1, limit = pageSize) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(selectedSize && { size: selectedSize })
      };

      const { data } = await api.get('/admin/baskets', { params });
      setBaskets(data.baskets || data || []);
      setTotalPages(data.totalPages || 1);
      setTotalBaskets(data.totalCount || data.length || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error('Error fetching baskets', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSize, pageSize]);

  useEffect(() => {
    fetchBaskets(currentPage, pageSize);
  }, [currentPage, pageSize, selectedSize, fetchBaskets]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedSize('');
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          form.append(key, JSON.stringify(formData[key]));
        } else if (key === 'imageFile') {
          if (formData.imageFile) form.append('image', formData.imageFile);
        } else {
          form.append(key, formData[key]);
        }
      });

      if (editingBasket) {
        if (formData.imageFile) {
          await api.put(`/admin/baskets/${editingBasket._id}`, form);
        } else if (imageRemoved) {
          form.append('image', null);
          await api.put(`/admin/baskets/${editingBasket._id}`, form);
        } else {
          await api.put(`/admin/baskets/${editingBasket._id}`, form);
        }
        fetchBaskets();
      } else {
        const { data } = await api.post('/admin/baskets', form);
        setBaskets([data || data.basket || {}, ...baskets]);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving basket', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (basket) => {
    setEditingBasket(basket);
    setFormData({
      name: basket.name,
      description: basket.description || '',
      price: basket.price,
      maxItems: basket.maxItems || '',
      size: basket.size || 'small',
      dimensions: basket.dimensions || '',
      features: basket.features || [],
      category: basket.category || '',
      inStock: basket.inStock !== undefined ? basket.inStock : true,
      rating: basket.rating || 0,
      reviews: basket.reviews || 0,
      imageFile: null,
    });
    setImagePreview(basket.image || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/baskets/${id}`);
      setBaskets(baskets.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting basket', error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleImageChange = (file) => {
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      maxItems: '',
      size: 'small',
      dimensions: '',
      features: [],
      category: '',
      inStock: true,
      rating: 0,
      reviews: 0,
      imageFile: null,
    });
    setNewFeature('');
    setImagePreview(null);
    setEditingBasket(null);
    setImageRemoved(false);
  };

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  const filteredBaskets = baskets.filter(
    b =>
      b.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      (b.category || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (b.size || '').toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <ShoppingBasket className="w-6 h-7 text-rose-600" />
          <h1 className="text-3xl font-bold text-gray-900">Baskets</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> <span>Add Basket</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Baskets</h3>
          <button
            onClick={handleClearFilters}
            disabled={!selectedSize}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-6 items-end">
          {/* Size Filter */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Sizes</option>
                {sizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Page Size and Pagination Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">baskets</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">{totalBaskets}</span> baskets
            </span>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search baskets by name, category, or size..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBaskets.map(b => (
              <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {b.image && (
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{b.name}</div>
                      <div className="text-xs text-gray-500">{b.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    b.size === 'small' ? 'bg-blue-100 text-blue-800' :
                    b.size === 'medium' ? 'bg-purple-100 text-purple-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {b.size?.charAt(0).toUpperCase() + b.size?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="font-semibold">₹{b.price}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {b.maxItems} items
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{b.rating || 0}</span>
                    <span className="text-xs text-gray-500">({b.reviews || 0})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${b.inStock
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {b.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(b)}
                    className="text-rose-600 hover:text-rose-800 p-1 rounded transition-colors"
                    title="Edit basket"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                    title="Delete basket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Last
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              {editingBasket ? 'Edit Basket' : 'Add New Basket'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Basket Image</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragActive
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-300 hover:border-rose-400'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex justify-center space-x-3">
                        <label className="cursor-pointer bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors text-sm">
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({ ...formData, imageFile: null });
                            setImageRemoved(true);
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3" onClick={() => document.getElementById('basket-image-upload').click()}>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <label className="cursor-pointer text-rose-600 hover:text-rose-700 font-medium">
                            Click to upload
                          </label>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files[0])}
                        className="hidden"
                        id="basket-image-upload"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Basket Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter basket name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter basket description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                  <select
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  >
                    {sizeOptions.map(size => (
                      <option key={size} value={size}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Max Items */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Items *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Number of items"
                    value={formData.maxItems}
                    onChange={(e) => setFormData({ ...formData, maxItems: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g., 12x10x8 inches"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Reviews */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="flex space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.inStock ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${formData.inStock ? 'transform translate-x-6' : ''
                      }`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-2"
                >
                  {submitLoading ? (
                    <span className="text-sm font-medium text-white">Submitting...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium text-white">{editingBasket ? 'Update' : 'Create'} Basket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Baskets;
