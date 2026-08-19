// Búsqueda combinada sobre todo el catálogo:
// productos prediseñados + productos individuales de Arma tu detalle,
// ambos traídos en vivo desde Supabase (ver ProductsContext y ArmaItemsContext).

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchCatalog(query, products = [], armaItems = []) {
  const q = normalize(query.trim());
  if (!q) return [];

  const fromProducts = products.filter((p) => normalize(p.name).includes(q)).map((p) => ({
    key: `prediseñado-${p.slug}`,
    typeLabel: "Detalle prediseñado",
    name: p.name,
    priceLabel: p.priceLabel,
    image: `/productos/${p.slug}-1.jpg`,
    href: `/productos/${p.slug}`,
  }));

  const fromArma = armaItems.filter((p) => normalize(p.name).includes(q)).map((p) => ({
    key: `arma-${p.slug}`,
    typeLabel: "Arma tu detalle",
    name: p.name,
    priceLabel: p.priceLabel,
    image: `/arma-productos/${p.folder}/${p.slug}.jpg`,
        href: `/arma-tu-detalle?categoria=${encodeURIComponent(p.category)}&producto=${p.slug}`,
  }));

  return [...fromProducts, ...fromArma].slice(0, 20);
}