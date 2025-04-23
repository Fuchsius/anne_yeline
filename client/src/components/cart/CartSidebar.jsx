import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { ROUTES } from '../../constants/routes';
import { FRENCH_COLORS } from '../../constants/theme';
import { formatImageUrl } from '../../utils/imageUtils';
import { formatCurrency } from '../../utils/formatters';

export const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, toggleCart } = useCart();
  const navigate = useNavigate();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Close cart on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        toggleCart(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [toggleCart]);
  
  // Prevent body scroll when cart is open
  useEffect(() => {
    if (cart.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [cart.isOpen]);
  
  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateQuantity(id, newQuantity);
  };
  
  const handleCheckout = () => {
    toggleCart(false);
    navigate(ROUTES.CHECKOUT);
  };
  
  // Animation variants
  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => toggleCart(false)}
          />
          
          {/* Cart Sidebar */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke={FRENCH_COLORS.blue}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-xl font-bold" style={{ color: FRENCH_COLORS.dark }}>
                  Your Cart
                </h2>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => toggleCart(false)}
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Cart Items */}
            {cart.items.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex border border-gray-200 rounded-lg overflow-hidden">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={formatImageUrl(item.image)} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 p-3 flex flex-col">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-800 mb-1">{item.name}</h3>
                          <button 
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              aria-label="Decrease quantity"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              aria-label="Increase quantity"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="font-medium" style={{ color: FRENCH_COLORS.blue }}>
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => toggleCart(false)}
                  style={{ backgroundColor: FRENCH_COLORS.blue }}
                >
                  Browse Products
                </Link>
              </div>
            )}
            
            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {/* Clear Cart Button */}
                <div className="flex justify-end mb-4">
                  {showConfirmClear ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Are you sure?</span>
                      <button
                        className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                        onClick={() => {
                          clearCart();
                          setShowConfirmClear(false);
                        }}
                      >
                        Yes, clear
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                        onClick={() => setShowConfirmClear(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center"
                      onClick={() => setShowConfirmClear(true)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Cart
                    </button>
                  )}
                </div>
                
                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(cart.total)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">LKR 0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4">
                    <span>Total</span>
                    <span style={{ color: FRENCH_COLORS.red }}>{formatCurrency(cart.total)}</span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button
                  className="w-full py-3 rounded-md text-white font-medium shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: FRENCH_COLORS.red }}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                
                {/* Continue Shopping */}
                <button
                  className="w-full mt-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCart(false)}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 