"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Qué empaque real usa cada caja prediseñada (igual que antes, se queda en el código).
const PACKAGING_BY_SLUG = {
  baby: "caja-pequena-madera",
  dad: "caja-mediana-madera",
  indigo: "caja-mediana-madera",
  abuela: "caja-mediana-madera",
  rayas: "caja-mediana-madera",
  coral: "caja-mediana-madera",
  bunny: "corazon-madera-pequena",
  alicia: "caja-mediana-madera",
  moonlight: "caja-mediana-madera",
  noah: "caja-mediana-madera",
  dream: "corazon-madera-grande",
  sweet: "caja-mediana-madera",
  smile: "caja-mediana-madera",
  emma: "caja-mediana-madera",
  newborn: "caja-grande-madera",
  remmy: "cesta-croche",
  jerry: "caja-mediana-madera",
  teddy: "caja-mediana-madera",
  mel: "caja-mediana-madera",
  cebrita: "cesta-croche",
  emily: "caja-mediana-madera",
  gratitude: "caja-letrero-madera",
  esmeralda: "caja-mediana-madera",
  estrella: "estrella-madera",
  orquidea: "caja-redonda-rosada",
  pardo: "caja-mediana-madera",
  granate: "caja-mediana-madera",
  classic: "caja-grande-madera",
  vides: "caja-pequena-madera",
  serenidad: "estrella-madera",
  vintage: "caja-redonda-rosada",
  cielo: "bolsa-yute",
  bianca: "caja-mediana-madera",
  rust: "caja-mediana-madera",
  shade: "caja-grande-madera",
  blossom: "caja-letrero-madera",
  purity: "bolso-mimbre",
  delicate: "caja-mediana-madera",
  rose: "caja-redonda-rosada",
  creme: "cesta-croche",
  aurora: "canasta-metalica",
  mabe: "corazon-madera-pequena",
  legado: "caja-mediana-madera",
  roble: "canasta-metalica",
  escencia: "caja-mediana-madera",
  chocolat: "canasta-metalica",
  sunrise: "caja-grande-madera",
  luna: "canasta-metalica",
  calmness: "cesta-croche",
  hope: "caja-mediana-madera",
  bienestar: "caja-mediana-madera",
  fortaleza: "caja-mediana-madera",
};

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
        setError(productsRes.error);
        setLoading(false);
        return;
      }

      const packagingList = packagingRes.data || [];
      const getPackagingBySlug = (slug) => packagingList.find((pk) => pk.slug === slug) || null;

      const enriched = (productsRes.data || []).map((p) => ({
        ...p,
        priceLabel: p.price ? `$${p.price.toLocaleString("es-CO")}` : "Precio pendiente",
        installmentLabel: p.price
          ? `2 cuotas sin intereses de $${Math.round(p.price / 2).toLocaleString("es-CO")}`
          : "",
        packaging: getPackagingBySlug(PACKAGING_BY_SLUG[p.slug]),
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