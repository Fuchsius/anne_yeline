import api from './api';
import { API } from '../constants/api';

export const userService = {
  getUserAddresses: async () => {
    const response = await api.get(API.USER.ADDRESSES);
    return response.data;
  },
  
  addUserAddress: async (addressData) => {
    const response = await api.post(API.USER.ADDRESSES, addressData);
    return response.data;
  }
}; 