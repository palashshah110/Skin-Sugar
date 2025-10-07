import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, FolderTree } from 'lucide-react';
import api from '../../api';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', isActive: true });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/admin/categories");
      setCategories(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };
  const fetchSubcategories = async () => {
    try {
      const { data } = await api.get("/admin/subcategories");
      setSubcategories(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSub) {
        // Update existing subcategory
        const { data } = await api.put(
          `/admin/subcategories/${editingSub._id}`,
          formData
        );
        setSubcategories(subcategories.map(sub =>
          sub._id === editingSub._id ? data.subcategory : sub
        ));
      } else {
        // Add new subcategory
        const { data } = await api.post(
          "/admin/subcategories",
          formData
        );
        setSubcategories([...subcategories, data.subcategory]);
      }

      // Reset modal and form
      setShowModal(false);
      setEditingSub(null);
      setFormData({ name: '', category: '', isActive: true });
    } catch (error) {
      console.error("Error saving subcategory:", error);
    }
  };

  const handleEdit = (sub) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      category: sub?.category?._id || "",
      isActive: sub.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/subcategories/${id}`);
      setSubcategories(subcategories.filter(sub => sub._id !== id));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  const filteredSubcategories = subcategories.filter(
    sub =>
      sub.name.toLowerCase().includes(searchText.toLowerCase()) ||
      sub?.category?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <FolderTree className="w-6 h-7 text-rose-600" />
          <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" /> <span>Add Subcategory</span>
        </button>
      </div>

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubcategories.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sub.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{sub?.category?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {sub.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(sub)} className="text-rose-600 hover:text-rose-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(sub._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingSub ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  required
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            
               <div>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${formData.isActive ? 'transform translate-x-6' : 'transform translate-x-0'
                      }`} />
                  </div>
                </label>
              </div>

              <div className="flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSub(null);
                    setFormData({ name: '', category: '', isActive: true });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
                >
                  {editingSub ? 'Update' : 'Create'} Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategories;
