import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, ShoppingCart, Eye, Package, Gift } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    status: 'pending',
    paymentStatus: 'pending'
  });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      setOrders(data.orders || data || []);
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
        await api.put(`/admin/orders/${editingOrder._id}`, {
          ...formData,
          amount: Number(formData.amount)
        });
        toast.success('Order updated successfully');
      } else {
        await api.post('/admin/orders', {
          ...formData,
          amount: Number(formData.amount),
          items: [],
          shippingInfo: {}
        });
        toast.success('Order created successfully');
      }

      fetchOrders();
      setShowModal(false);
      setEditingOrder(null);
      setFormData({ customer: '', amount: '', status: 'pending', paymentStatus: 'pending' });

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
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'pending'
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
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/payment-status`, { paymentStatus: newPaymentStatus });
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getCustomerName = (order) => {
    return order.user?.name || order.customer || 'N/A';
  };

  const getOrderAmount = (order) => {
    return order.totalAmount || order.amount || 0;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
    };
    return paymentConfig[paymentStatus] || paymentConfig.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const statusConfig = getStatusBadge(order.status);
    const paymentConfig = getPaymentStatusBadge(order.paymentStatus);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${paymentConfig.color}`}>
                  {paymentConfig.label}
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                ₹{getOrderAmount(order)}
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Order Type Badge */}
            {order.orderType === 'gift_basket' && (
              <div className="flex items-center gap-2 mb-6 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                <Gift className="w-5 h-5 text-rose-600" />
                <span className="font-semibold text-rose-700">Gift Basket Order</span>
              </div>
            )}

            {/* Gift Basket Display */}
            {order.orderType === 'gift_basket' && order.baskets && order.baskets.length > 0 ? (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Gift Baskets</h4>
                <div className="space-y-4">
                  {order.baskets.map((basket, basketIndex) => (
                    <div key={basketIndex} className="border-2 border-rose-200 rounded-lg p-4 bg-rose-50">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-bold text-rose-800 text-lg">Basket #{basket.basketNumber}</h5>
                        <span className="font-semibold text-rose-900">₹{basket.total}</span>
                      </div>
                      <div className="space-y-3">
                        {basket.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                            <img
                              src={item.product?.image || item.image}
                              alt={item.product?.name || item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">
                                {item.product?.name || item.name}
                              </h6>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <span className="font-medium">
                              ₹{item.quantity * item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Regular Order Items */
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Order Items</h4>
                <div className="space-y-3">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product?.image || item.image}
                        alt={item.product?.name || item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {item.product?.name || item.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{item.price} each
                        </p>
                      </div>
                      <span className="font-medium text-lg">
                        ₹{(item.price || 0) * (item.quantity || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Information */}
            {order.shippingInfo && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                  {order.orderType === 'gift_basket' ? 'Gift Delivery Information' : 'Shipping Address'}
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {order.orderType === 'gift_basket' && order.shippingInfo.recipientName && (
                    <p className="font-medium text-gray-900 mb-2">
                      Recipient: {order.shippingInfo.recipientName}
                    </p>
                  )}
                  <p className="text-gray-700">{order.shippingInfo.address}</p>
                  <p className="text-gray-700">
                    {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
                  </p>
                  <p className="text-gray-700">Phone: {order.shippingInfo.phone}</p>

                  {order.orderType === 'gift_basket' && order.shippingInfo.giftMessage && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="font-medium text-gray-900 mb-1">Gift Message:</p>
                      <p className="text-gray-700 italic">"{order.shippingInfo.giftMessage}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            {order.user && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">Customer Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Name:</strong> {order.user.name}</p>
                  <p className="text-gray-700"><strong>Email:</strong> {order.user.email}</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.totalAmount || order.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹99</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Amount</span>
                  <span>₹{(order.totalAmount || order.total) + 99}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Loader = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  const filteredOrders = orders.filter(order => {
    const customerName = getCustomerName(order).toLowerCase();
    const status = (order.status || '').toLowerCase();
    const paymentStatus = (order.paymentStatus || '').toLowerCase();
    const orderType = (order.orderType || '').toLowerCase();
    const searchLower = searchText.toLowerCase();

    return customerName.includes(searchLower) ||
      status.includes(searchLower) ||
      paymentStatus.includes(searchLower) ||
      orderType.includes(searchLower) ||
      (order._id || '').toLowerCase().includes(searchLower);
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
            placeholder="Search orders by customer, status, payment status, or type..."
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
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
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
              {filteredOrders.map(order => {
                const statusConfig = getStatusBadge(order.status);
                const paymentConfig = getPaymentStatusBadge(order.paymentStatus);

                return (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getCustomerName(order)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{getOrderAmount(order)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {order.orderType === 'gift_basket' ? (
                          <>
                            <Gift className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">Gift Basket</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-600 font-medium">Regular</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-rose-500 ${statusConfig.color}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.paymentStatus || 'pending'}
                        onChange={(e) => handlePaymentStatusUpdate(order._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-rose-500 ${paymentConfig.color}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
                );
              })}
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
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div className="flex space-x-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingOrder(null);
                    setFormData({ customer: '', amount: '', status: 'pending', paymentStatus: 'pending' });
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

      {/* Order Details Modal */}
      {showDetailsModal && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default Orders;