import { useState, useEffect, useMemo } from 'react';

export const useProductFilter = (products, initialFilters = {}) => {
  const [filters, setFilters] = useState({
    category: null,
    priceRange: { min: 0, max: Infinity },
    sortBy: 'newest',
    ...initialFilters
  });
  
  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by category if specified - handle both string and number comparisons
      if (filters.category) {
        const filterCategoryId = parseInt(filters.category);
        const productCategoryId = typeof product.categoryId === 'string' 
          ? parseInt(product.categoryId) 
          : product.categoryId;
        
        // Debug category comparison
        console.log(`Comparing product ${product.id} category: ${productCategoryId} with filter: ${filterCategoryId}`);
        
        if (isNaN(filterCategoryId) || isNaN(productCategoryId) || productCategoryId !== filterCategoryId) {
          return false;
        }
      }
      
      // Filter by price range
      const price = parseFloat(product.price);
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort based on selected criteria
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [products, filters]);
  
  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  return {
    filters,
    updateFilters,
    filteredProducts
  };
}; 