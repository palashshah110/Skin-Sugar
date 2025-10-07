import { useState, useEffect } from "react";
import { Award, Leaf, Shield, Truck, Star, Sparkles, Heart, User } from "lucide-react";
import ProductCard from "../common/ProductCard";
import SocialIcons from "../common/SocialIcons";
import SimpleCarousel from "../common/SimpleCarousel.js";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import theme from "../theme/theme.js";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // Fetch featured products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch featured products
        const productsResponse = await api.get("/products", {
          params: {
            featured: 'true'
          }
        });

        // Fetch categories
        const categoriesResponse = await api.get("/categories");
        setFeaturedProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create category options including "All Products"
  const categoryOptions = [
    { _id: 'all', name: 'All Products', icon: Star }
  ];

  // Map API categories to the format needed for the UI
  categories.forEach(category => {
    // You can customize the icon mapping based on category name or other properties
    let icon = User; // default icon

    if (category.name.toLowerCase().includes('chemical')) icon = User;
    else if (category.name.toLowerCase().includes('aroma')) icon = Sparkles;
    else if (category.name.toLowerCase().includes('chocolate')) icon = Heart;

    categoryOptions.push({
      _id: category._id,
      name: category.name,
      icon: icon
    });
  });

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all'
    ? featuredProducts
    : featuredProducts.filter(product =>
      product.category?._id === selectedCategory ||
      product.subcategory?._id === selectedCategory
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading featured products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <SimpleCarousel />

      {/* Brand Promise Banner */}
      <section className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-green-800 font-medium">
            {theme.branding.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose {theme.branding.companyName}?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the purity of nature in every product - {theme.branding.tagline}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "100% Natural & Herbal",
                desc: "Pure plant-based ingredients sourced directly from nature"
              },
              {
                icon: Award,
                title: "Handcrafted with Love",
                desc: "Artisanally made in small batches with traditional methods"
              },
              {
                icon: Shield,
                title: "Safe & Tested",
                desc: "Dermatologically tested, free from harsh chemicals"
              },
              {
                icon: Truck,
                title: "Eco-Friendly Delivery",
                desc: "Sustainable packaging with free shipping above ₹999"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="card-gradient p-6 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300 border border-green-100">
                  <feature.icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Our most loved herbal essentials</p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-green-100">
              <div className="flex flex-wrap justify-center gap-2">
                {categoryOptions.length > 1 && categoryOptions.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category._id
                          ? 'btn-primary shadow-lg'
                          : 'text-gray-700 hover:bg-white hover:text-green-600 hover:shadow-md'
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

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon!</h3>
              <p className="text-gray-600">New products are being prepared with natural care.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* CTA Button */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/products')}
                className="btn-primary text-lg px-8 py-4"
              >
                Explore All Products
              </button>
            </div>
          )}
        </div>
      </section>

      <SocialIcons />
    </div>
  );
}