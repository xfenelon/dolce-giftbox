"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Qué empaque real usa cada caja prediseñada (igual que antes, se queda en el código).


// Los 5 productos con selector de variante (Osito/Conejita, etc).
const VARIANTS_BY_SLUG = {
  indigo: ["Osito", "Conejita"],
  coral: ["Osito", "Osita"],
  bunny: ["Conejito", "Osita"],
  newborn: ["Conejito", "Conejita"],
};

// El único producto con campo de nombre personalizado (Escencia -> termo).
const CUSTOM_NAME_LABEL_BY_SLUG = {
  escencia: "Nombre para el termo",
};

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    let active = true;

    async function loadData() {
      const [productsRes, packagingRes] = await Promise.all([
        supabase.from("productos").select("*").order("id"),
        supabase.from("empaques").select("*").order("id"),
      ]);

      if (!active) return;

            if (productsRes.error) {
        console.error("Error cargando productos:", productsRes.error);
        setError(productsRes.error);
        setLoading(false);
        return;
      }

      if (packagingRes.error) {
        console.error("Error cargando empaques:", packagingRes.error);
      }

        const packagingList = packagingRes.data || [];
      const getPackagingBySlug = (slug) => packagingList.find((pk) => pk.slug === slug) || null;

      const enriched = (productsRes.data || []).map((p) => ({
        ...p,
        priceLabel: p.price ? `$${p.price.toLocaleString("es-CO")}` : "Precio pendiente",
        installmentLabel: p.price
          ? `2 cuotas sin intereses de $${Math.round(p.price / 2).toLocaleString("es-CO")}`
          : "",
        packaging: getPackagingBySlug(p.packaging_slug),
        variants: VARIANTS_BY_SLUG[p.slug] || null,
        customNameLabel: CUSTOM_NAME_LABEL_BY_SLUG[p.slug] || null,
      }));

      setProducts(enriched);
      setLoading(false);
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const getProductBySlug = (slug) => products.find((p) => p.slug === slug);

  const getRelatedProducts = (slug, count = 4) => {
    const index = products.findIndex((p) => p.slug === slug);
    if (index === -1) return products.slice(0, count);
    const related = [];
    for (let i = 1; related.length < count && i < products.length; i++) {
      related.push(products[(index + i) % products.length]);
    }
    return related;
  };

  const getProductsByCategory = (category) => {
    if (!category || category === "Todos los productos") return products;
    return products.filter((p) => p.category === category);
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, getProductBySlug, getRelatedProducts, getProductsByCategory }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts debe usarse dentro de un <ProductsProvider>");
  }
  return ctx;
}