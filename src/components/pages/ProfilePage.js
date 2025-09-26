import { useContext } from "react";
import { AppContext } from "../../App";
import { User } from "lucide-react";
export default function ProfilePage() {
  const { user, setCurrentPage, setUser } = useContext(AppContext);

  if (!user) {
    setCurrentPage('login');
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="bg-white p-4 rounded-full">
                <User className="w-12 h-12 text-rose-500" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-rose-100">{user.email}</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentPage('orders')}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">My Orders</div>
                    <div className="text-sm text-gray-600">View your order history</div>
                  </button>
                  <button
                    onClick={() => setCurrentPage('cart')}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Shopping Cart</div>
                    <div className="text-sm text-gray-600">Review items in your cart</div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-red-600"
                  >
                    <div className="font-medium">Logout</div>
                    <div className="text-sm">Sign out of your account</div>
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