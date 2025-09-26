const mockProducts = [
  {
    id: 1,
    name: "Himalayan Rose Lip Butter",
    price: 899,
    originalPrice: 1199,
    category: "lip-care",
    rating: 4.8,
    reviews: 127,
    image: "https://nectarlife.com/cdn/shop/files/Lips_Collection_1080x1080_a3c99b64-bf32-488c-b97c-43ac20383bc1.jpg?v=1722637866",
    description: "Luxurious handcrafted lip butter infused with Himalayan rose petals",
    ingredients: ["Rose Petals", "Shea Butter", "Coconut Oil", "Vitamin E"],
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Lavender Dreams Body Mist",
    price: 1299,
    originalPrice: 1599,
    category: "body-care",
    rating: 4.9,
    reviews: 89,
    image: "/body_mist.png",
    description: "Refreshing lavender-infused body mist for daily aromatherapy",
    ingredients: ["Lavender Oil", "Rose Water", "Aloe Vera", "Glycerin"],
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Bodywash & Soaps Combo",
    price: 1599,
    originalPrice: 1999,
    category: "face-care",
    rating: 4.7,
    reviews: 203,
    image: "/Bodywash_&_Soaps_Combo.png",
    description: "Comprehensive body wash and soaps combo for all your cleansing needs",
    ingredients: ["Turmeric", "Bentonite Clay", "Neem", "Honey"],
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Coconut Vanilla Body Butter",
    price: 1099,
    originalPrice: 1399,
    category: "body-care",
    rating: 4.6,
    reviews: 156,
    image: "https://images.squarespace-cdn.com/content/v1/62ec3847fc7a110cbf3bb559/a2510526-e13d-4253-ab69-9fcbcbb27ee0/mini-body-butter-sugar-scrub-coconut.jpg?format=1000w",
    description: "Rich moisturizing body butter with tropical coconut and vanilla",
    ingredients: ["Coconut Oil", "Vanilla Extract", "Shea Butter", "Cocoa Butter"],
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "Green Tea Eye Serum",
    price: 2299,
    originalPrice: 2799,
    category: "face-care",
    rating: 4.8,
    reviews: 92,
    image: "https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/8/1/81zvdaXvvZL._SL1500_.jpg",
    description: "Rejuvenating eye serum with green tea and peptides",
    ingredients: ["Green Tea Extract", "Peptides", "Hyaluronic Acid", "Vitamin C"],
    inStock: false,
    featured: false
  },
  {
    id: 6,
    name: "Sandalwood Face Toner",
    price: 999,
    originalPrice: 1299,
    category: "face-care",
    rating: 4.5,
    reviews: 74,
    image: "https://juicychemistry.com/cdn/shop/files/Saffron_Rose_and_Australian_Sandalwood_Face_Scrub_2_TestedStudy.jpg?v=1756188696&width=1500",
    description: "Balancing face toner with pure sandalwood extract",
    ingredients: ["Sandalwood", "Rose Water", "Witch Hazel", "Aloe Vera"],
    inStock: true,
    featured: false
  }
];

export default mockProducts;