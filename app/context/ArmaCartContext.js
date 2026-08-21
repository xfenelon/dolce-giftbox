"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const ArmaCartContext = createContext(null);
const STORAGE_KEY = "dolce-arma-cart";

export function ArmaCartProvider({ children }) {
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

  // Agrega un artículo o empaque. Si ya existe con el mismo slug, suma cantidad.
  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: i.qty + product.qty } : i
        );
      }
      return [...prev, product];
    });

    // Muestra la notificación flotante ("toast") por 2.5 segundos
    setToast(product.name);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const removeItem = (slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const updateQty = (slug, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const [cartOpen, setCartOpen] = useState(false);

  return (
    <ArmaCartContext.Provider
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
    </ArmaCartContext.Provider>
  );
}

export function useArmaCart() {
  const ctx = useContext(ArmaCartContext);
  if (!ctx) throw new Error("useArmaCart debe usarse dentro de <ArmaCartProvider>");
  return ctx;
}