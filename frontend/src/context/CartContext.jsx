import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (productId) => {
    try {
      console.log('Adding to cart:', productId);
      
      if (!productId) {
        return { 
          success: false, 
          error: 'Product ID is required',
          type: 'warning'
        };
      }

      const response = await api.post('/cart/add', { productId });
      console.log('Add to cart response:', response.data);
      
      // Refresh cart after successful addition
      await fetchCart();
      
      return { 
        success: true, 
        message: response.data.message || 'Item added to cart successfully',
        type: 'success'
      };
    } catch (error) {
      console.error('Add to cart error:', error.response || error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unable to add item to cart';
      
      return { 
        success: false, 
        error: errorMessage,
        type: 'danger'
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      console.log('Removing from cart:', productId);
      
      if (!productId) {
        return { 
          success: false, 
          error: 'Product ID is required',
          type: 'warning'
        };
      }

      const response = await api.delete(`/cart/remove/${productId}`);
      console.log('Remove from cart response:', response.data);
      
      // Refresh cart after successful removal
      await fetchCart();
      
      return { 
        success: true, 
        message: response.data.message || 'Item removed from cart successfully',
        type: 'success'
      };
    } catch (error) {
      console.error('Remove from cart error:', error.response || error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unable to remove item from cart';
      
      return { 
        success: false, 
        error: errorMessage,
        type: 'danger'
      };
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      console.log('Fetch cart response:', response.data);
      
      // Handle both old format and new format with success flag
      const cartData = response.data.items || response.data;
      setCart(Array.isArray(cartData) ? cartData : []);
      
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
      
      // Don't show error toast for 401 (user not logged in)
      if (error.response?.status !== 401) {
        console.error('Failed to fetch cart:', error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price, 0);
  };

  const getCartCount = () => {
    return cart.length;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    fetchCart,
    getTotalPrice,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
