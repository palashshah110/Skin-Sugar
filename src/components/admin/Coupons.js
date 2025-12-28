import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Ticket, ChevronRight, ChevronLeft, ChevronDown, RefreshCw, ChevronsLeft, Copy, Check } from 'lucide-react';
import api from '../../api';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: '',
    usedCount: 0,
    isActive: true,
  });

  const discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₹)' }
  ];

  const fetchCoupons = useCallback(async (page = 1, limit = pageSize) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(selectedStatus && { isActive: selectedStatus === 'active' })
      };

      const { data } = await api.get('/admin/coupons', { params });
      setCoupons(data.coupons || data || []);
      setTotalPages(data.totalPages || 1);
      setTotalCoupons(data.totalCount || data.length || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error('Error fetching coupons', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, pageSize]);

  useEffect(() => {
    fetchCoupons(currentPage, pageSize);
  }, [currentPage, pageSize, selectedStatus, fetchCoupons]);

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
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      };

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon._id}`, payload);
        fetchCoupons();
      } else {
        const { data } = await api.post('/admin/coupons', payload);
        setCoupons([data || data.coupon || {}, ...coupons]);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving coupon', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      usedCount: coupon.usedCount || 0,
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/coupons/${id}`);
      setCoupons(coupons.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error deleting coupon', error);
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      await api.put(`/admin/coupons/${coupon._id}`, {
        ...coupon,
        isActive: !coupon.isActive
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon status', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      expiryDate: '',
      usageLimit: '',
      usedCount: 0,
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  const filteredCoupons = coupons.filter(
    c =>
      c.code?.toLowerCase().includes(searchText.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Ticket className="w-6 h-7 text-rose-600" />
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> <span>Add Coupon</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Coupons</h3>
          <button
            onClick={handleClearFilters}
            disabled={!selectedStatus}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-6 items-end">
          {/* Status Filter */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Coupons</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
            <span className="text-sm text-gray-600">coupons</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">{totalCoupons}</span> coupons
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
            placeholder="Search coupons by code or description..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCoupons.map(c => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {c.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(c.code)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === c.code ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {c.description && (
                    <div className="text-xs text-gray-500 mt-1">{c.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-gray-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </span>
                  {c.discountType === 'percentage' && c.maxDiscount && (
                    <div className="text-xs text-gray-500">Max: ₹{c.maxDiscount}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {c.minPurchase ? `₹${c.minPurchase}` : 'None'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="font-medium">{c.usedCount || 0}</span>
                  {c.usageLimit && (
                    <span className="text-gray-500"> / {c.usageLimit}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={isExpired(c.expiryDate) ? 'text-red-600' : 'text-gray-900'}>
                    {formatDate(c.expiryDate)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleCouponStatus(c)}
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      c.isActive && !isExpired(c.expiryDate)
                        ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                    }`}
                  >
                    {isExpired(c.expiryDate) ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-rose-600 hover:text-rose-800 p-1 rounded transition-colors"
                    title="Edit coupon"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                    title="Delete coupon"
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
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter coupon code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={generateCouponCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Enter description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  >
                    {discountTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                    step="0.01"
                    placeholder="0"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Min Purchase */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Max Discount (only for percentage) */}
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="No limit"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    />
                  </div>
                )}

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Unlimited"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              {/* Used Count (read-only when editing) */}
              {editingCoupon && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Times Used: <span className="font-semibold text-gray-900">{formData.usedCount}</span>
                    {formData.usageLimit && (
                      <span> / {formData.usageLimit}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${formData.isActive ? 'transform translate-x-6' : ''
                      }`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Active</span>
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
                      <span className="text-sm font-medium text-white">{editingCoupon ? 'Update' : 'Create'} Coupon</span>
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

export default Coupons;
