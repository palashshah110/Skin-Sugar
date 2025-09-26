const categories = [
  {
    id: 'chemical-free-skincare',
    name: 'Chemical Free Skincare',
    subcategories: [
      'natural-soaps',
      'perfumed-soaps',
      'body-wash',
      'shower-gels',
      'body-shimmer',
      'body-scrub',
      'body-mists',
      'body-butters',
      'lip-butters',
      'mineral-bath-salts',
      'facial-clays',
      'kojic-acid-deodorising-balm',
      'skin-tightening-cream',
      'face-serums',
      'beetroot-blush',
      'facewash',
      'shampoos',
      'conditioners'
    ]
  },
  {
    id: 'aesthetic-aroma',
    name: 'Aesthetic Aroma',
    subcategories: [
      'scented-candles',
      'wax-melts',
      'wax-sachets',
      'diffuser-oils',
      'aroma-electric-diffusers',
      'aroma-candle-diffusers',
      'back-smoke-flow-diffusers'
    ]
  },
  {
    id: 'handmade-chocolates',
    name: 'Handmade Chocolates',
    subcategories: [
      'chocolate-bars',
      'chocolate-bytes',
      'dryfruit-chocolates-bytes',
      'caramelised-almonds',
      'butter-cashews',
      'assorted-dried-fruits'
    ]
  }
];

// Helper function to get all subcategories for filtering
export const getAllSubcategories = () => {
  return categories.flatMap(category => 
    category.subcategories.map(sub => ({
      id: sub,
      name: sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      category: category.id
    }))
  );
};

// Helper function to get subcategories for a specific category
export const getSubcategoriesByCategory = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.subcategories.map(sub => ({
    id: sub,
    name: sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  })) : [];
};

export default categories;