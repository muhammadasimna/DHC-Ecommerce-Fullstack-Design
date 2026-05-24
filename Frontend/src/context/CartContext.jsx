import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, user, backendUrl } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setSavedItems([]);
      return;
    }
    setLoading(true);
    try {
      // Fetch active cart items
      const cartRes = await fetch(`${backendUrl}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }

      // Fetch saved for later items
      const savedRes = await fetch(`${backendUrl}/cart/saved`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedItems(savedData);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, backendUrl]);

  const addToCart = async (productId, quantity = 1, size = 'medium', color = 'blue') => {
    if (!token) {
      throw new Error('Please log in to add items to cart.');
    }
    try {
      const res = await fetch(`${backendUrl}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity, size, color })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to add item to cart');
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (!token) return;
    try {
      const res = await fetch(`${backendUrl}/cart/update-qty`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cartItemId, quantity })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update quantity');
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!token) return;
    try {
      const res = await fetch(`${backendUrl}/cart/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to remove item');
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const saveForLater = async (cartItemId) => {
    if (!token) return;
    try {
      const res = await fetch(`${backendUrl}/cart/save-for-later/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save item');
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const moveToCart = async (cartItemId) => {
    if (!token) return;
    try {
      const res = await fetch(`${backendUrl}/cart/move-to-cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to move item to cart');
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${backendUrl}/cart/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to clear cart');
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const saveProductDirectly = async (productId, size = 'medium', color = 'blue') => {
    if (!token) {
      throw new Error('Please log in to save items.');
    }
    try {
      const res = await fetch(`${backendUrl}/cart/save-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, size, color })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save product');
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      savedItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      saveProductDirectly,
      clearCart,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
