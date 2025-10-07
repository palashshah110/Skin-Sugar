import { useContext } from "react";
import { AppContext } from "../../App";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function ProfilePage() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/home');
  };

  return (
 <div className="py-16">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-12">
        <div className="flex items-center space-x-6">
          <div className="bg-white p-4 rounded-full">
            <User className="w-12 h-12 text-green-500" />
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-green-100">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  className="w-full px-4 py-3 border rounded-lg text-gray-700"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 text-gray-700"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full text-left p-4 border rounded-lg transition-all duration-200 group"
              >
                <div className="font-medium text-gray-900 group-hover:text-green-700">My Orders</div>
                <div className="text-sm text-gray-600 group-hover:text-green-600">View your order history</div>
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="w-full text-left p-4 border rounded-lg transition-all duration-200 group"
              >
                <div className="font-medium text-gray-900 group-hover:text-green-700">Shopping Cart</div>
                <div className="text-sm text-gray-600 group-hover:text-green-600">Review items in your cart</div>
              </button>
              <button
                onClick={() => navigate('/customize-basket')}
                className="w-full text-left p-4 border rounded-lg  transition-all duration-200 group"
              >
                <div className="font-medium text-gray-900 group-hover:text-green-700">Gift Baskets</div>
                <div className="text-sm text-gray-600 group-hover:text-green-600">Create custom gift baskets</div>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 group"
              >
                <div className="font-medium text-red-600 group-hover:text-red-700">Logout</div>
                <div className="text-sm text-red-500 group-hover:text-red-600">Sign out of your account</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}