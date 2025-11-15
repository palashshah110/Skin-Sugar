// components/Hero/Hero.js
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-plum via-purple-900 to-primary-plum overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo/Brand Mark */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-primary-gold/10 rounded-full flex items-center justify-center border border-primary-gold/30">
              <div className="w-24 h-24 bg-primary-gold/20 rounded-full flex items-center justify-center">
                <span className="text-4xl text-primary-gold font-serif">S</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            Swedha Essentials
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-gold font-serif mb-8">
            Essence of Purity
          </p>

          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            At Swedha Essentials, we believe that true beauty and wellness come from nature's purest elements. 
            Experience the perfect blend of tradition and modern science.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-gold text-primary-plum px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-200 transition-colors shadow-lg"
              >
                Explore Our Collection
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-primary-gold text-primary-gold px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-gold/10 transition-colors"
              >
                Our Story
              </motion.button>
            </Link>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 text-primary-gold/80 text-lg font-light"
          >
            ✨ Breathe in nature. Feel the essence of purity.
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-gold rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}