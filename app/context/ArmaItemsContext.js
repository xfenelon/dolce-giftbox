"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ArmaItemsContext = createContext(null);

export function ArmaItemsProvider({ children }) {
  const [armaItems, setArmaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadArmaItems() {
      const { data, error: fetchError } = await supabase
        .from("arma_items")
        .select("*")
        .order("id");

      if (!active) return;

      if (fetchError) {
        setError(fetchError);
        setLoading(false);
        return;
      }

      const enriched = (data || []).map((item) => ({
        ...item,
        priceLabel: `$${item.price.toLocaleString("es-CO")}`,
      }));

      setArmaItems(enriched);
      setLoading(false);
    }

    loadArmaItems();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ArmaItemsContext.Provider value={{ armaItems, loading, error }}>
      {children}
    </ArmaItemsContext.Provider>
  );
}

export function useArmaItems() {
  const ctx = useContext(ArmaItemsContext);
  if (!ctx) {
    throw new Error("useArmaItems debe usarse dentro de un <ArmaItemsProvider>");
  }
  return ctx;
}