import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { FRENCH_COLORS } from '../constants/theme';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { ROUTES } from '../constants/routes';
import { useCart } from '../context/CartContext';
import { formatImageUrl } from '../utils/imageUtils';
import { formatCurrency } from '../utils/formatters';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [orderData, setOrderData] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentSlipPreview, setPaymentSlipPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('details'); // 'details', 'payment', 'confirmation'
  const [shippingDetails, setShippingDetails] = useState(null);

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate(ROUTES.PRODUCTS);
      return;
    }
    
    // Create order data from cart
    const orderItems = cart.items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));
    
    const orderData = {
      items: orderItems,
      totalPrice: cart.total
    };
    
    setOrderData(orderData);
  }, [cart, navigate]);

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentSlip(file);
      
      // Generate preview URL
      const previewUrl = URL.createObjectURL(file);
      setPaymentSlipPreview(previewUrl);
      
      // Clear any previous errors
      setError('');
    }
  };
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (paymentSlipPreview) {
        URL.revokeObjectURL(paymentSlipPreview);
      }
    };
  }, [paymentSlipPreview]);

  const handleShippingSubmit = (formData) => {
    setShippingDetails(formData);
    setStep('payment');
  };

  const handleSubmitOrder = async () => {
    if (!paymentSlip) {
      setError('Please upload your payment slip');
      return;
    }

    if (!shippingDetails?.phone) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('paymentSlip', paymentSlip);

      // Format order items
      const orderItems = cart.items.map(item => ({
        productId: parseInt(item.id),
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        name: item.name
      }));

      // Create order data object
      const orderData = {
        userId: parseInt(user.id),
        totalPrice: parseFloat(cart.total),
        items: orderItems,
        shippingDetails: {
          firstName: shippingDetails.firstName,
          lastName: shippingDetails.lastName,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          country: shippingDetails.country,
          postalCode: shippingDetails.zipCode
        }
      };

      // Debug log
      console.log('Submitting order data:', orderData);

      formData.append('orderData', JSON.stringify(orderData));

      const response = await orderService.createOrder(formData);
      
      if (response.orderId) {
        clearCart();
        setStep('confirmation');
        try {
          await orderService.generateReceipt(response.orderId);
        } catch (receiptError) {
          console.error('Failed to generate receipt:', receiptError);
          // Continue with confirmation even if receipt generation fails
        }
      } else {
        throw new Error('No order ID received from server');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.message || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* French-inspired header */}
      <div className="relative py-8 bg-white border-b border-gray-100">
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center" style={{ color: FRENCH_COLORS.dark }}>
            Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'details' || step === 'payment' || step === 'confirmation'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="mt-2 text-sm">Shipping Details</span>
            </div>
            <div className="flex-1 h-1 mx-4" style={{ backgroundColor: step === 'details' ? '#D1D5DB' : FRENCH_COLORS.blue }}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'payment' || step === 'confirmation'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
            <div className="flex-1 h-1 mx-4" style={{ backgroundColor: step === 'payment' || step === 'confirmation' ? FRENCH_COLORS.blue : '#D1D5DB' }}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'confirmation'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="mt-2 text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Order Summary Section */}
              <div className="p-6 border-b" style={{ borderColor: `${FRENCH_COLORS.blue}20` }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
                  Order Summary
                </h2>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center py-2 border-b border-gray-100">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                        {item.image ? (
                          <img 
                            src={formatImageUrl(item.image)} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                          <p>Quantity: {item.quantity}</p>
                          <p className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center" style={{ borderColor: `${FRENCH_COLORS.blue}10` }}>
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold" style={{ color: FRENCH_COLORS.red }}>
                    LKR {cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping Details Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
                  Shipping Details
                </h2>
                <ShippingForm user={user} onSubmit={handleShippingSubmit} />
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Bank Transfer Information */}
              <div className="p-6 border-b" style={{ borderColor: `${FRENCH_COLORS.blue}20` }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
                  Bank Transfer Information
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg" style={{ backgroundColor: `${FRENCH_COLORS.blue}10` }}>
                  <p className="font-medium mb-2">Please transfer the total amount to:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium">Bank of France</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium">Fuchisius Cosmetics Ltd.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium">8750-9234-1267-5511</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-medium">ORDER-{new Date().getTime().toString().slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">LKR {cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Slip Upload Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
                  Upload Payment Slip
                </h2>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Please upload a screenshot or photo of your bank transfer receipt.
                  </p>
                  
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6" 
                    style={{ borderColor: paymentSlipPreview ? FRENCH_COLORS.blue : 'rgb(209, 213, 219)' }}>
                    
                    {paymentSlipPreview ? (
                      <div className="w-full">
                        <div className="relative max-w-md mx-auto">
                          <img 
                            src={paymentSlipPreview} 
                            alt="Payment slip preview" 
                            className="mx-auto max-h-64 object-contain rounded-md shadow-md"
                          />
                          <button
                            onClick={() => {
                              setPaymentSlip(null);
                              setPaymentSlipPreview(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-center mt-2 text-sm text-gray-500">
                          {paymentSlip.name} ({(paymentSlip.size / 1024).toFixed(2)} KB)
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">
                          Drag and drop a file, or <span className="text-blue-600">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${paymentSlipPreview ? 'pointer-events-none' : ''}`}
                      style={{ pointerEvents: paymentSlipPreview ? 'none' : 'auto' }}
                    />
                  </div>
                  
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep('details')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading || !paymentSlip}
                    className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                      loading || !paymentSlip
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    style={{ 
                      backgroundColor: loading || !paymentSlip ? undefined : FRENCH_COLORS.red,
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : 'Complete Order'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden text-center p-8"
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mt-4 mb-2" style={{ color: FRENCH_COLORS.dark }}>
                Order Placed Successfully
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order! We'll process it as soon as we confirm your payment.
                {cart.items.length > 1 ? 
                  ` You've purchased ${cart.items.length} items for ${formatCurrency(cart.total)}.` : 
                  ''
                }
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate(ROUTES.ORDERS)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: FRENCH_COLORS.blue }}
                >
                  View My Orders
                </button>
                <button
                  onClick={() => navigate(ROUTES.PRODUCTS)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}; 