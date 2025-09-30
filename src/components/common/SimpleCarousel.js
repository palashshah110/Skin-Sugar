import { useState, useEffect, useContext, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppContext } from '../../App';

const SimpleCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setCurrentPage } = useContext(AppContext);

  const banners = [
    {
      id: 1,
      title: "Festival Gift Hampers",
      description: "Curated luxury collections starting at ₹1999",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
      theme: "bg-gradient-to-r from-purple-600 to-pink-600"
    },
    {
      id: 2,
      title: "Diwali Special",
      description: "Up to 30% off on premium skincare",
      image: "https://template.canva.com/EAFO_hXQ74U/2/0/1600w-9LOZYP8yGdw.jpg",
      theme: "bg-gradient-to-r from-amber-600 to-orange-600"
    },
    {
      id: 3,
      title: "New Collection",
      description: "Rose Quartz luxury skincare line",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop",
      theme: "bg-gradient-to-r from-rose-600 to-pink-600"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlideCallback = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  useEffect(() => {
    const interval = setInterval(nextSlideCallback, 5000);
    return () => clearInterval(interval);
  }, [nextSlideCallback]);
  const currentBanner = banners[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentBanner.image})` }}
      >
        <div className={`absolute inset-0 ${currentBanner.theme} opacity-50`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          {currentBanner.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          {currentBanner.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all" onClick={() => setCurrentPage('products')}>
            Shop Now
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20" onClick={() => setCurrentPage('products')}>
            View Offers
          </button>
        </div>
      </div>
    <div className='hidden sm:block'>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
          </div>


      {/* Slide Indicators (optional, keep or remove) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default SimpleCarousel;
