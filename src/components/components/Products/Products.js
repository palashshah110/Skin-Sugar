// components/Products/Products.js
import { motion } from 'framer-motion'
import { Candle, Car, Bath, Heart, Gift } from 'lucide-react'

export default function Products() {
  const categories = [
    {
      icon: Candle,
      title: 'Fragrance & Home Care',
      items: [
        'Scented Candles – Hand-poured with love and infused with calming aromas',
        'Car & Air Fresheners – Long-lasting natural fragrances'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Bath,
      title: 'Bath & Body Care',
      items: [
        'Soaps & Shower Essentials – Herbal, moisturizing luxury cleanse',
        'Body Creams & Lotions – Enriched with essential oils'
      ],
      color: 'from-blue-500 to-teal-500'
    },
    {
      icon: Heart,
      title: 'Skincare Essentials',
      items: [
        'Face Serums, Scrubs & Masks – Active botanicals for radiant skin',
        'Lip & Hand Care – Gentle nourishment for softness'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Gift,
      title: 'Gifting Range',
      items: [
        'Thoughtfully curated Gift Sets',
        'Elegant, aromatic, and heartfelt presentations'
      ],
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <section id="products" className="py-20 bg-primary-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-plum mb-4">
            Our Products
          </h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover our range of pure, herbal, and aromatic products crafted for holistic well-being
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <category.icon className="w-8 h-8 text-primary-plum" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-primary-plum mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-serif font-semibold text-primary-plum mb-12">
            Why Choose Swedha Essentials
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              '100% Natural & Cruelty-Free Ingredients',
              'Crafted with Care in Small Batches',
              'Premium Fragrance Blends',
              'Eco-Friendly & Recyclable Packaging',
              'Ethically Sourced Raw Materials',
              'Traditional Wisdom, Modern Science'
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-primary-gold/20"
              >
                <p className="text-primary-plum font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}