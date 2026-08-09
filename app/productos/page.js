"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  ShoppingBag, Menu, X, Search, User, ChevronLeft, ChevronRight,
  ImageIcon, AtSign, MessageCircle, SlidersHorizontal, ChevronDown,
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "../data/products";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import SearchOverlay from "../components/SearchOverlay";
import { useSearchParams } from "next/navigation";
const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

const PAGE_SIZE = 24;

function ImageBox({ ratio = "1 / 1", label = "Imagen pendiente" }) {
  return (
    <div className="img-placeholder" style={{ aspectRatio: ratio }}>
      <ImageIcon size={22} strokeWidth={1.3} />
      <span>{label}</span>
    </div>
  );
}
function ProductPhoto({ slug, index = 1, alt, ratio = "1 / 1", label = "Imagen pendiente" }) {
  const [error, setError] = useState(false);
  if (error) {
    return <ImageBox ratio={ratio} label={label} />;
  }
  return (
    <div className="product-photo-frame" style={{ aspectRatio: ratio }}>
      <img src={`/productos/${slug}-${index}.jpg`} alt={alt} onError={() => setError(true)} />
    </div>
  );
}

const SORT_OPTIONS = [
  { value: "price-ascending", label: "Precio: menor a mayor" },
  { value: "price-descending", label: "Precio: mayor a menor" },
];

// Categorías reales del menú — por ahora son solo navegación visual,
// hasta que asignemos una categoría a cada producto en la base de datos.


const FAQS = [
  {
    q: "¿Qué valor tiene el envío de los detalles?",
    a: "Envío gratis en Medellín. $5.000 para municipios del área metropolitana. $15.000 envíos fuera de Medellín.",
  },
  {
    q: "¿Cuánto tiempo tarda en llegar mi pedido?",
    a: "Medellín: al día siguiente del pago o en la fecha que programes. Resto del país: de 2 a 4 días hábiles.",
  },
  {
    q: "¿Qué métodos de pago manejan?",
    a: "Aceptamos Bancolombia, Nequi, tarjeta de crédito y débito, recibimos pagos de cualquier banco por medio de Bre-B.",
  },
  {
    q: "¿Hay cajas para otras ocasiones?",
    a: "Sí, puedes elegir cualquiera de nuestros diseños y la adaptaremos con los detalles necesarios para esa celebración.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={18} className={`faq-icon ${open ? "open" : ""}`} />
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

function ProductosPageContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
const { totalCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState(null);
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("categoria") || "Todos los productos");

  useEffect(() => {
    setCategory(searchParams.get("categoria") || "Todos los productos");
  }, [searchParams]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  const filtered = category === "Todos los productos"
  ? PRODUCTS
  : PRODUCTS.filter((p) => p.category === category);
  const sorted = sort
  ? [...filtered].sort((a, b) => (sort === "price-ascending" ? a.price - b.price : b.price - a.price))
  : filtered;

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageProducts = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const handleSort = (value) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div className="dolce-root">
      <style>{`
        ${FONT_IMPORT}
        .dolce-root {
          --white:#FFFFFF; --cream:#F4EAE1; --blush:#F4E2DF; --tan:#CEBAA7; --taupe:#BBA083; --olive:#927A5D; --ink:#4A3A2C;
          background: var(--white); color: var(--olive); font-family:'Marcellus', serif; overflow-x:hidden;
        }
        .dolce-root * { box-sizing: border-box; }

        .announce { background: var(--blush); text-align:center; padding: 9px 16px; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--olive); }

        .navbar { position: sticky; top:0; z-index:40; display:flex; align-items:center; justify-content:space-between;
          padding: 18px 6vw; background: rgba(255,255,255,0.94); backdrop-filter: blur(8px);
          border-bottom: 1px solid transparent; transition: box-shadow .3s, padding .3s, border-color .3s; }
        .navbar.scrolled { box-shadow: 0 6px 20px rgba(74,58,44,0.08); border-color: var(--tan); padding: 10px 6vw; }
        .navbar-left { display:flex; align-items:center; gap: 48px; }
        .brand-logo-img { height: 56px; width: auto; display: block; }
        .nav-links { display:flex; gap: 36px; list-style:none; margin:0; padding:0; }
       .nav-links li { font-size: 13px; cursor:pointer; position:relative; padding-bottom:4px; color: var(--olive); text-transform: uppercase; letter-spacing: 0.5px; }
        .nav-links li::after { content:''; position:absolute; left:0; bottom:0; width:0; height:1px; background:var(--olive); transition:width .3s; }
        .nav-links li:hover::after { width:100%; }
        .nav-links a, .footer-nav a { color: inherit; text-decoration: none; }
        .nav-dropdown { position: relative; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; background: var(--white); border: 1px solid var(--tan);
          border-radius: 10px; box-shadow: 0 12px 30px rgba(74,58,44,0.12); padding: 10px 0; min-width: 220px;
          display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(6px);
          transition: opacity .2s, transform .2s, visibility .2s; z-index: 50; }
        .nav-dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-menu a { padding: 9px 20px; font-size: 13px; text-transform: none; letter-spacing: 0; color: var(--olive); text-decoration:none; white-space: nowrap; }
        .dropdown-menu a:hover { background: var(--cream); }
        .dropdown-all { border-top: 1px solid var(--tan); margin-top: 6px; padding-top: 12px !important; }
        .nav-icons { display:flex; align-items:center; gap: 18px; }
        .icon-btn { background:none; border:none; cursor:pointer; color:var(--olive); position:relative; }
        .cart-badge { position:absolute; top:-8px; right:-9px; background:var(--olive); color:var(--white); font-size:10px;
          width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .menu-toggle { display:none; background:none; border:none; cursor:pointer; color:var(--olive); }
        .mobile-menu { position:fixed; inset:0; background:var(--white); z-index:60; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:28px; }
        .mobile-menu li { list-style:none; font-family:'Marcellus'; font-size:26px; color:var(--olive); }
        .mobile-menu a { color: inherit; text-decoration: none; }
        .mobile-close { position:absolute; top:24px; right:6vw; background:none; border:none; cursor:pointer; color:var(--olive); }

        .img-placeholder { width:100%; border-radius: 12px; border: 1.5px dashed var(--taupe); background: var(--cream);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
          color: var(--olive); opacity:0.75; text-align:center; padding: 10px; }
        .img-placeholder span { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }

        .product-photo-frame { position: relative; width: 100%; border-radius: 12px; overflow: hidden; background: var(--cream); }
        .product-photo-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        .page-header { padding: 40px 6vw 10px; text-align:center; }
        .catalog-intro { max-width: 640px; margin: 0 auto 30px; text-align: center; padding: 0 6vw; }
.catalog-intro p { font-size: 15px; line-height: 1.8; color: var(--olive); opacity: 0.9; margin-bottom: 18px; }
.catalog-intro ul { list-style: none; padding: 0; margin: 0 0 24px; }
.catalog-intro li { font-size: 13.5px; color: var(--ink); margin-bottom: 8px; }
.catalog-cta { display: inline-block; background: var(--taupe); color: var(--white); padding: 12px 26px;
  border-radius: 999px; font-family: 'Marcellus'; font-size: 14px; text-decoration: none; transition: background .25s; }
.catalog-cta:hover { background: var(--olive); }
  .faq-section { max-width: 620px; margin: 50px auto 0; padding: 0 6vw; }
.faq-title { text-align:center; font-size: 24px; font-weight: 400; color: var(--olive); margin: 0 0 26px; }
.faq-item { border-bottom: 1px solid var(--tan); }
.faq-question { width:100%; display:flex; align-items:center; justify-content:space-between; gap: 12px;
  background:none; border:none; padding: 18px 0; cursor:pointer; text-align:left;
  font-family:'Marcellus'; font-size: 15px; color: var(--ink); }
.faq-icon { color: var(--olive); flex-shrink:0; transition: transform .25s; }
.faq-icon.open { transform: rotate(180deg); }
.faq-answer { font-size: 13.5px; color: var(--olive); opacity: .85; line-height: 1.7; padding: 0 0 20px; margin:0; }
.faq-contact { text-align:center; font-size: 13px; color: var(--taupe); margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--tan); }      
.breadcrumbs { font-size: 12.5px; color: var(--taupe); margin-bottom: 14px; }
        .breadcrumbs .active { color: var(--olive); }
        .breadcrumbs a { color: var(--taupe); text-decoration: none; }
        .page-header h1 { font-size: 26px; font-weight: 400; color: var(--olive); margin: 0 0 18px; }
        .filter-toggle { display:inline-flex; align-items:center; gap: 6px; background:none; border:none;
          color: var(--olive); text-decoration: underline; text-underline-offset: 4px; font-size: 14px; cursor:pointer; font-family:'Marcellus'; }

        /* --- Cajón de filtros deslizante --- */
        .filter-overlay { position: fixed; inset: 0; background: rgba(74,58,44,0.35); z-index: 70; }
        .filter-drawer { position: fixed; top: 90px; left: 0; bottom: 0; width: 320px; max-width: 86vw; background: var(--white);
          z-index: 71; box-shadow: 8px 0 30px rgba(0,0,0,0.15); overflow-y: auto; padding: 26px 28px 60px; }
        .filter-drawer-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 30px; }
        .filter-drawer-header h3 { font-size: 20px; color: var(--olive); font-weight: 400; margin: 0; }
        .filter-drawer-header button { background:none; border:none; cursor:pointer; color: var(--olive); }
        .filter-block { margin-bottom: 34px; }
        .filter-block h4 { font-size: 13px; letter-spacing: 0.5px; color: var(--ink); margin: 0 0 16px; font-weight: 600; }
        .radio-item { display:flex; align-items:center; gap: 12px; margin-bottom: 14px; cursor:pointer; }
        .radio-dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--taupe); flex-shrink:0;
          display:flex; align-items:center; justify-content:center; }
        .radio-dot.checked::after { content:''; width: 8px; height: 8px; border-radius: 50%; background: var(--olive); }
        .radio-item span.label { font-size: 14px; color: var(--ink); }
        .cat-link { display:block; font-size: 14px; color: var(--olive); text-decoration: none; margin-bottom: 14px; cursor: pointer; }
        .cat-link:hover { text-decoration: underline; }
        .cat-link.active { font-weight: 600; }

        .section { padding: 30px 6vw 70px; }
        .product-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(0, 240px)); gap: 22px; justify-content: center; max-width: 1080px; margin: 0 auto; }
        .catalog-layout { display:flex; gap: 40px; align-items:flex-start; max-width: 1200px; margin: 0 auto; padding: 0 6vw; }
        .category-sidebar { width: 200px; flex-shrink: 0; position: sticky; top: 100px; }
        .category-sidebar h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--taupe); margin: 0 0 18px; }
        .catalog-content { flex: 1; min-width: 0; }
        .catalog-content .product-grid { max-width: none; margin: 0; justify-content: flex-start; }
        .product-card { text-align:center; text-decoration:none; color: inherit; display:block; min-width: 0; }
        .product-card .img-placeholder { aspect-ratio: 1/1; margin-bottom: 12px; transition: transform .3s; }
        .product-card .product-photo-frame { aspect-ratio: 1/1; margin-bottom: 12px; transition: transform .3s; }
        .product-card:hover .img-placeholder,
        .product-card:hover .product-photo-frame { transform: translateY(-4px); }
        .product-card h3 { font-size: 15px; color: var(--ink); margin: 0 0 3px; font-weight: 400; }
        .product-card p { font-size: 13px; color: var(--taupe); margin: 0; }

        .pagination { display:flex; align-items:center; justify-content:center; gap: 20px; margin-top: 44px; color: var(--olive); }
        .pagination button { background:none; border:none; cursor:pointer; color: var(--olive); display:flex; opacity: 1; transition: opacity .2s; }
        .pagination button:disabled { opacity: 0.3; cursor: not-allowed; }
        .pagination span { font-size: 14px; }

        .footer { background: var(--blush); color: var(--olive); padding: 50px 6vw 26px; text-align:center; }
        .footer-icon { margin-bottom: 26px; display:flex; justify-content:center; color: var(--olive); }
        .footer-nav { display:flex; justify-content:center; gap: 28px; list-style:none; padding:0; margin: 0 0 26px; flex-wrap: wrap; }
        .footer-nav li { font-size: 14px; cursor:pointer; opacity:.9; color: var(--olive); }
        .footer-contact p { font-size: 14px; opacity: .9; margin: 6px 0; color: var(--olive); }
        .payment-row { display:flex; justify-content:center; gap: 10px; margin: 26px 0; flex-wrap: wrap; }
        .payment-chip { background: rgba(146,122,93,0.08); border:1px solid rgba(146,122,93,0.3); color: var(--olive); border-radius: 6px; padding: 6px 12px; font-size: 11px; letter-spacing: 0.5px; }
        .footer-bottom { border-top: 1px solid rgba(146,122,93,0.25); padding-top: 18px; font-size: 12px; opacity: .7; margin-top: 20px; color: var(--olive); }

        .whatsapp-fab { position: fixed; bottom: 24px; right: 24px; z-index: 50; width: 54px; height: 54px; border-radius: 50%;
          background: #25D366; color: #fff; display:flex; align-items:center; justify-content:center; border:none;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25); cursor:pointer; transition: transform .25s; text-decoration:none; }
        .whatsapp-fab:hover { transform: scale(1.08); }

        @media (max-width: 900px) {
          .nav-links { display:none; } .menu-toggle { display:block; }
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        .category-sidebar { display: none; }
          .catalog-layout { padding: 0 6vw; }
          }
      `}</style>

      <div className="announce">Envíos a todo Colombia. Compra Dolce, compra local.</div>

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-left">
          <div className="brand">
            <img src="/logoprincipal.png" alt="Dolce Giftbox" className="brand-logo-img" />
          </div>
          <ul className="nav-links">
            <li><Link href="/">Inicio</Link></li>
            <li className="nav-dropdown">
              <Link href="/productos">Detalles prediseñados</Link>
              <div className="dropdown-menu">
                {CATEGORIES.map((cat) => (
                  <Link key={cat} href={`/productos?categoria=${encodeURIComponent(cat)}`}>{cat}</Link>
                ))}
                <Link href="/productos" className="dropdown-all">Todos</Link>
              </div>
            </li>
            <li><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
         <li><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
          
        </ul>
        </div>
        <div className="nav-icons">
          <button className="icon-btn" aria-label="Buscar" onClick={() => setSearchOpen(true)}><Search size={19} /></button>
          <button className="icon-btn" aria-label="Cuenta"><User size={19} /></button>
          <button className="icon-btn" aria-label="Carrito" onClick={() => setCartOpen(true)}>
  <ShoppingBag size={19} />
  {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
</button>
          <button className="menu-toggle" aria-label="Menú" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}><X size={26} /></button>
          <ul>
            <li onClick={() => setMenuOpen(false)}><Link href="/">Inicio</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/productos">Productos</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/contacto">Contacto</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/quienes-somos">Quiénes Somos</Link></li>
         <li onClick={() => setMenuOpen(false)}><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
          </ul>
        </div>
      )}

      {filtersOpen && (
        <>
          <div className="filter-overlay" onClick={() => setFiltersOpen(false)} />
          <div className="filter-drawer">
            <div className="filter-drawer-header">
              <h3>Filtrar</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Cerrar"><X size={20} /></button>
            </div>

            <div className="filter-block">
              <h4>Ordenar</h4>
              {SORT_OPTIONS.map((s) => (
                <div key={s.value} className="radio-item" onClick={() => handleSort(s.value)}>
                  <span className={`radio-dot ${sort === s.value ? "checked" : ""}`} />
                  <span className="label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="filter-block">
  <h4>Categorías</h4>
  <span
    className={`cat-link ${category === "Todos los productos" ? "active" : ""}`}
    onClick={() => { setCategory("Todos los productos"); setPage(1); }}
  >
    Todos los productos
  </span>
  {CATEGORIES.map((c) => (
    <span
      key={c}
      className={`cat-link ${category === c ? "active" : ""}`}
      onClick={() => { setCategory(c); setPage(1); }}
    >
      {c}
    </span>
  ))}
</div>
          </div>
        </>
      )}

     <div className="page-header">
  <p className="breadcrumbs">
  <Link href="/">Inicio</Link> <span>.</span>{" "}
  <Link href="/productos">Detalles prediseñados</Link>
  {category !== "Todos los productos" && (
    <>
      {" "}<span>.</span> <span className="active">{category}</span>
    </>
  )}
</p>
  <h1>{category === "Todos los productos" ? "Detalles prediseñados" : category}</h1>
  <button className="filter-toggle" onClick={() => setFiltersOpen(true)}>
    <SlidersHorizontal size={14} /> Filtrar
  </button>
</div>

<div className="catalog-intro">
  <p>Cada uno de nuestros detalles está diseñado cuidadosamente para crear regalos únicos, delicados y especiales.</p>
  <ul>
    <li>Tarjeta personalizada incluida</li>
    <li>Productos artesanales y ecoamigables</li>
    <li>Personalización disponible (+$3.000)</li>
  </ul>
  
    <a
    className="catalog-cta"
    href="https://wa.me/573113290390?text=Hola!%20Quiero%20armar%20un%20detalle%20a%20mi%20gusto%2C%20%C2%BFme%20ayudan%3F%20%F0%9F%8E%81"
    target="_blank"
    rel="noopener noreferrer"
  >
    ¿Quieres cambiar algún producto? Arma tu detalle a tu gusto
  </a>
</div>
<section className="section">
        <div className="product-grid">
          {pageProducts.map((p) => (
            <Link href={`/productos/${p.slug}`} className="product-card" key={p.slug}>
              <ProductPhoto slug={p.slug} index={1} alt={p.name} label={p.name} />
              <h3>{p.name}</h3>
              <p>{p.priceLabel}</p>
            </Link>
          ))}
        </div>
        <div className="pagination">
          <button onClick={goPrev} disabled={page === 1} aria-label="Anterior"><ChevronLeft size={18} /></button>
          <span>{page} / {totalPages}</span>
          <button onClick={goNext} disabled={page === totalPages} aria-label="Siguiente"><ChevronRight size={18} /></button>
        </div>
      </section>
      


      <footer className="footer">
        <div className="footer-icon"><AtSign size={20} /></div>
        <ul className="footer-nav">
          <li><Link href="/">Inicio</Link></li>
          <Link href="/productos">Detalles prediseñados</Link>
          <li><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
          <li><Link href="/contacto">Contacto</Link></li>
       <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
          <li><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
          <li><Link href="/terminos-y-condiciones">Términos y Condiciones</Link></li>
          <li><Link href="/politica-de-privacidad">Política de Privacidad</Link></li>
        </ul>
        <div className="footer-contact">
          <p>+57 311 329 0390 (WhatsApp)</p>
          <p>311 329 0390</p>
          <p>dolcegiftboxcolombia@gmail.com</p>
        </div>
        <div className="payment-row">
          {["Visa", "Mastercard", "Amex", "Diners", "Efecty", "Mercado Pago"].map((p) => (
            <span key={p} className="payment-chip">{p}</span>
          ))}
        </div>
        <div className="footer-bottom">Copyright Dolce Gift Box — 2026. Todos los derechos reservados.</div>
      </footer>

      <a className="whatsapp-fab" href="https://wa.me/573113290390" target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
        <MessageCircle size={26} />
      </a>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
   <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={null}>
      <ProductosPageContent />
    </Suspense>
  );
}