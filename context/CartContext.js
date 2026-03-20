"use client"

import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (item) => setCart(prev => [...prev, item])
  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id))
  const toggleCart = () => setCartOpen(prev => !prev)

  return (
    <CartContext.Provider value={{ cart, cartOpen, addToCart, removeFromCart, toggleCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

export default CartContext
