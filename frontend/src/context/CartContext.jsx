import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('drisora_cart')) || [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('drisora_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        toast.success('Quantity updated');
        return prev.map(i =>
          i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + qty, product.stock) }
            : i
        );
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(i => i._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setItems(prev => prev.map(i =>
      i._id === productId ? { ...i, quantity: qty } : i
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems  = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal    = items.reduce((sum, i) => sum + (i.finalPrice ?? i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
