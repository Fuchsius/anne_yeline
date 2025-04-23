import React from 'react';

export const FilterDebug = ({ products, filteredProducts, filters, categoryId }) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/80 text-white rounded-lg max-w-md max-h-96 overflow-auto text-xs font-mono">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <div className="mb-2">
        <strong>URL Category ID:</strong> {categoryId || 'none'}
      </div>
      <div className="mb-2">
        <strong>Filter Category:</strong> {filters.category || 'none'}
      </div>
      <div className="mb-2">
        <strong>Total Products:</strong> {products.length}
      </div>
      <div className="mb-2">
        <strong>Filtered Products:</strong> {filteredProducts.length}
      </div>
      <div className="mb-2 border-t border-gray-600 pt-2">
        <strong>Products with categoryId matching filter:</strong>{' '}
        {products.filter(p => p.categoryId == filters.category).length}
      </div>
      <div className="border-t border-gray-600 pt-2 mt-2">
        <strong>First 3 Products categoryIds:</strong>
        <ul className="list-disc pl-4">
          {products.slice(0, 3).map(p => (
            <li key={p.id}>ID: {p.id}, CategoryID: {p.categoryId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 