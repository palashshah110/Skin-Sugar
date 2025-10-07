import {  Instagram, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Skin Sugars
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Premium handcrafted herbal skincare solutions for your natural beauty routine.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <div className="cursor-pointer text-white h-8 w-8 flex items-center justify-center" onClick={() => window.open('https://wa.me/9752709795', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="#fff"><path fill="#fff" d="M16.6 14c-.2-.1-1.5-.7-1.7-.8c-.2-.1-.4-.1-.6.1c-.2.2-.6.8-.8 1c-.1.2-.3.2-.5.1c-.7-.3-1.4-.7-2-1.2c-.5-.5-1-1.1-1.4-1.7c-.1-.2 0-.4.1-.5c.1-.1.2-.3.4-.4c.1-.1.2-.3.2-.4c.1-.1.1-.3 0-.4c-.1-.1-.6-1.3-.8-1.8c-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3c-.6.6-.9 1.3-.9 2.1c.1.9.4 1.8 1 2.6c1.1 1.6 2.5 2.9 4.2 3.7c.5.2.9.4 1.4.5c.5.2 1 .2 1.6.1c.7-.1 1.3-.6 1.7-1.2c.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2c5.5 0 9.9-4.4 9.9-9.9c.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3c-1.5 0-2.9-.4-4.2-1.1l-.3-.2l-3.1.8l.8-3l-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4" /></svg>              </div>
              <div className="cursor-pointer text-white h-8 w-8 flex items-center justify-center">
                <Instagram onClick={() => window.open('https://www.instagram.com/skin.sugars', '_blank')} />

              </div>
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
                  onClick={() => navigate('/products/chemical-free-skincare')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chemical Free Skincare
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products/aesthetic-aroma')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Aesthetic Aroma
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products/handmade-chocolates')}
                className="text-gray-400 hover:text-white transition-colors"
                >
                  Handmade Chocolates
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/customizebasket')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Gift Baskets
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
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-green-500"
              />
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-r-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Skin Sugars. All rights reserved. Made with 🌿 for natural beauty.
          </p>
        </div>
      </div>
    </footer>
  );
}