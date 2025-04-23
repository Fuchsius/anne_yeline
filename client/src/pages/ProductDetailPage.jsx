import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services/productService';
import { ROUTES } from '../constants/routes';
import { FRENCH_COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Calculate display price with discount
const getDisplayPrice = (price, discount = 0) => {
  if (!discount) return price;
  return price * (1 - discount / 100);
};

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        
        const data = await productService.getProductById(id);
        
        // Log the raw product data for debugging
        console.log("Product data loaded:", data);
        
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || 'Failed to load product. Please try again.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.productImages && product.productImages.length > 0) {
      console.log("Product images array:", product.productImages);
      console.log("First image URL:", product.productImages[0].imageUrl);
      console.log("Formatted URL:", formatImageUrl(product.productImages[0].imageUrl));
    }
  }, [product]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? (value <= 10 ? value : 10) : 1);
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate(`${ROUTES.LOGIN}?redirect=product/${id}`);
      return;
    }

    try {
      // Get the main product image URL
      const productImageUrl = productImages.length > 0 ? 
        formatImageUrl(productImages[0].imageUrl) : '';
        
      // Create an order object with all necessary details
      const orderData = {
        productId: product.id,
        quantity: quantity,
        totalPrice: displayPrice * quantity,
        productDetails: {
          name: product.name,
          price: displayPrice,
          image: productImageUrl,
          sku: product.sku,
          weight: product.weight,
          category: product.category?.name
        },
        userDetails: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || ''
        }
      };

      // Store order data in localStorage
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      
      // Navigate to checkout
      navigate(ROUTES.CHECKOUT);
    } catch (error) {
      console.error('Failed to process purchase', error);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({ ...reviewForm, [name]: value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login if not logged in
      return;
    }

    setSubmitting(true);
    try {
      await productService.createReview(id, reviewForm);
      // Refresh product data to show the new review
      const updatedProduct = await productService.getProductById(id);
      setProduct(updatedProduct);
      // Reset form
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update the formatImageUrl function to properly handle all URL formats
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.log("Empty image URL received");
      return '';
    }
    
    console.log("Formatting image URL:", imageUrl);
    
    // If it's already a full URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // For relative paths, make sure they start with a slash
    let formattedUrl = imageUrl;
    if (!formattedUrl.startsWith('/')) {
      formattedUrl = '/' + formattedUrl;
    }
    
    // Prepend the API base URL
    const baseUrl = import.meta.env.VITE_API_URL.split('/api')[0];
    const fullUrl = `${baseUrl}${formattedUrl}`;
    
    console.log("Formatted to:", fullUrl);
    return fullUrl;
  };

  // Also simplify the productImages useMemo
  const productImages = useMemo(() => {
    if (!product || !product.productImages) return [];
    return product.productImages;
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center h-96">
        <div className="flex flex-col items-center">
          <div className="relative h-16 w-16 mb-4">
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" 
              style={{ borderColor: `${FRENCH_COLORS.blue} transparent ${FRENCH_COLORS.red} transparent` }}>
            </div>
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white opacity-50"></div>
          </div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-xl max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold">Product Not Found</h3>
          </div>
          <p className="mb-4">{error || "We couldn't find the product you're looking for."}</p>
          <div className="mb-4 p-4 bg-red-100 rounded text-sm">
            <p className="font-semibold">Debug Information:</p>
            <p>Requested Product ID: {id}</p>
            <p>API URL: {import.meta.env.VITE_API_URL}/products/{id}</p>
          </div>
          <Link 
            to={ROUTES.PRODUCTS} 
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Safely access product properties
  const {
    name,
    description,
    price = 0,
    discount = 0,
    stockCount = 0,
    category,
    brand,
    weight,
    ingredients,
    howToUse,
    benefits,
    images = []
  } = product;

  const displayPrice = getDisplayPrice(price, discount);
  const singleImage = !images || images.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* French-inspired header section */}
      <div className="relative py-8 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute h-full w-full"
            style={{ 
              backgroundImage: `
                radial-gradient(circle at 20% 30%, ${FRENCH_COLORS.red}30 0%, transparent 25%),
                radial-gradient(circle at 80% 70%, ${FRENCH_COLORS.blue}30 0%, transparent 30%)
              `
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to={ROUTES.HOME} className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link to={ROUTES.PRODUCTS} className="hover:text-gray-700">Products</Link>
            <span>/</span>
            {category && (
              <>
                <Link to={`/categories/${category.id}`} className="hover:text-gray-700">{category.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-700 font-medium truncate">{name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images Section - Modern Redesign with proper image sizing */}
            <div className="relative bg-white p-6 lg:p-8 rounded-xl">
              {/* Main image container with controlled aspect ratio */}
              <div className="relative w-full overflow-hidden rounded-lg mb-4 bg-gray-50" style={{ paddingTop: "100%" }}>
                {productImages.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4 text-gray-500 font-medium">No product images available</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Actual image - absolute positioned within container for proper sizing */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {productImages[selectedImage]?.imageUrl ? (
                        <img 
                          src={formatImageUrl(productImages[selectedImage].imageUrl)}
                          alt={`${name} - Image ${selectedImage + 1}`}
                          className="w-full h-full object-contain"
                          onLoad={() => console.log("Image loaded successfully")}
                          onError={(e) => {
                            console.error("Image failed to load:", formatImageUrl(productImages[selectedImage].imageUrl));
                            // Don't set any fallback - just log the error
                          }}
                        />
                      ) : (
                        <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                    
                    {/* Image counter badge */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      {selectedImage + 1} / {productImages.length}
                    </div>
                  </>
                )}
                
                {/* Image navigation arrows - only show if multiple images */}
                {productImages.length > 1 && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 z-20">
                    <button
                      onClick={() => {
                        setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                      }}
                      className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                      }}
                      className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Thumbnails - visual grid with improved spacing and gaps */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-4 mt-6">
                  {productImages.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(idx);
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                        selectedImage === idx 
                          ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-md' 
                          : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:scale-102 hover:shadow-sm'
                      }`}
                    >
                      {image.imageUrl ? (
                        <img 
                          src={formatImageUrl(image.imageUrl)}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Selected state overlay with improved visual feedback */}
                      {selectedImage === idx && (
                        <div className="absolute inset-0 bg-blue-500/10 z-20 border-2 border-blue-500"></div>
                      )}
                    </button>
                  ))}
                  
                  {/* Fill empty spots with placeholder thumbnails if fewer than 5 images */}
                  {Array.from({ length: Math.max(0, 5 - productImages.length) }).map((_, idx) => (
                    <div 
                      key={`empty-${idx}`} 
                      className="relative aspect-square rounded-lg bg-gray-50 flex items-center justify-center border border-dashed border-gray-200"
                    >
                      <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details Section */}
            <div className="p-6 lg:p-10 flex flex-col">
              {/* Category and product name */}
              <div className="mb-6">
                {category && (
                  <Link 
                    to={`/categories/${category.id}`} 
                    className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full"
                    style={{ 
                      backgroundColor: `${FRENCH_COLORS.blue}15`,
                      color: FRENCH_COLORS.blue
                    }}
                  >
                    {category.name}
                  </Link>
                )}
                <h1 className="text-3xl font-bold" style={{ color: FRENCH_COLORS.dark }}>{name}</h1>
                
                {/* Brand info if available */}
                {brand && (
                  <div className="mt-2 flex items-center text-gray-500">
                    <span className="mr-1">By</span>
                    <span className="font-medium">{brand}</span>
                  </div>
                )}
              </div>
              
              {/* Price section */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold" style={{ color: discount > 0 ? FRENCH_COLORS.red : FRENCH_COLORS.blue }}>
                    LKR {displayPrice.toLocaleString()}
                  </span>
                  
                  {discount > 0 && (
                    <span className="ml-3 text-lg line-through text-gray-500">
                      LKR {price.toLocaleString()}
                    </span>
                  )}
                </div>
                
                {discount > 0 && (
                  <div className="mt-1 flex items-center">
                    <span className="text-sm font-medium text-green-600">
                      You save: LKR {((price - displayPrice)).toLocaleString()} ({discount}%)
                    </span>
                  </div>
                )}
                
                {/* Stock information */}
                <div className="mt-4 flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      stockCount > 5 ? 'bg-green-500' : (stockCount > 0 ? 'bg-yellow-500' : 'bg-red-500')
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {stockCount > 5 ? 'In Stock' : (stockCount > 0 ? `Low Stock (${stockCount} left)` : 'Out of Stock')}
                  </span>
                </div>
              </div>
              
              {/* Product Details Section - Enhanced with more important details while keeping UI */}
              <div className="mb-8 space-y-8">
                {/* Product Details Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${FRENCH_COLORS.blue}` }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: FRENCH_COLORS.blue }}>
                    Product Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weight && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        <div>
                          <span className="text-sm text-gray-500">Weight</span>
                          <p className="font-medium">{weight}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">SKU</span>
                        <p className="font-medium">{product.sku || `SKU-${id}`}</p>
                      </div>
                    </div>

                    {category && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <div>
                          <span className="text-sm text-gray-500">Category</span>
                          <p className="font-medium">{category.name}</p>
                        </div>
                      </div>
                    )}

                    {brand && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className="text-sm text-gray-500">Brand</span>
                          <p className="font-medium">{brand}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">Stock Status</span>
                        <p className={`font-medium ${stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stockCount > 5 ? 'In Stock' : (stockCount > 0 ? `Low Stock (${stockCount} left)` : 'Out of Stock')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredients Section */}
                {ingredients && (
                  <div className="bg-white p-6 rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${FRENCH_COLORS.red}` }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: FRENCH_COLORS.red }}>
                      Ingredients
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{ingredients}</p>
                  </div>
                )}

                {/* How to Use Section */}
                {howToUse && (
                  <div className="bg-white p-6 rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${FRENCH_COLORS.blue}` }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: FRENCH_COLORS.blue }}>
                      How to Use
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{howToUse}</p>
                  </div>
                )}

                {/* Benefits Section */}
                {benefits && (
                  <div className="bg-white p-6 rounded-lg shadow-sm" style={{ borderLeft: `4px solid ${FRENCH_COLORS.purple || '#8B5CF6'}` }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: FRENCH_COLORS.purple || '#8B5CF6' }}>
                      Benefits
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {Array.isArray(benefits) ? (
                        benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))
                      ) : (
                        <li>{benefits}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Actions: Quantity and Buy now */}
              <div className="mt-auto">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="w-full sm:w-1/3">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <div className="flex border border-gray-300 rounded-md">
                      <button
                        type="button"
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        className="flex-1 p-2 text-center border-0 focus:ring-0 focus:outline-none"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={stockCount || 10}
                      />
                      <button
                        type="button"
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setQuantity(Math.min(stockCount || 10, quantity + 1))}
                        disabled={quantity >= (stockCount || 10)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                    <div className="h-full flex items-center px-4 bg-gray-50 rounded-md">
                      <span className="text-lg font-bold" style={{ color: FRENCH_COLORS.blue }}>
                        LKR {(displayPrice * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={submitting || stockCount <= 0}
                    className="w-full py-3 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: FRENCH_COLORS.red,
                      color: 'white',
                      boxShadow: `0 4px 14px ${FRENCH_COLORS.red}40`
                    }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>Buy Now</>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={stockCount <= 0}
                    className="w-full py-3 rounded-full text-center font-medium border transition-colors"
                    style={{ 
                      borderColor: FRENCH_COLORS.blue,
                      color: FRENCH_COLORS.blue 
                    }}
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products would go here */}
      </div>
    </div>
  );
}; 