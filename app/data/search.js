// Búsqueda combinada sobre todo el catálogo:
// productos prediseñados (products.js) + productos individuales de Arma tu detalle (armaItems.js).

import { PRODUCTS } from "./products";
import { ARMA_ITEMS } from "./armaItems";

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchCatalog(query) {
  const q = normalize(query.trim());
  if (!q) return [];

  const fromProducts = PRODUCTS.filter((p) => normalize(p.name).includes(q)).map((p) => ({
    key: `prediseñado-${p.slug}`,
    typeLabel: "Detalle prediseñado",
    name: p.name,
    priceLabel: p.priceLabel,
    image: `/productos/${p.slug}-1.jpg`,
    href: `/productos/${p.slug}`,
  }));

  const fromArma = ARMA_ITEMS.filter((p) => normalize(p.name).includes(q)).map((p) => ({
    key: `arma-${p.slug}`,
    typeLabel: "Arma tu detalle",
    name: p.name,
    priceLabel: p.priceLabel,
    image: `/arma-productos/${p.folder}/${p.slug}.jpg`,
    href: `/arma-tu-detalle?categoria=${encodeURIComponent(p.category)}`,
  }));

  return [...fromProducts, ...fromArma].slice(0, 20);
}