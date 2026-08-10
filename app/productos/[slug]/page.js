"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CATEGORIES } from "../../data/products";
import CartDrawer from "../../components/CartDrawer";
import CartToast from "../../components/CartToast";
import { useCart } from "../../context/CartContext";
import {
  ShoppingBag, Menu, X, Search, User, MessageCircle, AtSign, ChevronDown,
  ImageIcon, Minus, Plus, Share2,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "../../data/products";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

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

function ProductGallery({ slug, name, packaging }) {
  const [active, setActive] = useState(1);
  return (
    <>
      {active === 2 && packaging ? (
        <div className="product-photo-frame" style={{ aspectRatio: "1 / 1" }}>
          <img src={`/empaques/${packaging.photo}.jpg`} alt={`Empaque: ${packaging.name}`} />
        </div>
      ) : (
        <ProductPhoto slug={slug} index={1} alt={`Foto ${name}`} label={`Foto ${name}`} />
      )}
      <div className="pd-thumbs">
        <button
          className={`pd-thumb ${active === 1 ? "active" : ""}`}
          onClick={() => setActive(1)}
          aria-label="Ver foto del producto"
        >
          <ProductPhoto slug={slug} index={1} alt="Foto del producto" label="Foto 1" />
        </button>
        {packaging && (
          <button
            className={`pd-thumb ${active === 2 ? "active" : ""}`}
            onClick={() => setActive(2)}
            aria-label="Ver empaque"
          >
            <div className="product-photo-frame" style={{ aspectRatio: "1 / 1" }}>
              <img src={`/empaques/${packaging.photo}.jpg`} alt={packaging.name} />
            </div>
          </button>
        )}
      </div>
    </>
  );
}
export default function ProductDetailPage({ params }) {
  const { slug } = React.use(params);
  const product = getProductBySlug(slug);
  const related = getRelatedProducts(slug, 4);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dudasOpen, setDudasOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ribbon, setRibbon] = useState("Blanco");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, totalCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product) {
    return (
      <div style={{ padding: "80px 6vw", textAlign: "center", fontFamily: "serif" }}>
        <p>No encontramos ese producto.</p>
        <Link href="/productos">Volver a Productos</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      priceLabel: product.priceLabel,
      price: product.price,
      ribbon,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
        .nav-dropdown { position: relative; }
        .nav-dropdown span { cursor: pointer; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; background: var(--white); border: 1px solid var(--tan);
          border-radius: 10px; box-shadow: 0 12px 30px rgba(74,58,44,0.12); padding: 10px 0; min-width: 220px;
          display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(6px);
          transition: opacity .2s, transform .2s, visibility .2s; z-index: 50; }
        .nav-dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-menu a { padding: 9px 20px; font-size: 13px; text-transform: none; letter-spacing: 0; color: var(--olive); text-decoration:none; white-space: nowrap; }
        .dropdown-menu a:hover { background: var(--cream); }
        .dropdown-all { border-top: 1px solid var(--tan); margin-top: 6px; padding-top: 12px !important; }
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
          align-items:center; justify-content:center; padding: 40px 8vw; }
        .mobile-menu-logo { height: 44px; width: auto; display:block; margin-bottom: 36px; }
        .mobile-menu ul { list-style:none; margin:0; padding:0; width: 100%; max-width: 320px; }
        .mobile-menu li { font-family:'Marcellus'; font-size: 17px; color:var(--olive); text-align:center;
          padding: 17px 0; border-bottom: 1px solid var(--cream); text-transform: uppercase; letter-spacing: 0.5px; }
        .mobile-dudas { display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; }
        .mobile-dudas-icon { transition: transform .25s; }
        .mobile-dudas-icon.open { transform: rotate(180deg); }
        .mobile-sublink { font-size: 14px !important; opacity: .75; }
        .mobile-menu a { color: inherit; text-decoration: none; }
        .mobile-close { position:absolute; top:24px; right:6vw; background:none; border:none; cursor:pointer; color:var(--olive); }

        .img-placeholder { width:100%; border-radius: 12px; border: 1.5px dashed var(--taupe); background: var(--cream);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
          color: var(--olive); opacity:0.75; text-align:center; padding: 10px; }
        .img-placeholder span { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
        .product-photo-frame { position: relative; width: 100%; border-radius: 12px; overflow: hidden; background: var(--cream); }
        .product-photo-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .breadcrumbs { font-size: 12.5px; color: var(--taupe); padding: 22px 6vw 0; }
        .breadcrumbs .active { color: var(--olive); }
        .breadcrumbs a { color: var(--taupe); text-decoration: none; }
        .breadcrumbs a:hover { text-decoration: underline; }

        .pd-section { display:flex; gap: 46px; padding: 20px 6vw 60px; align-items:flex-start; flex-wrap: wrap; max-width: 1200px; margin: 0 auto; }
        .pd-gallery { display:flex; gap: 12px; width: 110px; flex-direction: column; }
        .pd-gallery .img-placeholder { aspect-ratio: 1/1; }
        .pd-main { flex: 1.2; min-width: 280px; max-width: 640px; margin: 0 auto; }
         .pd-main .img-placeholder { aspect-ratio: 4 / 5; }
        .pd-thumbs { display:flex; gap: 10px; margin-top: 12px; }
        .pd-thumb { width: 64px; height: 64px; border-radius: 8px; overflow:hidden; padding:0; border: 2px solid transparent;
          background:none; cursor:pointer; opacity: .65; transition: opacity .2s, border-color .2s; }
        .pd-thumb.active { opacity: 1; border-color: var(--olive); }
        .pd-thumb .product-photo-frame { border-radius: 6px; }

        .pd-share { display:flex; gap: 14px; margin-top: 16px; }
        .pd-share a { color: var(--olive); }

        .pd-info { flex: 1; min-width: 280px; }
        .pd-info h1 { font-size: 28px; color: var(--ink); margin: 0 0 8px; font-weight: 400; }
        .pd-price { font-size: 20px; color: var(--olive); margin-bottom: 4px; }
        .pd-installments { font-size: 13px; color: var(--taupe); margin-bottom: 22px; }
        .pd-label { font-size: 13.5px; margin-bottom: 10px; color: var(--olive); }
        .ribbon-options { display:flex; gap: 10px; margin-bottom: 24px; }
        .ribbon-chip { border: 1px solid var(--taupe); background: none; padding: 8px 18px; border-radius: 8px;
          font-family:'Marcellus'; font-size: 13px; cursor:pointer; color: var(--ink); transition: all .2s; }
        .ribbon-chip.active { border-color: var(--olive); background: var(--cream); color: var(--olive); }
        .ribbon-specs-row { display:flex; gap: 20px; align-items:flex-start; margin-bottom: 22px; flex-wrap: wrap; }
        .ribbon-reference { width: 150px; max-width: 100%; border-radius: 10px; display: block; flex-shrink: 0; }
        .ribbon-specs-row .pd-bullets { flex: 1; min-width: 160px; margin: 0; }
        .qty-row { display:flex; align-items:center; gap: 18px; margin-bottom: 26px; }
        .qty-control { display:flex; align-items:center; border:1px solid var(--tan); border-radius: 999px; overflow:hidden; }
        .qty-control button { background:none; border:none; padding: 10px 14px; cursor:pointer; color: var(--olive); }
        .qty-control span { padding: 0 10px; font-size: 14px; }
        .btn-add-cart { flex:1; background: var(--taupe); color: var(--white); border:none; padding: 14px 30px; border-radius: 999px;
          font-family:'Marcellus'; font-size: 14px; letter-spacing: 0.5px; cursor:pointer; transition: background .25s; }
        .btn-add-cart:hover { background: var(--olive); }
        .btn-personalize {
  display:flex; align-items:center; justify-content:center; gap:8px;
  width:100%; border:1px solid var(--olive); color: var(--olive); background: var(--white);
  padding: 13px 30px; border-radius: 999px; font-family:'Marcellus'; font-size: 14px;
  letter-spacing: 0.5px; cursor:pointer; text-decoration:none; margin-bottom: 26px;
  transition: background .25s, color .25s;
}
.btn-personalize:hover { background: var(--cream); }
        .pd-bullets { list-style:none; padding:0; margin: 0 0 12px; }
        .pd-bullets li { font-size: 14px; color: var(--ink); opacity:.85; margin-bottom: 10px; line-height:1.5; }

        .related { padding: 10px 6vw 70px; }
        .related h2 { text-align:center; font-size: 24px; color: var(--olive); font-weight: 400; margin-bottom: 30px; }
        .related-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
        .related-card { text-align:center; text-decoration:none; color: inherit; min-width: 0; }
        .related-card .img-placeholder { aspect-ratio: 1/1; margin-bottom: 10px; }

        .related-card h3 { font-size: 14.5px; color: var(--ink); margin: 0 0 3px; font-weight: 400; }
        .related-card p { font-size: 13px; color: var(--taupe); margin: 0; }

        .footer { background: var(--blush); color: var(--olive); padding: 50px 6vw 26px; text-align:center; }
        .footer-icon { margin-bottom: 26px; display:flex; justify-content:center; color: var(--olive); }
        .footer-nav { display:flex; justify-content:center; gap: 28px; list-style:none; padding:0; margin: 0 0 26px; flex-wrap: wrap; }
        .footer-nav li { font-size: 14px; cursor:pointer; opacity:.9; color: var(--olive); }
        .footer-contact p { font-size: 14px; opacity: .9; margin: 6px 0; color: var(--olive); }
        .footer-bottom { border-top: 1px solid rgba(146,122,93,0.25); padding-top: 18px; font-size: 12px; opacity: .7; margin-top: 20px; color: var(--olive); }

        
          .whatsapp-fab { position: fixed; bottom: 24px; right: 24px; z-index: 50; width: 90px; height: 90px; border-radius: 11px;
          overflow: hidden; display:flex; align-items:center; justify-content:center; border:none;
          background: none; cursor:pointer; transition: transform .25s; text-decoration:none; }
        .whatsapp-fab img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .whatsapp-fab:hover { transform: scale(1.08); }
.cart-toast { position: fixed; top: 90px; right: 24px; z-index: 90; background: var(--white); border: 1px solid var(--tan);
          border-radius: 14px; box-shadow: 0 12px 30px rgba(74,58,44,0.18); padding: 14px 16px; display:flex; align-items:center; gap: 12px;
          max-width: 280px; animation: toastIn .3s ease; }
        .cart-toast-icon { width: 28px; height: 28px; border-radius: 50%; background: #DCEFE2; color: #2E7D4F; display:flex;
          align-items:center; justify-content:center; flex-shrink:0; }
        .cart-toast-text { display:flex; flex-direction:column; font-size: 12.5px; color: var(--olive); }
        .cart-toast-text strong { color: var(--ink); font-weight: 400; font-family:'Marcellus'; font-size: 13.5px; }
        .cart-toast-btn { background: none; border: none; color: var(--olive); text-decoration: underline; font-size: 12px; cursor:pointer; white-space:nowrap; }
        @keyframes toastIn { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .nav-links { display:none; } .menu-toggle { display:block; }
          .pd-gallery { flex-direction: row; width: 100%; }
          .related-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="announce">Envíos a todo Colombia. Compra Dolce, compra local.</div>

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-left">
          <Link href="/" className="brand">
            <img src="/logoprincipal.png" alt="Dolce Giftbox" className="brand-logo-img" />
          </Link>
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
            <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
            <li className="nav-dropdown">
              <span>Dudas</span>
              <div className="dropdown-menu">
                <Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link>
                <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>
                <Link href="/politica-de-privacidad">Política de Privacidad</Link>
              </div>
            </li>
          </ul>
        </div>
        <div className="nav-icons">
          <button className="icon-btn" aria-label="Buscar"><Search size={19} /></button>
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
          <img src="/logoprincipal.png" alt="Dolce Giftbox" className="mobile-menu-logo" />
          <ul>
            <li onClick={() => setMenuOpen(false)}><Link href="/">Inicio</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/productos">Detalles prediseñados</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/quienes-somos">Quiénes Somos</Link></li>
            <li className="mobile-dudas" onClick={() => setDudasOpen(!dudasOpen)}>
              <span>Dudas</span>
              <ChevronDown size={16} className={`mobile-dudas-icon ${dudasOpen ? "open" : ""}`} />
            </li>
            {dudasOpen && (
              <>
                <li className="mobile-sublink" onClick={() => setMenuOpen(false)}><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
                <li className="mobile-sublink" onClick={() => setMenuOpen(false)}><Link href="/terminos-y-condiciones">Términos y Condiciones</Link></li>
                <li className="mobile-sublink" onClick={() => setMenuOpen(false)}><Link href="/politica-de-privacidad">Política de Privacidad</Link></li>
              </>
            )}
          </ul>
        </div>
      )}

      <p className="breadcrumbs">
        <Link href="/">Inicio</Link> <span>.</span> <Link href="/productos">Todos los productos</Link> <span>.</span>{" "}
        <span className="active">{product.name}</span>
      </p>

      <section className="pd-section">
       
        <div className="pd-main">
          <ProductGallery slug={product.slug} name={product.name} packaging={product.packaging} />
          <div className="pd-share">
            <a href="#" aria-label="Compartir"><Share2 size={16} /></a>
          </div>
        </div>
        
     
<div className="pd-info">
          <h1>{product.name}</h1>
          <p className="pd-price">{product.priceLabel}</p>
          <p className="pd-installments">{product.installmentLabel}</p>
          <p className="pd-label">Color del listón para la cajita: {ribbon}</p>
          <div className="ribbon-options">
            {["Blanco", "Café", "Rosa Palo"].map((c) => (
              <button key={c} className={`ribbon-chip ${ribbon === c ? "active" : ""}`} onClick={() => setRibbon(c)}>{c}</button>
            ))}
          </div>
          <div className="ribbon-specs-row">
            <img src="/liston-referencia.jpg" alt="Colores de listón disponibles: café, blanco y palo rosa" className="ribbon-reference" />
            <ul className="pd-bullets">
              {product.bullets.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>
          <div className="qty-row">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos"><Minus size={14} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Más"><Plus size={14} /></button>
            </div>
            <button className="btn-add-cart" onClick={handleAddToCart}>
              {added ? "¡Agregado!" : "Agregar al carrito"}
            </button>
          </div>

          <a
            className="btn-personalize"
            href={`https://wa.me/573113290390?text=${encodeURIComponent(
              `Hola! Quiero personalizar la caja "${product.name}" (listón ${ribbon}, cantidad ${qty}). ¿Me ayudan? 🎁`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} /> ¿La quieres personalizada? Escríbenos
          </a>
        </div>
        
       
      </section>

      <section className="related">
        <h2>Productos relacionados</h2>
        <div className="related-grid">
          {related.map((p) => (
            <Link key={p.slug} href={`/productos/${p.slug}`} className="related-card">
              <ProductPhoto slug={p.slug} index={1} alt={p.name} label={p.name} />
              <h3>{p.name}</h3>
              <p>{p.priceLabel}</p>
            </Link>
          ))}
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
        <div className="footer-bottom">Copyright Dolce Gift Box — 2026. Todos los derechos reservados.</div>
      </footer>

     <a className="whatsapp-fab" href="https://wa.me/573113290390" target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
        <img src="/whatsapp-boton.png" alt="Escríbenos por WhatsApp" />
      </a>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    <CartToast onViewCart={() => setCartOpen(true)} />
    </div>
  );
}