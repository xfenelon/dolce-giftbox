"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "dolce-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Carga el carrito guardado en el navegador al abrir el sitio
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error("No se pudo leer el carrito guardado", e);
    }
    setLoaded(true);
  }, []);

  // Guarda el carrito cada vez que cambia (después de la carga inicial)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("No se pudo guardar el carrito", e);
    }
  }, [items, loaded]);

  // Agrega un producto. Si ya existe con el mismo slug + listón, suma cantidad.
  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.slug === product.slug && i.ribbon === product.ribbon &&
          i.variant === product.variant && i.customName === product.customName
      );
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug && i.ribbon === product.ribbon &&
            i.variant === product.variant && i.customName === product.customName
            ? { ...i, qty: i.qty + product.qty }
            : i
        );
      }
      return [...prev, product];
    });

    // Muestra la notificación flotante ("toast") por 2.5 segundos
    setToast(product.name);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

const removeItem = (slug, ribbon, variant, customName) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.ribbon === ribbon && i.variant === variant && i.customName === customName)));
  };

  const updateQty = (slug, ribbon, qty, variant, customName) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.slug === slug && i.ribbon === ribbon && i.variant === variant && i.customName === customName ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalCount,
        totalPrice,
        cartOpen,
        setCartOpen,
        toast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}