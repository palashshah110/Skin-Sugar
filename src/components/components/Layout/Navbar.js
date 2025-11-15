// components/Layout/Navbar.js
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-primary-plum text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center">
              <span className="text-primary-plum font-serif font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold">Swedha Essentials</h1>
              <p className="text-xs text-primary-gold">Essence of Purity</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-primary-gold transition-colors">Home</Link>
            <Link href="/about" className="hover:text-primary-gold transition-colors">About</Link>
            <Link href="/products" className="hover:text-primary-gold transition-colors">Products</Link>
            <Link href="/contact" className="hover:text-primary-gold transition-colors">Contact</Link>
            <button className="p-2 hover:bg-primary-gold/10 rounded-full transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="p-2">
              <ShoppingBag className="w-6 h-6" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-primary-plum border-t border-primary-gold/20">
            <div className="px-4 py-6 space-y-4">
              <Link href="/" className="block py-2 hover:text-primary-gold">Home</Link>
              <Link href="/about" className="block py-2 hover:text-primary-gold">About</Link>
              <Link href="/products" className="block py-2 hover:text-primary-gold">Products</Link>
              <Link href="/contact" className="block py-2 hover:text-primary-gold">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}