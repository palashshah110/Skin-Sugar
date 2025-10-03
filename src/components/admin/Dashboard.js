import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  LayoutDashboard
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }
  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN")}`;

  // helper to format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const PageHeader = ({ title, icon: Icon }) => (
    <div>
      <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
        <Icon className="w-7 h-7 text-rose-600" /> {title}
      </h1>
      <p className="text-gray-600">Manage all {title.toLowerCase()}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" icon={LayoutDashboard} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.totalUsers || 0}
          change="+12%"
          changeType="positive"
        />
        <StatCard
          icon={Package}
          title="Total Products"
          value={stats?.totalProducts || 0}
          change="+5%"
          changeType="positive"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change="+23%"
          changeType="positive"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          change="+18%"
          changeType="positive"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryStats?.map(cat => ({
                    name: cat._id,
                    value: cat.count
                  })) || []}
                  cx="45%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats?.categoryStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.recentOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-3 font-mono text-xs">
                  #{order._id.slice(-6)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.user?.name}</div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-700"
                    >
                      {item.quantity}× ₹{item.price}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {order.orderType === "gift_basket" ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                      🎁 Gift Basket
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      Regular
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, change, changeType }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
