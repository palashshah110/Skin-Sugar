import api from "../../api";

// Fetch categories and subcategories
export const fetchCategoriesAndSubcategories = async () => {
  try {
    const [categoriesResponse, subcategoriesResponse] = await Promise.all([
      api.get("/categories"),
      api.get("/subcategories"),
    ]);

    const categories = categoriesResponse.data || [];
    const subcategories = subcategoriesResponse.data || [];

    // Attach subcategories to their categories
    const categoriesWithSubs = categories.map(category => ({
      ...category,
      subcategories: subcategories
        .filter(sub => sub.category === category._id) // assuming each subcategory has a "category" field
        .map(sub => ({
          id: sub._id,
          name: sub.name,
        })),
    }));

    return { categories: categoriesWithSubs, subcategories };
  } catch (error) {
    console.error("Error fetching categories/subcategories:", error);
    return { categories: [], subcategories: [] };
  }
};

// Helper: get all subcategories
export const getAllSubcategories = () => {
  return
};

// Helper: get subcategories for a specific category
export const getSubcategoriesByCategory = (categoryId, subcategories) => {
  return subcategories
    .filter(sub => sub.category === categoryId)
    .map(sub => ({
      id: sub._id,
      name: sub.name,
    }));
};

