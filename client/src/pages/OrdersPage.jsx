import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { ROUTES } from '../constants/routes';
import { FRENCH_COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { formatImageUrl } from '../utils/imageUtils';

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const downloadReceipt = async (orderId) => {
    try {
      await orderService.generateReceipt(orderId);
    } catch (err) {
      console.error('Failed to download receipt:', err);
      alert('Failed to download receipt. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: FRENCH_COLORS.blue }}></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* French-inspired header with tricolor design */}
      <div className="relative py-12 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
        </div>
        
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ color: FRENCH_COLORS.dark }}
          >
            My Orders
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mt-2 text-gray-600 max-w-xl mx-auto"
          >
            View and manage all your orders with Fuchisius Cosmetics
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 rounded-md shadow-sm text-red-700 p-4 mb-8" 
            style={{ borderColor: FRENCH_COLORS.red }}
            role="alert"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {/* Order header with status badge */}
                <div className="p-6 border-b relative" style={{ borderColor: `${FRENCH_COLORS.blue}10` }}>
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold" style={{ color: FRENCH_COLORS.dark }}>
                          Order #{order.orderNumber}
                        </h2>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'PENDING' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadReceipt(order.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-gray-50"
                        style={{ color: FRENCH_COLORS.red }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Receipt
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order content with product details */}
                <div className="p-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-6 mb-4 last:mb-0">
                      <div className="w-full md:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.productImages?.[0]?.imageUrl ? (
                          <img 
                            src={formatImageUrl(item.product.productImages[0].imageUrl)}
                            alt={item.product?.name || 'Product'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold mb-2" style={{ color: FRENCH_COLORS.dark }}>
                          {item.product?.name || 'Product'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Quantity</p>
                            <p className="font-medium">{item.quantity || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium">
                              {formatCurrency(item.price ? (item.price / (item.quantity || 1)) : 0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Subtotal</p>
                            <p className="font-bold" style={{ color: FRENCH_COLORS.blue }}>
                              {formatCurrency(item.price || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Total */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Total Amount:</span>
                      <span className="text-xl font-bold" style={{ color: FRENCH_COLORS.red }}>
                        {formatCurrency(order.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order footer with actions */}
                <div className="px-6 py-4 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <Link
                      to={`/products/${order.items[0]?.productId}`}
                      className="inline-flex items-center text-sm font-medium transition-colors"
                      style={{ color: FRENCH_COLORS.blue }}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Product
                    </Link>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-500">
                      <div className="w-2 h-2 rounded-full" 
                        style={{ 
                          backgroundColor: order.status === 'COMPLETED' 
                            ? '#10B981' 
                            : order.status === 'PENDING' 
                              ? '#F59E0B' 
                              : '#EF4444'
                        }} 
                      />
                      {order.status === 'PENDING' && 'Payment under review'}
                      {order.status === 'COMPLETED' && 'Order completed'}
                      {order.status === 'CANCELLED' && 'Order cancelled'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-32 h-32" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
                <div className="w-32 h-32 bg-white"></div>
                <div className="w-32 h-32" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
              </div>
              <svg className="w-20 h-20 mx-auto text-gray-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>No Orders Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your order history will appear here once you've made your first purchase. Explore our premium collection of French-inspired cosmetics!
            </p>
            <Link 
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium transition-all transform hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: FRENCH_COLORS.blue }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Shop Now
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 