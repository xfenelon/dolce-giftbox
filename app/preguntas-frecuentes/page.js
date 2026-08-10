"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CartDrawer from "../components/CartDrawer";
import CartToast from "../components/CartToast";
import SearchOverlay from "../components/SearchOverlay";
import { useCart } from "../context/CartContext";
import { CATEGORIES } from "../data/products";
import {
  ShoppingBag, Menu, X, Search, User, MessageCircle, AtSign, ChevronDown,
} from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

const FAQS = [
  {
    q: "¿Qué valor tiene el envío de los detalles?",
    a: "Envío gratis en Medellín, $5.000 para municipios del área metropolitana, $15.000 envíos fuera de Medellín por casa detalle (el precio por Interrapidísimo depende de la cantidad de detalles enviados).",
  },
  {
    q: "¿Cuánto tiempo tarda en llegar mi pedido?",
    a: "Medellín y área metropolitana: al día siguiente del pago o en la fecha que programes. Resto del país: de 2 a 4 días hábiles.",
  },
  {
    q: "¿Puedo comprar solo el empaque?",
    a: "No, nuestros empaques se venden exclusivamente como parte de un kit de regalo.",
  },
  {
    q: "¿Puedo comprar los productos por separado?",
    a: "Sí, los productos se venden de forma individual, excepto los peluches, que están disponibles únicamente en los kits de regalo.",
  },
  {
    q: "¿Cuál es el pedido mínimo para los detalles?",
    a: "Para adquirir nuestros empaques, debes incluir un mínimo de 3 productos de nuestro catálogo. El empaque no cuenta dentro de ese mínimo.",
  },
  {
    q: "¿Puedo agendar para el mismo día?",
    a: "No manejamos entregas inmediatas, puedes agendar tu pedido para el día siguiente.",
  },
  {
    q: "¿Puedo recoger mi pedido en la sede de ustedes?",
    a: "En caso de solicitar recoger el pedido en nuestra sede, la compra debe realizarse por medio de nuestra línea de WhatsApp.",
  },
  {
    q: "¿Dónde puedo solicitar cuenta de cobro y documentos soporte?",
    a: "Puedes solicitarla por medio de nuestro correo electrónico dolcegiftboxcolombia@gmail.com, indicando número de orden, nombre, NIT o número de documento, la cual será entregada en 24 horas hábiles a partir de la solicitud.",
  },
  {
    q: "¿Puedo cambiar la fecha de mi pedido?",
    a: "Sí, puedes hacerlo hasta 36 horas antes del envío por medio de nuestro canal de WhatsApp, informando el caso y número de orden.",
  },
  {
    q: "¿Puedo modificar la dirección de envío?",
    a: "Sí, puedes hacerlo hasta 36 horas antes del envío por medio de nuestro canal de WhatsApp, informando el número de orden.",
  },
  {
    q: "¿Puedo pedir el detalle para que llegue a una hora exacta?",
    a: "En Medellín y área metropolitana tratamos de entregar todos los detalles en horas de la mañana (8:00 am - 12:00 pm), pero no manejamos hora exacta de entrega; en algunas ocasiones se puede tardar más del rango de horario debido a alta demanda de pedidos o congestión vehicular. Fuera de Medellín, los pedidos se entregan en los horarios a disposición de Interrapidísimo.",
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

export default function PreguntasFrecuentesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        .nav-links { display:flex; gap: 32px; list-style:none; margin:0; padding:0; }
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
        .mobile-menu li:last-child { border-bottom: none; }
        .mobile-menu a { color: inherit; text-decoration: none; }
        .mobile-close { position:absolute; top:24px; right:6vw; background:none; border:none; cursor:pointer; color:var(--olive); }

        .page-header { padding: 46px 6vw 10px; text-align:center; }
        .breadcrumbs { font-size: 12.5px; color: var(--taupe); margin-bottom: 14px; }
        .breadcrumbs .active { color: var(--olive); }
        .breadcrumbs a { color: var(--taupe); text-decoration: none; }
        .page-header h1 { font-size: 28px; font-weight: 400; color: var(--olive); margin: 0 0 14px; }
        .page-header p { max-width: 560px; margin: 0 auto; font-size: 14.5px; line-height: 1.7; color: var(--olive); opacity: .85; }

        .faq-section { max-width: 700px; margin: 40px auto 0; padding: 0 6vw 80px; }
        .faq-item { border-bottom: 1px solid var(--tan); }
        .faq-question { width:100%; display:flex; align-items:center; justify-content:space-between; gap: 12px;
          background:none; border:none; padding: 20px 0; cursor:pointer; text-align:left;
          font-family:'Marcellus'; font-size: 15.5px; color: var(--ink); }
        .faq-icon { color: var(--olive); flex-shrink:0; transition: transform .25s; }
        .faq-icon.open { transform: rotate(180deg); }
        .faq-answer { font-size: 14px; color: var(--olive); opacity: .85; line-height: 1.75; padding: 0 0 22px; margin:0; }
        .faq-contact { text-align:center; font-size: 13px; color: var(--taupe); margin-top: 30px; padding-top: 24px; border-top: 1px solid var(--tan); }

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
          <img src="/logoprincipal.png" alt="Dolce Giftbox" className="mobile-menu-logo" />
          <ul>
            <li onClick={() => setMenuOpen(false)}><Link href="/">Inicio</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/productos">Detalles prediseñados</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/contacto">Contacto</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/quienes-somos">Quiénes Somos</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/terminos-y-condiciones">Términos y Condiciones</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/politica-de-privacidad">Política de Privacidad</Link></li>
          </ul>
        </div>
      )}

      <div className="page-header">
        <p className="breadcrumbs"><Link href="/">Inicio</Link> <span>.</span> <span className="active">Preguntas Frecuentes</span></p>
        <h1>Preguntas Frecuentes</h1>
        <p>Resolvemos las dudas más comunes sobre envíos, pedidos y entregas.</p>
      </div>

      <div className="faq-section">
        {FAQS.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
        <p className="faq-contact">
          ¿Tienes otra pregunta? WhatsApp: +57 311 329 0390 · Instagram: @dolcegiftbox
        </p>
      </div>

      <footer className="footer">
        <div className="footer-icon"><AtSign size={20} /></div>
        <ul className="footer-nav">
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/productos">Detalles prediseñados</Link></li>
          <li><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
          <li><Link href="/contacto">Contacto</Link></li>
          <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
          <li><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
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
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}