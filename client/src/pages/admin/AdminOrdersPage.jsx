import { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { formatCurrency } from '../../utils/formatters';
import { formatImageUrl } from '../../utils/imageUtils';

// Add this constant at the top of your file
const BACKEND_URL = 'http://localhost:3000'; // or whatever port your backend is running on

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Status options for the filter and update
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.message || 'An error occurred while fetching orders.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Update the fetchOrderDetails function to log detailed error information
  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log(`Fetching details for order ID: ${orderId}`);
      
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch order details');
      }

      const orderDetails = await response.json();
      console.log('Retrieved order details:', orderDetails);
      return orderDetails;
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      throw err;
    }
  };

  // Add console logs to handleViewDetails for easier debugging
  const handleViewDetails = async (orderId) => {
    try {
      console.log(`Opening details for order: ${orderId}`);
      setLoading(true);
      
      // First get the detailed order data from the API
      const orderDetails = await fetchOrderDetails(orderId);
      
      // Debug logs
      console.log('Order details structure:', orderDetails);
      console.log('Payment slip URL:', orderDetails.paymentSlipUrl);
      console.log('Payment details:', orderDetails.paymentDetails);
      
      setSelectedOrder(orderDetails);
      setShowDetailsModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Error in handleViewDetails:', error);
      setError(error.message || 'Failed to load order details');
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state after successful API call
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      // Optionally show error message to user
    }
  };

  // Get status badge component based on status value
  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusOption.color}`}>
        {statusOption.label}
      </span>
    );
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // First, update the formatCurrency function call to use LKR
  const formatCurrencyLKR = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  // Update the getAbsoluteUrl function
  const getAbsoluteUrl = (relativePath) => {
    if (!relativePath) return null;
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    // Use the backend URL instead of window.location.origin
    return `${BACKEND_URL}${relativePath}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* French-inspired header with tricolor accent */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-1.5 rounded-full bg-blue-600 mr-3"></div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="h-1 w-16 flex rounded-full overflow-hidden">
                      <div className="w-1/3 bg-blue-600"></div>
                      <div className="w-1/3 bg-white"></div>
                      <div className="w-1/3 bg-red-600"></div>
                    </div>
                    <p className="ml-3 text-gray-500">
                      Track and manage customer orders
                    </p>
                  </div>
                </div>
                
                {/* Status filter */}
                <div className="mt-4 md:mt-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Orders</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Orders Table */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8">
                <div className="flex justify-center">
                  <div className="relative h-16 w-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-transparent animate-spin" 
                      style={{ borderColor: '#2563EB transparent #EF4444 transparent' }}>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              </div>
            ) : currentOrders.length > 0 ? (
              <>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-white">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {currentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-14 w-14 relative bg-gray-100 rounded-lg">
                                  {order.items?.[0]?.image ? (
                                    <img 
                                      className="h-14 w-14 rounded-lg object-cover border border-gray-200 shadow-sm" 
                                      src={formatImageUrl(order.items[0].image)}
                                      alt={order.items[0].name}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.parentElement.innerHTML = `
                                          <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                        `;
                                      }}
                                    />
                                  ) : (
                                    <div className="h-14 w-14 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-gray-900 mb-1">{order.orderNumber}</div>
                                  <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                    {order.items?.length || 0} items
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                              <div className="text-xs text-gray-500">{order.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(order.date)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatCurrencyLKR(order.total)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleViewDetails(order.id)}
                                  className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                  className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Confirm
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                  className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 bg-white rounded-lg shadow-sm px-4 py-3">
                    <div className="flex-1 flex justify-between items-center">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <div className="hidden md:flex">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium mx-1 rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <div className="md:hidden text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <div className="max-w-md mx-auto">
                  <div className="h-20 w-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No Orders Found</h3>
                  <p className="text-gray-500 mb-6">
                    {statusFilter !== 'all' 
                      ? `There are no orders with status "${statusOptions.find(o => o.value === statusFilter)?.label}"`
                      : 'No orders have been placed yet.'}
                  </p>
                  {statusFilter !== 'all' && (
                    <button 
                      onClick={() => setStatusFilter('all')}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>View All Orders</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #{selectedOrder.orderNumber}
                    </h3>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Order Status</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <div className="absolute top-5 left-5 h-[calc(100%-40px)] w-0.5 bg-gray-200"></div>
                  {selectedOrder.statusHistory?.map((status, index) => (
                    <div key={index} className="relative flex items-center mb-4 last:mb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === selectedOrder.status 
                          ? 'bg-blue-500 shadow-lg shadow-blue-200' 
                          : 'bg-gray-200'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-gray-900">{status}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedOrder.statusDates[index]).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer and Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h4>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      {selectedOrder.user?.profilePic ? (
                        <img 
                          src={selectedOrder.user.profilePic}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.user?.phone || 'No phone number'}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h4>
                  {selectedOrder.shippingAddress ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.street}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                      </p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.postalCode}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No shipping address provided</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="divide-y divide-gray-200">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <img 
                              src={formatImageUrl(item.product.images[0])}
                              alt={item.product?.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold text-gray-900">{item.product?.name}</h5>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrencyLKR(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details and Slip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.paymentDetails?.method}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedOrder.paymentDetails?.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedOrder.paymentDetails?.status}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrencyLKR(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{formatCurrencyLKR(selectedOrder.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold mt-4 pt-4 border-t border-gray-200">
                        <span>Total</span>
                        <span>{formatCurrencyLKR(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Slip */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Slip</h4>
                  {selectedOrder.paymentDetails?.paymentSlip?.url ? (
                    <div className="relative group">
                      <img 
                        src={formatImageUrl(selectedOrder.paymentDetails.paymentSlip.url)}
                        alt="Payment Slip"
                        className="w-full h-[400px] rounded-lg shadow-sm cursor-pointer object-contain bg-gray-50"
                        onError={(e) => {
                          console.error('Failed to load image:', e.target.src);
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-[400px] rounded-lg bg-red-50 flex items-center justify-center">
                              <div class="text-center p-4">
                                <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                <p class="mt-2 text-sm text-red-500">Failed to load payment slip</p>
                              </div>
                            </div>
                          `;
                        }}
                        onClick={() => {
                          const imageUrl = formatImageUrl(selectedOrder.paymentDetails.paymentSlip.url);
                          console.log('Opening payment slip:', imageUrl); // Debug log
                          
                          // Create modal for larger preview
                          const modal = document.createElement('div');
                          modal.innerHTML = `
                            <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
                              <div class="relative max-w-4xl w-full">
                                <img 
                                  src="${imageUrl}" 
                                  alt="Payment Slip"
                                  class="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                                  onerror="this.onerror=null; this.parentElement.innerHTML = '<div class=\'w-full h-[50vh] rounded-lg bg-red-50 flex items-center justify-center\'><div class=\'text-center\'><p class=\'text-red-500\'>Failed to load payment slip</p></div></div>';"
                                />
                                <button class="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          `;
                          document.body.appendChild(modal.firstChild);
                          
                          // Add click handler to close
                          const closeBtn = modal.firstChild.querySelector('button');
                          const handleClose = () => {
                            document.body.removeChild(modal.firstChild);
                          };
                          closeBtn.addEventListener('click', handleClose);
                          modal.firstChild.addEventListener('click', (e) => {
                            if (e.target === modal.firstChild) handleClose();
                          });
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                        <button
                          className="opacity-0 group-hover:opacity-100 bg-white/90 p-3 rounded-full shadow-lg transition-all transform translate-y-2 group-hover:translate-y-0"
                        >
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">No payment slip uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 