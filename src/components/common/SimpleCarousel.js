import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Gift, Star, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SimpleCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const banners = [
    {
      id: 1,
      title: "Herbal Gift Hampers",
      subtitle: "Curated Natural Collections",
      description: "Special festive hampers starting at ₹1999",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
      buttonText: "Shop Hampers",
      icon: Gift,
      theme: "bg-gradient-to-r from-green-600 to-emerald-600",
      overlay: "from-green-600/80 to-emerald-600/80"
    },
    {
      id: 2,
      title: "Natural Skincare Offer",
      subtitle: "Up to 40% Off",
      image: "https://template.canva.com/EAFO_hXQ74U/2/0/1600w-9LOZYP8yGdw.jpg",
      description: "Pure herbal skincare for your natural glow",
      buttonText: "Shop Now",
      icon: Leaf,
      theme: "bg-gradient-to-r from-emerald-600 to-green-600",
      overlay: "from-emerald-600/80 to-green-600/80"
    },
    {
      id: 3,
      title: "New Herbal Collection",
      subtitle: "Forest Essence Line",
      description: "Experience our latest natural skincare innovations",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop",
      buttonText: "Discover",
      icon: Star,
      theme: "bg-gradient-to-r from-green-500 to-emerald-500",
      overlay: "from-green-500/80 to-emerald-500/80"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentBanner = banners[currentSlide];
  const IconComponent = currentBanner.icon;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Green Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentBanner.image})` }}
      >
        <div className={`absolute inset-0 ${currentBanner.overlay}`}></div>
      </div>

      {/* Natural Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <IconComponent className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-2xl">
            {currentBanner.title}
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-4 text-white/90 drop-shadow-lg">
            {currentBanner.subtitle}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {currentBanner.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-2" onClick={() => navigate('/products')}>
              <span>{currentBanner.buttonText}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleCarousel;