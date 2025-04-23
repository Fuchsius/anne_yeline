import api from './api';
import { API } from '../constants/api';

export const orderService = {
  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Ensure all orders have required fields with default values
      return data.map(order => ({
        ...order,
        totalPrice: order.totalPrice || 0,
        items: (order.items || []).map(item => ({
          ...item,
          price: item.price || 0,
          quantity: item.quantity || 0,
          product: {
            ...item.product,
            name: item.product?.name || 'Unknown Product',
            productImages: item.product?.productImages || []
          }
        }))
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  createOrder: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Debug log
      console.log('Sending order data:', JSON.parse(formData.get('orderData')));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.error || 'Failed to create order');
      }
      
      return data;
    } catch (error) {
      console.error('Error in orderService.createOrder:', error);
      throw error;
    }
  },

  generateReceipt: async (orderId) => {
    try {
      const response = await api.get(API.ORDERS.RECEIPT(orderId), {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  },
}; 