import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, ShoppingCart } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ 
    customer: '', 
    amount: '', 
    status: 'pending' 
  });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        // Update existing order
        await api.put(`/admin/orders/${editingOrder._id}`, { 
          ...formData, 
          amount: Number(formData.amount) 
        });
        toast.success('Order updated successfully');
      } else {
        // Create new order
        await api.post('/admin/orders', { 
          ...formData, 
          amount: Number(formData.amount),
          items: [], // Add empty items array as required by schema
          shippingInfo: {} // Add empty shipping info as required by schema
        });
        toast.success('Order created successfully');
      }
      
      fetchOrders(); // Refresh the orders list
      setShowModal(false);
      setEditingOrder(null);
      setFormData({ customer: '', amount: '', status: 'pending' });
      
    } catch (error) {
      console.error('Error saving order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save order';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ 
      customer: order.user?.name || order.customer || '', 
      amount: order.totalAmount || order.amount || '', 
      status: order.status || 'pending' 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this order?')) {
        await api.delete(`/admin/orders/${id}`);
        toast.success('Order deleted successfully');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete order';
      toast.error(errorMessage);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getCustomerName = (order) => {
    return order.user?.name || order.customer || 'N/A';
  };

  const getOrderAmount = (order) => {
    return order.totalAmount || order.amount || 0;
  };

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
    </div>
  );

  const filteredOrders = orders.filter(order => {
    const customerName = getCustomerName(order).toLowerCase();
    const status = (order.status || '').toLowerCase();
    const searchLower = searchText.toLowerCase();
    
    return customerName.includes(searchLower) || status.includes(searchLower);
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <ShoppingCart className="w-6 h-7 text-rose-600" />
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 flex items-center gap-2"
        >
          + Add Order
        </button>
      </div>

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by customer name or status..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getCustomerName(order)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{getOrderAmount(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-rose-500 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEdit(order)} 
                      className="text-rose-600 hover:text-rose-900"
                      title="Edit Order"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(order._id)} 
                      className="text-red-600 hover:text-red-900"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingOrder ? 'Edit Order' : 'Add New Order'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input 
                  type="text" 
                  required 
                  value={formData.customer} 
                  onChange={(e) => setFormData({...formData, customer: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input 
                  type="number" 
                  required 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter order amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex space-x-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => { 
                    setShowModal(false); 
                    setEditingOrder(null); 
                    setFormData({ customer: '', amount: '', status: 'pending' });
                  }} 
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
                >
                  {editingOrder ? 'Update' : 'Create'} Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;