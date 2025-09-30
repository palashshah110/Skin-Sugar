import { useState } from "react";
import mockProducts from '../data/mockProducts';
import { Award, Leaf, Shield, Truck, Star, Sparkles, Heart, User } from "lucide-react";
import ProductCard from "../common/ProductCard";
import SocialIcons from "../common/SocialIcons";
import SimpleCarousel from "../common/SimpleCarousel";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const featuredProducts = mockProducts.filter(product => product.featured);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero Section */}
      <SimpleCarousel/>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Skin Sugars?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference of premium handcrafted skincare
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "100% Natural", desc: "Pure herbal ingredients sourced from nature" },
              { icon: Award, title: "Handcrafted", desc: "Artisanally made in small batches" },
              { icon: Shield, title: "Tested & Safe", desc: "Dermatologically tested for all skin types" },
              { icon: Truck, title: "Free Delivery", desc: "Complimentary shipping on orders above ₹999" }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Our most loved skincare essentials</p>
          </div>
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-rose-100">
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: 'all', name: 'All Products', icon: Star },
                  { id: 'chemical-free-skincare', name: 'Chemical Free Skincare', icon: User },
                  { id: 'aesthetic-aroma', name: 'Aesthetic Aroma', icon: Sparkles },
                  { id: 'handmade-chocolates', name: 'Handmade Chocolates', icon: Heart }
                ].map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white hover:text-rose-600 hover:shadow-md'
                        }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} category={selectedCategory} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
              <SocialIcons/>

    </div>
  );
}