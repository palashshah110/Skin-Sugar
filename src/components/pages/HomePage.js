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
      {/* Customize Hamper Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 gap-8">
            {[
              {
                title: "Customize Your Hampers",
                image: "https://plus.unsplash.com/premium_photo-1661398229744-e38032aa4e05?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2940",
                description: "Create your own custom hampers with our selection of herbal ingredients",
                link: "/basket-selection"
              }
            ].map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => navigate(category.link)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                      <p className="text-white/90 text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Category Showcase Section */}
      <section className="py-16 bg-white">
        <h1 className="text-4xl font-bold text-center text-black-800 mb-12">
          Discover Our Categories
        </h1>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                _id: categories.find((cat) => cat.name.toLowerCase().includes("skincare"))?._id,
                title: "Natural Skincare",
                image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "Pure herbal solutions for radiant skin",
                link: `/categories/${categories.find((cat) => cat.name.toLowerCase().includes("skincare"))?._id}`
              },
              {
                _id: categories.find((cat) => cat.name.toLowerCase().includes("aroma"))?._id,
                title: "Aesthetic Aromas",
                image: "https://img.freepik.com/free-photo/spa-composition-with-incense-sticks-air-humidifier-aroma-oils_169016-57223.jpg",
                description: "Elevate your space with natural fragrances",
                link: `/categories/${categories.find((cat) => cat.name.toLowerCase().includes("aroma"))?._id}`
              },
              {
                _id: categories.find((cat) => cat.name.toLowerCase().includes("chocolates"))?._id,
                title: "Handcrafted Chocolates",
                image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                description: "Artisanal chocolates made with love",
                link: `/categories/${categories.find((cat) => cat.name.toLowerCase().includes("chocolates"))?._id}`
              }
            ].map((category) => (
              <div
                key={category._id}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate(category.link)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                      <p className="text-white/90 text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br   from-green-50 to-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover why thousands of customers trust our natural products for their wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                rating: 5,
                comment: "The natural skincare products transformed my skin! I've never felt more confident. The results are visible within weeks.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                product: "Rose & Sandalwood Face Cream"
              },
              {
                name: "Rahul Mehta",
                location: "Delhi",
                rating: 5,
                comment: "The aromatherapy candles create such a peaceful atmosphere in my home. Perfect for meditation and relaxation after work.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                product: "Lavender Essential Oil Candle"
              },
              {
                name: "Ananya Patel",
                location: "Bangalore",
                rating: 5,
                comment: "Handcrafted chocolates are absolutely divine! The perfect gift for my family. They loved the natural sweetness without guilt.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                product: "Dark Chocolate Assortment"
              },
              {
                name: "Vikram Singh",
                location: "Chennai",
                rating: 5,
                comment: "The custom hamper service is exceptional! Created a beautiful gift basket for my wife's birthday. She was thrilled!",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                product: "Custom Anniversary Hamper"
              },
              {
                name: "Sneha Reddy",
                location: "Hyderabad",
                rating: 5,
                comment: "As someone with sensitive skin, I'm amazed how gentle yet effective these products are. No reactions, just glowing skin!",
                image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                product: "Aloe Vera & Neem Face Wash"
              },
              {
                name: "Arjun Kapoor",
                location: "Pune",
                rating: 5,
                comment: "The eco-friendly packaging and natural ingredients convinced me to switch. My entire family now uses these products.",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                product: "Complete Skincare Kit"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">{testimonial.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SocialIcons />
    </div>
  );
}