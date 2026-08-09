// Catálogo de productos individuales para "Arma tu detalle".
// Las fotos van en: public/arma-productos/{carpeta-categoria}/{slug}.jpg
// "available: false" = agotado (se muestra pero no se puede agregar).

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

// Carpeta dentro de /public/arma-productos/ para cada categoría.
export const CATEGORY_FOLDERS = {
  "Cuidado personal": "cuidado-personal",
  "Hogar y ambiente": "hogar-ambiente",
  "Productos comestibles": "comestibles",
  "Para hombre": "hombre",
  "Para bebé": "bebe",
};

const RAW_ITEMS = [
  // --- Categoría: Cuidado personal (16) ---
  { name: "Jabón Abintus", slug: "jabon-abintus", category: "Cuidado personal", price: 21200, available: false, description: "Jabón artesanal facial y corporal de arcilla natural blanca o verde, 65gr." },
  { name: "Espuma de Rosas", slug: "espuma-rosas", category: "Cuidado personal", price: 34800, available: true, description: "Espuma facial limpiadora de rosas con ácido hialurónico, 250ml." },
  { name: "Jabón Herbario", slug: "jabon-herbario", category: "Cuidado personal", price: 33500, available: true, description: "Jabón artesanal facial y corporal, avena y canela o cacao, 120gr." },
  { name: "Antifaz en Satín", slug: "antifaz-satin", category: "Cuidado personal", price: 23200, available: true, description: "Antifaz en satín para dormir, en tono palo rosa." },
  { name: "Serum Ácido Hialurónico", slug: "serum-hialuronico", category: "Cuidado personal", price: 34800, available: false, description: "Serum facial de ácido hialurónico puro, concentrado al 1%, 30ml." },
  { name: "Serum Vitamina C", slug: "serum-vitamina-c", category: "Cuidado personal", price: 32200, available: false, description: "Serum facial de vitamina C, junto vitamina E y aloe vera, 10ml." },
  { name: "Bálsamo Labial", slug: "balsamo-labial", category: "Cuidado personal", price: 34900, available: true, description: "Bálsamo hidratante labial de hierbabuena, 7gr." },
  { name: "Scrunchie para el Cabello", slug: "scrunchie-cabello", category: "Cuidado personal", price: 16700, available: true, description: "Scrunchie elaborado de algodón licrado, tejido a mano." },
  { name: "Contorno de Ojos", slug: "contorno-ojos", category: "Cuidado personal", price: 17900, available: false, description: "Contorno de ojos roll-on con cafeína, vitamina E y elastina, 15ml." },
  { name: "Exfoliante de Café", slug: "exfoliante-cafe", category: "Cuidado personal", price: 31100, available: true, description: "Exfoliante corporal a base de café orgánico, 200gr." },
  { name: "Mascarilla de Arcilla", slug: "mascarilla-arcilla", category: "Cuidado personal", price: 26200, available: true, description: "Mascarilla de arcilla en polvo natural, 30gr." },
  { name: "Tónico de Rosas", slug: "tonico-rosas", category: "Cuidado personal", price: 27900, available: false, description: "Tónico facial de rosas con ácido hialurónico." },
  { name: "Pomos de Tela", slug: "pomos-tela", category: "Cuidado personal", price: 25200, available: true, description: "Pomos de tela hipoalergénica, x3 unidades." },
  { name: "Sal de Baño", slug: "sal-bano", category: "Cuidado personal", price: 29900, available: true, description: "Sal de baño relajante de lavanda, naranja y eucalipto, 100gr." },
  { name: "Mantequilla Corporal", slug: "mantequilla-corporal", category: "Cuidado personal", price: 32200, available: true, description: "Mantequilla corporal con destellos y aroma dulce, 200gr." },
  { name: "Leche Desmaquillante", slug: "leche-desmaquillante", category: "Cuidado personal", price: 26900, available: true, description: "Desmaquillante con vitamina E y colágeno, 130ml." },

  // --- Categoría: Hogar y ambiente (17) ---
  { name: "Fragancia Aromatizante", slug: "fragancia-aromatizante", category: "Hogar y ambiente", price: 33500, available: true, description: "Fragancia aromatizante de flores de algodón o café y coco, 120ml." },
  { name: "Suculenta", slug: "suculenta", category: "Hogar y ambiente", price: 24100, available: true, description: "Suculenta natural en base blanca." },
  { name: "Taza de Cerámica", slug: "taza-ceramica", category: "Hogar y ambiente", price: 43200, available: true, description: "Taza de cerámica artesanal del Carmen de Viboral." },
  { name: "Joyero Personalizado", slug: "joyero-personalizado", category: "Hogar y ambiente", price: 28400, available: true, description: "Joyero con espejo, personalizado con nombre." },
  { name: "Collar Alicia", slug: "collar-alicia", category: "Hogar y ambiente", price: 32200, available: false, description: "Collar hecho a mano de acero con perla nácar." },
  { name: "Termo de Vidrio", slug: "termo-vidrio", category: "Hogar y ambiente", price: 27800, available: true, description: "Termo de vidrio con tapa de bambú y pitillo en vidrio." },
  { name: "Bouquet Natural Mixto", slug: "bouquet-mixto", category: "Hogar y ambiente", price: 142900, available: true, description: "Ramo compuesto por hortensias, rosas de exportación y eucalipto." },
  { name: "Bouquet Natural 17 Rosas", slug: "bouquet-17-rosas", category: "Hogar y ambiente", price: 95400, available: true, description: "Ramo de 17 rosas de exportación y eucalipto." },
  { name: "Bouquet Flores Secas", slug: "bouquet-flores-secas", category: "Hogar y ambiente", price: 37500, available: true, description: "Bouquet de flores secas con mini rosas, aprox. 22cm." },
  { name: "Tarjeta con Mini Bouquet", slug: "tarjeta-mini-bouquet", category: "Hogar y ambiente", price: 31900, available: true, description: "Bouquet de flores secas con mini rosas y tarjeta, aprox. 10cm." },
  { name: "Placa Aromática", slug: "placa-aromatica", category: "Hogar y ambiente", price: 19800, available: true, description: "Placa móvil aromática colgante para espacios, 8 x 8 cm." },
  { name: "Vela Base de Concreto", slug: "vela-base-concreto", category: "Hogar y ambiente", price: 31800, available: true, description: "Vela aromática de base de concreto con aroma de pino." },
  { name: "Vela Base de Vidrio", slug: "vela-base-vidrio", category: "Hogar y ambiente", price: 39700, available: false, description: "Vela aromática de base de vidrio con aroma de vainilla." },
  { name: "Vela Forma de Margarita", slug: "vela-forma-margarita", category: "Hogar y ambiente", price: 15000, available: true, description: "Vela aromática en forma de margarita con aroma cítrico." },
  { name: "Libreta de Bolsillo", slug: "libreta-bolsillo", category: "Hogar y ambiente", price: 26300, available: true, description: "Libreta de pasta dura, con 60 hojas, medidas 9x15cm." },
  { name: "Taza Blanca", slug: "taza-blanca", category: "Hogar y ambiente", price: 16200, available: true, description: "Taza blanca con mensaje personalizado de tu elección." },

  // --- Categoría: Productos comestibles (15) ---
  { name: "Té Verderina", slug: "te-verderina", category: "Productos comestibles", price: 17700, available: true, description: "Tisanas de té, x3 paquetes." },
  { name: "Té Munay", slug: "te-munay", category: "Productos comestibles", price: 26500, available: true, description: "Té en hojas sueltas, 10gr." },
  { name: "Bolsa para Infusiones", slug: "bolsa-infusiones", category: "Productos comestibles", price: 14300, available: true, description: "Bolsa para infusiones en algodón reutilizable, tejida a mano." },
  { name: "Barra de Chocolate", slug: "barra-chocolate", category: "Productos comestibles", price: 33100, available: true, description: "Barra de chocolate, 80gr. *Preguntar por sabores disponibles." },
  { name: "Galletas Holandesas", slug: "galletas-holandesas", category: "Productos comestibles", price: 37400, available: true, description: "Mix de galletas de caramelo, triple chocolate y almendras, 175gr." },
  { name: "Kit de Cumpleaños", slug: "kit-cumpleanos", category: "Productos comestibles", price: 25900, available: true, description: "Torta envinada en lata y vela de cumpleaños." },
  { name: "Granola Natural", slug: "granola-natural", category: "Productos comestibles", price: 43400, available: true, description: "Granola natural, 500gr. *Chocolate *Cacao *Arándanos." },
  { name: "Miel de Abejas Pura", slug: "miel-abejas", category: "Productos comestibles", price: 19900, available: true, description: "Miel de abejas pura en frasco de vidrio, 100gr." },
  { name: "Mix de Maní", slug: "mix-mani", category: "Productos comestibles", price: 23500, available: true, description: "Mix de maní en frasco de vidrio, 200gr." },
  { name: "Sobre de Café", slug: "sobre-cafe", category: "Productos comestibles", price: 9000, available: true, description: "Sobre con café molido y bolsa de filtro, 13gr." },
  { name: "Café Molido Mediano", slug: "cafe-molido-mediano", category: "Productos comestibles", price: 12900, available: true, description: "Café molido honey, notas dulces, 70gr." },
  { name: "Café Molido Grande", slug: "cafe-molido-grande", category: "Productos comestibles", price: 230000, available: true, description: "Café molido grande *Honey *Lavado, 340gr." },
  { name: "JP Chenet Pequeña", slug: "jp-chenet-pequena", category: "Productos comestibles", price: 32100, available: true, description: "JP Chenet *Rosé Ice *White Ice, 200ml." },
  { name: "JP Chenet Grande", slug: "jp-chenet-grande", category: "Productos comestibles", price: 85400, available: true, description: "JP Chenet *Rosé Ice *White Ice, 750ml." },
  { name: "Copa de Vidrio", slug: "copa-vidrio", category: "Productos comestibles", price: 15200, available: true, description: "Copa de vidrio con naranja deshidratada." },

  // --- Categoría: Para hombre (8) ---
  { name: "Cerveza Extranjera", slug: "cerveza-extranjera", category: "Para hombre", price: 16800, available: true, description: "Cerveza Mahou cinco estrellas, 330ml." },
  { name: "Vaso Cervecero", slug: "vaso-cervecero", category: "Para hombre", price: 19500, available: true, description: "Vaso cervecero de vidrio con capacidad de 434ml." },
  { name: "Destapador de Madera", slug: "destapador-madera", category: "Para hombre", price: 14300, available: true, description: "Destapador de madera en acero inoxidable." },
  { name: "Libreta y Lapicero", slug: "libreta-lapicero", category: "Para hombre", price: 29900, available: false, description: "Libreta forrada en ecopiel, 9x14cm, y lapicero." },
  { name: "Termo Digital", slug: "termo-digital", category: "Para hombre", price: 23500, available: true, description: "Termo digital térmico color negro." },
  { name: "Prensa Francesa", slug: "prensa-francesa", category: "Para hombre", price: 25500, available: true, description: "Prensa en pasta y vidrio con capacidad de 350ml." },
  { name: "Llavero en Cuerina", slug: "llavero-cuerina", category: "Para hombre", price: 33400, available: false, description: "Llavero en cuerina, incluye mini destornillador." },
  { name: "Cera para Cabello Mate", slug: "cera-cabello-mate", category: "Para hombre", price: 51500, available: true, description: "Cera con acabado natural y sin brillo, 130gr." },

  // --- Categoría: Para bebé (25) ---
  { name: "Osita Dulce", slug: "osita-dulce", category: "Para bebé", price: 62300, available: true, description: "Osita amigurumi con tul y varita." },
  { name: "Osito Indigo", slug: "osito-indigo", category: "Para bebé", price: 62300, available: false, description: "Osito amigurumi con moño blanco." },
  { name: "Cebrita Rayas", slug: "cebrita-rayas", category: "Para bebé", price: 62300, available: true, description: "Cebrita amigurumi tejida a mano." },
  { name: "Osita Sofía", slug: "osita-sofia", category: "Para bebé", price: 62300, available: true, description: "Osita amigurumi con decoración rosa y corazón rosa." },
  { name: "Osito Gerónimo", slug: "osito-geronimo", category: "Para bebé", price: 62300, available: true, description: "Osito amigurumi con decoración azul y corazón azul." },
  { name: "Perrito Remmy", slug: "perrito-remmy", category: "Para bebé", price: 62300, available: true, description: "Perrito amigurumi tejido a mano." },
  { name: "Jirafita Regina", slug: "jirafita-regina", category: "Para bebé", price: 62300, available: true, description: "Jirafita amigurumi con tul y varita." },
  { name: "Jirafita Mel", slug: "jirafita-mel", category: "Para bebé", price: 62300, available: true, description: "Jirafita amigurumi tejida a mano." },
  { name: "Elefante Elliot", slug: "elefante-elliot", category: "Para bebé", price: 62300, available: true, description: "Elefante amigurumi con listón beige." },
  { name: "Conejito Benja", slug: "conejito-benja", category: "Para bebé", price: 62300, available: true, description: "Conejito amigurumi tejido a mano con decoración de tela." },
  { name: "Conejita Emily", slug: "conejita-emily", category: "Para bebé", price: 62300, available: false, description: "Conejita amigurumi tejida a mano con decoración de tela." },
  { name: "Ratoncito Jerry", slug: "ratoncito-jerry", category: "Para bebé", price: 84100, available: true, description: "Ratoncito de trapo hipoalergénico tejido a mano." },
  { name: "Conejito Noah", slug: "conejito-noah", category: "Para bebé", price: 62300, available: true, description: "Conejito amigurumi con moño y overol." },
  { name: "Conejita Emma", slug: "conejita-emma", category: "Para bebé", price: 62300, available: true, description: "Conejita amigurumi con tul y varita." },
  { name: "Sonajero de Ballenita", slug: "sonajero-ballenita", category: "Para bebé", price: 62300, available: false, description: "Sonajero con aro en madera de pino." },
  { name: "Sonajero de Conejito", slug: "sonajero-conejito", category: "Para bebé", price: 62300, available: false, description: "Sonajero con aro en madera de pino." },
  { name: "Portachupos Coneja", slug: "portachupos-coneja", category: "Para bebé", price: 62300, available: false, description: "Portachupos de coneja tejido con decoración en madera." },
  { name: "Portachupos Oso", slug: "portachupos-oso", category: "Para bebé", price: 62300, available: false, description: "Portachupos de osito tejido con decoración en madera." },
  { name: "Mameluco de Bebé", slug: "mameluco-bebe", category: "Para bebé", price: 29800, available: true, description: "Mameluco 0-6 meses. *Colores a disponibilidad." },
  { name: "Balaca para Bebé", slug: "balaca-bebe", category: "Para bebé", price: 17200, available: true, description: "Balaca 0-6 meses, color rosa claro." },
  { name: "Babero Doble Faz", slug: "babero-doble-faz", category: "Para bebé", price: 38500, available: true, description: "Babero en tela de algodón, reutilizable y lavable, color beige con café." },
  { name: "Toallitas Babitas", slug: "toallitas-bebe", category: "Para bebé", price: 16700, available: true, description: "Set x2 bobitas para bebé. *Diseño a disponibilidad." },
  { name: "Mordedor Rascaencías", slug: "mordedor-rascaencias", category: "Para bebé", price: 22500, available: true, description: "Rascaencías 100% silicona libre de BPA." },
  { name: "Medias de Bebé", slug: "medias-bebe", category: "Para bebé", price: 15200, available: true, description: "Medias 0-6 meses. *Colores a disponibilidad." },
  { name: "Peine Mini en Bambú", slug: "peine-bambu", category: "Para bebé", price: 16200, available: true, description: "Peine mini de bambú." },
];

export const ARMA_ITEMS = RAW_ITEMS.map((p) => ({
  ...p,
  slug: p.slug || slugify(p.name),
  priceLabel: `$${p.price.toLocaleString("es-CO")}`,
  folder: CATEGORY_FOLDERS[p.category],
}));

// Categorías del catálogo de "Arma tu detalle" (en el orden que se mostrarán).
export const ARMA_CATEGORIES = [
  "Cuidado personal",
  "Hogar y ambiente",
  "Productos comestibles",
  "Para hombre",
  "Para bebé",
];

export function getArmaItemsByCategory(category) {
  if (!category || category === "Todos") return ARMA_ITEMS;
  return ARMA_ITEMS.filter((p) => p.category === category);
}

export function getArmaItemBySlug(slug) {
  return ARMA_ITEMS.find((p) => p.slug === slug);
}