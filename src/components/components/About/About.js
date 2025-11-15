// components/About/About.js
import { motion } from 'framer-motion'
import { Leaf, Heart, Sparkles } from 'lucide-react'

export default function About() {
  const philosophy = [
    {
      icon: Leaf,
      title: 'Purity in Every Drop',
      description: 'No harsh chemicals, no parabens, no compromise.'
    },
    {
      icon: Heart,
      title: 'Sustainability with Soul',
      description: 'Cruelty-free, eco-friendly, and ethically made.'
    },
    {
      icon: Sparkles,
      title: 'Luxury Reimagined',
      description: 'Everyday essentials elevated with fragrance and finesse.'
    }
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-plum mb-4">
            Our Story
          </h2>
          <div className="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-serif font-semibold text-primary-plum mb-6">
              Essence of Purity
            </h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Swedha Essentials was born out of a desire to bring nature's healing touch into everyday living. 
              Inspired by ancient wellness traditions and crafted with care, our products are made using natural, 
              herbal, and organic ingredients that are gentle on your skin and kind to the planet.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We take pride in being an Indian brand that blends time-honored wisdom with contemporary craftsmanship. 
              Every formulation is thoughtfully curated — from sourcing pure essential oils to using eco-friendly packaging — 
              ensuring that each product radiates the true Essence of Purity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary-plum to-purple-800 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-10 h-10 text-primary-gold" />
                </div>
                <h4 className="text-2xl font-serif font-semibold mb-4">Our Philosophy</h4>
              </div>
              
              <div className="space-y-6">
                {philosophy.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-gold/20 rounded-full flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary-gold" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-primary-gold text-lg mb-1">{item.title}</h5>
                      <p className="text-white/90">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}