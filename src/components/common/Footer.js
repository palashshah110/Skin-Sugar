import { Facebook, Instagram, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-full">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Skin Sugars
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Premium handcrafted herbal skincare solutions for your natural beauty routine.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <Facebook/>
              <Instagram />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products')}     
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate('/products/face-care')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Face Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products/body-care')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Body Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products/lip-care')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Lip Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products/hair-care')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Hair Care
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get updates on new products and offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-rose-500"
              />
              <button className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 rounded-r-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Skin Sugars. All rights reserved. Made with ❤️ for natural beauty.
          </p>
        </div>
      </div>
    </footer>
  );
}