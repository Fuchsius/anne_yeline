import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { FRENCH_COLORS } from '../../constants/theme';
import { formatImageUrl } from '../../utils/imageUtils';

export const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Defensive check to ensure product is valid
  if (!product || typeof product !== 'object') {
    console.error('Invalid product data received:', product);
    return <div className="bg-red-100 p-4 rounded">Invalid product data</div>;
  }
  
  // Safely access product properties
  const {
    id = '',
    name = 'Unknown Product',
    category = '',
    price = 0,
    originalPrice = price,
    discount = 0,
    description = '',
    tags = []
  } = product;
  
  // Handle category that might be an object or string
  const categoryName = typeof category === 'object' && category !== null 
    ? (category.name || 'Unknown Category') 
    : (typeof category === 'string' ? category : 'Unknown Category');
  
  const handleImageError = () => {
    console.warn(`Failed to load image for product: ${name}`);
    setImageError(true);
  };
  
  // Update the image handling part in ProductCard.jsx
  const getProductImage = (product) => {
    if (product.productImages && product.productImages.length > 0) {
      return formatImageUrl(product.productImages[0].imageUrl);
    }
    return null;
  };
  
  const productImages = [getProductImage(product)];
  const currentImage = productImages[activeImageIndex] || '';

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 transition-transform duration-300"
      style={{ 
        borderTop: `4px solid ${
          categoryName === "Skincare" ? FRENCH_COLORS.blue :
          categoryName === "Makeup" ? FRENCH_COLORS.red :
          FRENCH_COLORS.purple
        }`,
        boxShadow: isHovered 
          ? `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05), 0 0 0 2px ${FRENCH_COLORS.red}20`
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          {tags.includes('bestseller') && (
            <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-amber-500 text-white">
              BESTSELLER
            </span>
          )}
          {tags.includes('new') && (
            <span className="inline-block px-2 py-1 text-xs font-bold rounded" 
              style={{ backgroundColor: FRENCH_COLORS.blue, color: 'white' }}>
              NEW
            </span>
          )}
          {tags.includes('limited') && (
            <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-purple-600 text-white">
              LIMITED
            </span>
          )}
        </div>
      )}
      
      {/* Discount tag */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-12 h-12 flex items-center justify-center text-white font-bold rounded-full"
            style={{ backgroundColor: FRENCH_COLORS.red }}>
            {discount}%
          </div>
        </div>
      )}

      {/* Product image - updated to handle empty image URLs */}
      <div className="relative h-48 rounded-t-lg overflow-hidden bg-gray-100">
        {currentImage ? (
          <img 
            src={currentImage}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Image navigation dots - only show if there are multiple images */}
        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(index);
                  setImageError(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  activeImageIndex === index ? 'w-4 bg-white' : 'w-2 bg-white/60'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link 
            to={`${ROUTES.PRODUCTS}/${id}`}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300"
            style={{ color: FRENCH_COLORS.blue }}
          >
            Quick View
          </Link>
        </div>
      </div>
      
      {/* Product details */}
      <div className="p-5">
        <div className="mb-2">
          <span className="text-sm font-medium" style={{ color: FRENCH_COLORS.gray }}>
            {categoryName}
          </span>
        </div>
        
        <h3 className="text-lg font-bold mb-1 truncate" style={{ color: FRENCH_COLORS.dark }}>
          {name}
        </h3>
        
        <p className="text-sm mb-4 line-clamp-2 h-10" style={{ color: FRENCH_COLORS.gray }}>
          {description}
        </p>
        
        {/* Pricing and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            {discount > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: FRENCH_COLORS.red }}>
                    LKR {Math.round(price).toLocaleString()}
                  </span>
                  <span className="text-sm line-through" style={{ color: FRENCH_COLORS.gray }}>
                    LKR {originalPrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs" style={{ color: FRENCH_COLORS.green }}>
                  Save LKR {Math.round(originalPrice - price).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold" style={{ color: FRENCH_COLORS.blue }}>
                LKR {price.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Add to Cart button */}
          <button
            className="flex items-center justify-center rounded-full px-4 py-2 shadow-md hover:scale-105 active:scale-95 transition-transform"
            style={{ 
              backgroundColor: FRENCH_COLORS.red,
              color: 'white'
            }}
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}; 