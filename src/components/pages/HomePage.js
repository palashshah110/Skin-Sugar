import { useContext } from "react";
import mockProducts from '../data/mockProducts';
import { AppContext } from "../../App";
import { Award, Leaf, Shield, Truck } from "lucide-react";
import ProductCard from "../common/ProductCard";
export default function HomePage() {
  const { setCurrentPage } = useContext(AppContext);

  const featuredProducts = mockProducts.filter(product => product.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
            Pure Luxury
            <br />
            <span className="text-4xl md:text-6xl">Handcrafted for You</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover our premium collection of handcrafted herbal skincare solutions,
            where nature meets luxury in every drop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Explore Collection
            </button>
            <button className="border-2 border-rose-300 text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-50 transform hover:scale-105 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}