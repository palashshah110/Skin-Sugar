import { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../../App';
import { Truck, Gift, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const navigate = useNavigate();
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/user/' + user._id);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user,fetchOrders]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return config;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    const statusConfig = getStatusBadge(order.status);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order._id ? order._id.slice(-8).toUpperCase() : order.id}
              </h3>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt || order.date)}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              <p className="text-lg font-bold text-gray-900 mt-1">
                ₹{order.totalAmount || order.total}
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

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold ">
                  <span>Total Amount</span>
                  <span>₹{(order.totalAmount || order.total)}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'paid' 
                      ? 'text-green-600' 
                      : order.paymentStatus === 'failed'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                  </span>
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

  if (!user) {
    return (
      <div className="py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Truck className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to view your orders</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Truck className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="text-sm text-gray-600">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusBadge(order.status);
            
            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {order.orderType === 'gift_basket' ? (
                            <div className="flex items-center gap-1 text-rose-600">
                              <Gift className="w-4 h-4" />
                              <span className="text-xs font-medium">Gift Basket Order</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Package className="w-4 h-4" />
                              <span className="text-xs font-medium">Regular Order</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span 
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Items Summary</h4>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            {order.orderType === 'gift_basket' && order.baskets && 
                              ` in ${order.baskets.length} basket${order.baskets.length !== 1 ? 's' : ''}`
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                          <p className="text-sm text-gray-600">
                            {order.shippingInfo.city}, {order.shippingInfo.state}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }} 
        />
      )}
    </div>
  );
}