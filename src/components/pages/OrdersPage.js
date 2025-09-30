import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import { Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Adjust the import path as needed
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const {data} = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusBadge(order.status);
            
            return (
              <div key={order._id || order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id ? order._id.slice(-8).toUpperCase() : order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt || order.date)}
                      </p>
                      {order.shippingInfo && (
                        <p className="text-sm text-gray-600 mt-1">
                          {order.shippingInfo.city}, {order.shippingInfo.state}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span 
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{order.totalAmount || order.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items && order.items.map((item, index) => (
                      <div key={item._id || item.id || index} className="flex items-center space-x-4">
                        <img
                          src={item.product?.image || item.image}
                          alt={item.product?.name || item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.product?.name || item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ₹{item.price} each
                          </p>
                        </div>
                        <span className="font-medium">
                          ₹{(item.price || 0) * (item.quantity || 0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Information */}
                  {order.shippingInfo && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.shippingInfo.address}</p>
                        <p>
                          {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
                        </p>
                        <p>Phone: {order.shippingInfo.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Status */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <span className={`text-sm font-medium ${
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
            );
          })}
        </div>
      </div>
    </div>
  );
}