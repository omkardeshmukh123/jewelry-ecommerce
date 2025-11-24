import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, selectedColor = null) => {
        setCartItems((prevItems) => {
            // Create unique identifier based on product ID and color
            const itemKey = selectedColor ? `${product._id}_${selectedColor}` : product._id;
            const existingItem = prevItems.find((item) => {
                const existingKey = item.selectedColor ? `${item._id}_${item.selectedColor}` : item._id;
                return existingKey === itemKey;
            });

            if (existingItem) {
                return prevItems.map((item) => {
                    const existingKey = item.selectedColor ? `${item._id}_${item.selectedColor}` : item._id;
                    return existingKey === itemKey
                        ? { ...item, quantity: item.quantity + quantity }
                        : item;
                });
            } else {
                return [...prevItems, { ...product, quantity, selectedColor }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item._id !== productId)
        );
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.finalPrice || item.price;
            return total + price * item.quantity;
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const isInCart = (productId) => {
        return cartItems.some((item) => item._id === productId);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
