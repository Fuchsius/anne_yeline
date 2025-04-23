import { createContext, useContext, useReducer, useEffect } from 'react';

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  items: [],
  isOpen: false,
  total: 0
};

// Actions
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const TOGGLE_CART = 'TOGGLE_CART';

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        // New item, add to cart
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems)
        };
      }
    }
    
    case REMOVE_FROM_CART: {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems)
      };
    }
    
    case UPDATE_QUANTITY: {
      const updatedItems = state.items.map(item => 
        item.id === action.payload.id 
          ? { ...item, quantity: action.payload.quantity } 
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0
      };
    
    case TOGGLE_CART:
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen
      };
    
    default:
      return state;
  }
};

// Helper function to calculate total
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Provider component
export const CartProvider = ({ children }) => {
  // Load cart state from localStorage
  const getInitialState = () => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  };
  
  const [state, dispatch] = useReducer(cartReducer, getInitialState());
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  // Actions
  const addToCart = (product, quantity = 1) => {
    dispatch({ 
      type: ADD_TO_CART, 
      payload: { 
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.productImages && product.productImages.length > 0 
          ? product.productImages[0].imageUrl 
          : null,
        quantity
      } 
    });
    // Open cart when adding items
    dispatch({ type: TOGGLE_CART, payload: true });
  };
  
  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: UPDATE_QUANTITY, 
      payload: { id: productId, quantity } 
    });
  };
  
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };
  
  const toggleCart = (isOpen) => {
    dispatch({ type: TOGGLE_CART, payload: isOpen });
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        cart: state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 