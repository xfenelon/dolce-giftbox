// Datos compartidos de los productos reales.
// Todas las categorías ya cargadas: "Bebé" (21), "Cumpleaños mujer" (4),
// "Cumpleaños hombre" (3), "Para mujer" (14), "Para hombre" (7),
// "Recuperación/Condolencias" (4), "Ramo de flores naturales" (3).

import { getPackagingById } from "./packaging";

// Qué empaque real (de app/data/packaging.js) usa cada caja prediseñada.
// Los ramos de flores no llevan empaque, por eso no aparecen aquí.
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
  // origen: pendiente, la clienta no ha confirmado el empaque
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
function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

const RAW_PRODUCTS = [
  // --- Categoría: Bebé ---
  {
    name: "Baby",
    slug: "baby",
    category: "Bebé",
    price: 139000,
    bullets: ["Vela aromática artesanal", "Osito amigurumi", "Par de medias"],
  },
  {
    name: "Dad",
    slug: "dad",
    category: "Bebé",
    price: 137600,
    bullets: ["Conejo amigurumi tejido a mano", "Par de medias", "Taza personalizada"],
  },
  {
    name: "Índigo",
    slug: "indigo",
    category: "Bebé",
    price: 151200,
    bullets: ["Portachupos tejido a mano de osito o conejita", "Mameluco", "Par de medias"],
  variants: ["Osito", "Conejita"],
  },
  {
    name: "Abuela/Abuelo",
    slug: "abuela",
    category: "Bebé",
    price: 154200,
    bullets: ["Cebrita amigurumi", "Taza personalizada", "Vela aromática artesanal"],
  },
  {
    name: "Rayas",
    slug: "rayas",
    category: "Bebé",
    price: 161100,
    bullets: ["Cebrita amigurumi tejida a mano", "Par de medias de bebé", "Vela aromática artesanal"],
  },
  {
    name: "Coral",
    slug: "coral",
    category: "Bebé",
    price: 170900,
    bullets: ["Osito/a amigurumi", "Vela aromática", "Par de medias", "Tisanas de té"],
 variants: ["Osito", "Osita"],
  },
  {
    name: "Bunny",
    slug: "bunny",
    category: "Bebé",
    price: 129000,
    bullets: ["Conejo / osita amigurumi", "Vela aromática", "Mordedor rascaencías"],
  variants: ["Conejito", "Osita"],
  },
  {
    name: "Alicia",
    slug: "alicia",
    category: "Bebé",
    price: 158400,
    bullets: ["Conejita amigurumi", "Placa aromática de espacios", "Par de medias", "Balaca"],
  },
  {
    name: "Moonlight",
    slug: "moonlight",
    category: "Bebé",
    price: 245300,
    bullets: ["Conejito amigurumi", "Babero", "Jabón", "Mantequilla corporal", "Bálsamo labial"],
  },
  {
    name: "Noah",
    slug: "noah",
    category: "Bebé",
    price: 222200,
    bullets: ["Conejito amigurumi", "Mameluco", "Babero doble faz", "Vela aromática"],
  },
  {
    name: "Dream",
    slug: "dream",
    category: "Bebé",
    price: 173300,
    bullets: ["Jirafa amigurumi", "Par de medias", "Mameluco", "Vela aromática artesanal"],
  },
  {
    name: "Sweet",
    slug: "sweet",
    category: "Bebé",
    price: 188700,
    bullets: ["Sonajero de ballenita", "Par de medias", "Mameluco", "Bouquet de flores secas"],
  },
  {
    name: "Smile",
    slug: "smile",
    category: "Bebé",
    price: 170900,
    bullets: ["Elefante amigurumi", "Tisanas de té", "Vela aromática", "Par de medias"],
  },
  {
    name: "Emma",
    slug: "emma",
    category: "Bebé",
    price: 160900,
    bullets: ["Conejita amigurumi tejida a mano", "Bouquet de flores secas con mini rosas", "Balaca para bebé"],
  },
  {
    name: "Newborn",
    slug: "newborn",
    category: "Bebé",
    price: 199900,
    bullets: ["Conejo/a amigurumi", "Peine", "Mameluco", "Par de medias", "Mordedor rascaencías"],
  variants: ["Conejito", "Conejita"],
  },
  {
    name: "Remmy",
    slug: "remmy",
    category: "Bebé",
    price: 209100,
    bullets: ["Perrito amigurumi", "Babero doble faz", "Toallitas babitas", "Vela aromática"],
  },
  {
    name: "Jerry",
    slug: "jerry",
    category: "Bebé",
    price: 178200,
    bullets: ["Ratoncito de trapo", "Toallitas babitas", "Jabón artesanal facial y corporal"],
  },
  {
    name: "Teddy",
    slug: "teddy",
    category: "Bebé",
    price: 175700,
    bullets: ["Mameluco unisex", "Vela vidrio aromática", "Sonajero de ballenita tejida a mano"],
  },
  {
    name: "Mel",
    slug: "mel",
    category: "Bebé",
    price: 211000,
    bullets: ["Jirafa amigurumi", "Par de medias", "Miel de abejas", "Taza de cerámica", "Té"],
  },
  {
    name: "Cebrita",
    slug: "cebrita",
    category: "Bebé",
    price: 203500,
    bullets: ["Cebrita amigurumi", "Té en hojas sueltas", "Vela vidrio aromática", "Par de medias"],
  },
  {
    name: "Emily",
    slug: "emily",
    category: "Bebé",
    price: 190300,
    bullets: ["Conejita amigurumi tejida a mano", "Suculenta", "Jabón artesanal facial y corporal", "Té en hojas sueltas"],
  },

  // --- Categoría: Cumpleaños mujer ---
  {
    name: "Gratitude",
    slug: "gratitude",
    category: "Cumpleaños mujer",
    price: 183700,
    bullets: ["Kit de cumpleaños", "Chocolatina", "Espuma facial", "Pomos de tela", "Suculenta"],
  },
  {
    name: "Esmeralda",
    slug: "esmeralda",
    category: "Cumpleaños mujer",
    price: 135100,
    bullets: ["Barra de chocolate", "Kit de cumpleaños", "Collar en acero con perla nácar"],
  },
  {
    name: "Estrella",
    slug: "estrella",
    category: "Cumpleaños mujer",
    price: 116100,
    bullets: ["Kit de cumpleaños", "Vela aromática", "Suculenta", "Tisanas de té x3 paquetes"],
  },
  {
    name: "Orquídea",
    slug: "orquidea",
    category: "Cumpleaños mujer",
    price: 173200,
    bullets: ["Kit de cumpleaños", "Mantequilla corporal", "Jabón facial de arcilla", "Vela aromática"],
  },

  // --- Categoría: Cumpleaños hombre ---
  {
    name: "Pardo",
    slug: "pardo",
    category: "Cumpleaños hombre",
    price: 132200,
    bullets: ["Termo digital", "Kit de cumpleaños", "Libreta + lapicero"],
  },
  {
    name: "Granate",
    slug: "granate",
    category: "Cumpleaños hombre",
    price: 162800,
    bullets: ["Kit de cumpleaños", "Mix de maní", "Galletas holandesas", "Piba JP Chenet"],
  },
  {
    name: "Classic",
    slug: "classic",
    category: "Cumpleaños hombre",
    price: 161400,
    bullets: ["Cerveza extranjera", "Vaso cervecero", "Destapador en acero inoxidable", "Mix de maní", "Llavero de cuerina"],
  },

  // --- Categoría: Para mujer ---
  {
    name: "Vides",
    slug: "vides",
    category: "Para mujer",
    price: 124300,
    bullets: ["Jabón artesanal", "Mascarilla facial de arcilla en polvo", "Bálsamo hidratante"],
  },
  {
    name: "Serenidad",
    slug: "serenidad",
    category: "Para mujer",
    price: 134800,
    bullets: ["Taza de cerámica", "Scrunchie", "Vela aromática", "Té en hojas sueltas"],
  },
  {
    name: "Vintage",
    slug: "vintage",
    category: "Para mujer",
    price: 168200,
    bullets: ["Tisanas de té", "Contorno de ojos", "Scrunchie", "Vela aromática", "Sal de baño"],
  },
  {
    name: "Cielo",
    slug: "cielo",
    category: "Para mujer",
    price: 173200,
    bullets: ["Bouquet de flores secas", "Chocolatina", "Fragancia aromatizante", "Collar en acero"],
  },
  {
    name: "Bianca",
    slug: "bianca",
    category: "Para mujer",
    price: 198300,
    bullets: ["Piba JP Chenet", "Sal de baño", "Té en hojas sueltas", "Mascarilla facial de arcilla", "Vela aromática artesanal"],
  },
  {
    name: "Rust",
    slug: "rust",
    category: "Para mujer",
    price: 159900,
    bullets: ["Taza de cerámica", "Barra de chocolate", "Vela vidrio aromática artesanal"],
  },
  {
    name: "Shade",
    slug: "shade",
    category: "Para mujer",
    price: 164600,
    bullets: ["Termo", "Placa aromática", "Jabón facial", "Pomos reutilizables", "Scrunchie"],
  },
  {
    name: "Blossom",
    slug: "blossom",
    category: "Para mujer",
    price: 184000,
    bullets: ["Jabón artesanal", "x3 sobres de café", "Taza de cerámica", "Vela aromática"],
  },
  {
    name: "Purity",
    slug: "purity",
    category: "Para mujer",
    price: 176700,
    bullets: ["Bouquet de flores", "Vela aromática", "Sal de baño relajante", "Bálsamo labial"],
  },
  {
    name: "Delicate",
    slug: "delicate",
    category: "Para mujer",
    price: 201300,
    bullets: ["JP Chenet", "Vela aromática", "Sal de baño", "Mascarilla de arcilla", "Galletas"],
  },
  {
    name: "Rosé",
    slug: "rose",
    category: "Para mujer",
    price: 182900,
    bullets: ["Jabón artesanal", "Serum vitamina C", "Sal de baño", "Exfoliante de café"],
  },
  {
    name: "Cremè",
    slug: "creme",
    category: "Para mujer",
    price: 215500,
    bullets: ["Vela aromática artesanal", "Sal de baño relajante", "Jabón artesanal", "Tisanas de té", "Bálsamo labial"],
  },
  {
    name: "Aurora",
    slug: "aurora",
    category: "Para mujer",
    price: 226800,
    bullets: ["Termo", "x3 sobres de café", "Vela aromática", "Placa aromática", "Jabón artesanal", "Granola natural"],
  },
  {
    name: "Mabe",
    slug: "mabe",
    category: "Para mujer",
    price: 104800,
    bullets: ["Tisanas de té x3 paquetes", "Mascarilla de arcilla", "Vela aromática", "Scrunchie"],
  },

  // --- Categoría: Para hombre ---
  {
    name: "Legado",
    slug: "legado",
    category: "Para hombre",
    price: 124000,
    bullets: ["Cerveza extranjera", "Llavero en cuerina", "Libreta + lapicero"],
  },
  {
    name: "Origen",
    slug: "origen",
    category: "Para hombre",
    price: 162200,
    bullets: ["Termo digital", "Café molido", "Té en hojas sueltas", "Libreta + lapicero", "Prensa"],
  },
  {
    name: "Roble",
    slug: "roble",
    category: "Para hombre",
    price: 190500,
    bullets: ["Cerveza", "Vaso cervecero", "Destapador", "Granola", "Galleta", "Mix de maní"],
  },
  {
    name: "Escencia",
    slug: "escencia",
    category: "Para hombre",
    price: 120800,
    bullets: ["Termo digital", "Libreta + lapicero", "Mix de maní"],
  customNameLabel: "Nombre para el termo",
  },
  {
    name: "Chocolat",
    slug: "chocolat",
    category: "Para hombre",
    price: 160600,
    bullets: ["Taza de cerámica", "Prensa francesa", "Café premium", "Granola natural"],
  },
  {
    name: "Sunrise",
    slug: "sunrise",
    category: "Para hombre",
    price: 156700,
    bullets: ["Cerveza extranjera", "Vaso cervecero", "Llavero en cuerina", "Barra de chocolate"],
  },
  {
    name: "Luna",
    slug: "luna",
    category: "Para hombre",
    price: 248400,
    bullets: ["Piba de JP Chenet 750ml", "Galletas holandesas", "Barra de chocolate", "Mix de maní", "Llavero en cuerina"],
  },

  // --- Categoría: Recuperación/Condolencias ---
  {
    name: "Calmness",
    slug: "calmness",
    category: "Recuperación/Condolencias",
    price: 197000,
    bullets: ["Té en hojas sueltas", "Taza de cerámica", "Granola natural", "Suculenta"],
  },
  {
    name: "Hope",
    slug: "hope",
    category: "Recuperación/Condolencias",
    price: 158500,
    bullets: ["Jabón artesanal", "Fragancia aromatizante", "Sal de baño relajante", "Tisana de té"],
  },
  {
    name: "Bienestar",
    slug: "bienestar",
    category: "Recuperación/Condolencias",
    price: 166100,
    bullets: ["Bouquet de flores", "Tisanas de té", "Fragancia aromatizante", "Jabón artesanal"],
  },
  {
    name: "Fortaleza",
    slug: "fortaleza",
    category: "Recuperación/Condolencias",
    price: 148200,
    bullets: ["Granola natural", "Tisana de té x3 paquetes", "Taza de cerámica"],
  },

  // --- Categoría: Ramo de flores naturales ---
  {
    name: "Primavera",
    slug: "primavera",
    category: "Ramo de flores naturales",
    price: 95400,
    bullets: ["Ramo de 17 rosas de exportación y eucalipto", "Decorado con papel delicado", "Lazo de tela y tarjeta con cuidados"],
  },
  
    {
    name: "Florecer",
    slug: "florecer",
    category: "Ramo de flores naturales",
    price: 142900,
    bullets: ["Ramo compuesto por hortensias, rosas de exportación y eucalipto", "Decorado con papel delicado", "Lazo de tela y tarjeta con cuidados"],
  },

  // --- Categoría: Peluches de apego ---
  {
    name: "Oliver",
    slug: "oliver",
    category: "Peluches de apego",
    price: 112000,
    bullets: ["Peluche tejido a mano en crochet", "Tamaño: 31 cm", "Ideal para bebés y niños pequeños"],
  },
  {
    name: "Lottie",
    slug: "lottie",
    category: "Peluches de apego",
    price: 112000,
    bullets: ["Peluche tejido a mano en crochet", "Tamaño: 48 cm", "Ideal para bebés y niños pequeños"],
  },
  {
    name: "Sophie",
    slug: "sophie",
    category: "Peluches de apego",
    price: 54000,
    bullets: ["Peluche tejido a mano en crochet", "Tamaño: 25 cm", "Ideal para bebés y niños pequeños"],
  },
  {
    name: "Theo",
    slug: "thea",
    category: "Peluches de apego",
    price: 94000,
    bullets: ["Peluche tejido a mano en crochet", "Tamaño: 34 cm", "Ideal para bebés y niños pequeños"],
  },
  {
    name: "Millie",
    slug: "millie",
    category: "Peluches de apego",
    price: 94000,
    bullets: ["Peluche tejido a mano en crochet", "Tamaño: 34 cm", "Ideal para bebés y niños pequeños"],
  },
];

export const PRODUCTS = RAW_PRODUCTS.map((p) => {
  const slug = p.slug || slugify(p.name);
  return {
    ...p,
    slug,
    bullets: p.bullets || ["Descripción pendiente — se completará con el detalle real de este producto."],
    price: p.price || null,
    priceLabel: p.price ? `$${p.price.toLocaleString("es-CO")}` : "Precio pendiente",
    installmentLabel: p.price
      ? `2 cuotas sin intereses de $${Math.round(p.price / 2).toLocaleString("es-CO")}`
      : "",
    packaging: getPackagingById(PACKAGING_BY_SLUG[slug]) || null,
  };
});

// Lista completa de categorías del sitio.
export const CATEGORIES = [
  "Bebé",
  "Cumpleaños mujer",
  "Cumpleaños hombre",
  "Para mujer",
  "Para hombre",
  "Recuperación/Condolencias",
  "Ramo de flores naturales",
  "Peluches de apego",
];

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug, count = 4) {
  const index = PRODUCTS.findIndex((p) => p.slug === slug);
  if (index === -1) return PRODUCTS.slice(0, count);

  const related = [];
  for (let i = 1; related.length < count && i < PRODUCTS.length; i++) {
    const next = PRODUCTS[(index + i) % PRODUCTS.length];
    related.push(next);
  }
  return related;
}

export function getProductsByCategory(category) {
  if (!category || category === "Todos los productos") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}