"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Search, ImageIcon } from "lucide-react";
import { searchCatalog } from "../data/search";

function ResultPhoto({ src, alt }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="search-result-photo placeholder">
        <ImageIcon size={18} strokeWidth={1.3} />
      </div>
    );
  }
  return (
    <div className="search-result-photo">
      <img src={src} alt={alt} onError={() => setError(true)} />
    </div>
  );
}

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const results = query.trim().length >= 2 ? searchCatalog(query) : [];

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>{`
        .search-overlay { position: fixed; inset: 0; background: rgba(74,58,44,0.35); z-index: 90; }
        .search-panel { position: fixed; top: 0; left: 0; right: 0; z-index: 91; background: #FFFFFF;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12); max-height: 82vh; display: flex; flex-direction: column; }
        .search-panel-header { display:flex; align-items:center; gap: 14px; padding: 20px 6vw; border-bottom: 1px solid #F4E2DF; }
        .search-panel-header input { flex:1; border:none; outline:none; font-family:'Marcellus', serif; font-size: 17px; color: #4A3A2C; background:none; }
        .search-panel-header input::placeholder { color: #BBA083; }
        .search-panel-header button { background:none; border:none; cursor:pointer; color: #927A5D; flex-shrink:0; }
        .search-results { overflow-y: auto; padding: 8px 6vw 24px; }
        .search-result-item { display:flex; align-items:center; gap: 14px; padding: 12px 0; border-bottom: 1px solid #F4E2DF; text-decoration:none; color:inherit; }
        .search-result-photo { width: 54px; height: 54px; border-radius: 10px; overflow:hidden; background: #F4EAE1; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .search-result-photo img { width:100%; height:100%; object-fit:cover; display:block; }
        .search-result-photo.placeholder { color: #BBA083; opacity: .7; }
        .search-result-info h4 { font-size: 14.5px; color: #4A3A2C; margin: 0 0 3px; font-weight: 400; font-family:'Marcellus', serif; }
        .search-result-type { font-size: 11.5px; color: #BBA083; margin: 0 0 3px; }
        .search-result-price { font-size: 13px; color: #927A5D; margin: 0; }
        .search-empty { text-align:center; padding: 40px 0; color: #BBA083; font-size: 14px; font-family:'Marcellus', serif; }
        .search-hint { text-align:center; padding: 40px 0; color: #BBA083; font-size: 13.5px; }
      `}</style>

      <div className="search-overlay" onClick={onClose} />
      <div className="search-panel">
        <div className="search-panel-header">
          <Search size={19} color="#927A5D" />
          <input
            autoFocus
            type="text"
            placeholder="Busca por nombre, ej. vela, café, ramo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </div>
        <div className="search-results">
          {query.trim().length < 2 && (
            <p className="search-hint">Escribe al menos 2 letras para buscar en todo el catálogo.</p>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="search-empty">No encontramos productos con "{query}". Intenta con otra palabra o escríbenos por WhatsApp.</p>
          )}
          {results.map((r) => (
            <Link key={r.key} href={r.href} className="search-result-item" onClick={onClose}>
              <ResultPhoto src={r.image} alt={r.name} />
              <div className="search-result-info">
                <h4>{r.name}</h4>
                <p className="search-result-type">{r.typeLabel}</p>
                <p className="search-result-price">{r.priceLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}