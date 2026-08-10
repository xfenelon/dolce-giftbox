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

const RESPONSABLE_TABLE = [
  ["Responsable", "María Fernanda Arango Trespalacios"],
  ["Marca comercial", "Dolce Gift Box"],
  ["NIT", "1.152.470.760-8"],
  ["Domicilio", "Medellín, Antioquia"],
  ["Correo electrónico", "dolcegiftboxcolombia@gmail.com"],
  ["WhatsApp", "+57 311 329 0390"],
  ["Instagram", "@dolcegiftbox"],
  ["Página web", "dolcegiftbox.com"],
];

const CONTENT_TOP = [
  { type: "p", text: "En Dolce estamos comprometidos con la protección de la privacidad y de los datos personales de nuestros clientes, proveedores, usuarios y visitantes." },
  { type: "p", text: "La presente Política de Tratamiento de Datos Personales establece las condiciones bajo las cuales María Fernanda Arango Trespalacios, identificada con NIT 1.152.470.760-8, en calidad de titular de la marca comercial Dolce, recolecta, almacena, utiliza, administra y protege la información suministrada por los usuarios a través del sitio web y de sus canales oficiales de comunicación." },
  { type: "p", text: "El tratamiento de los datos personales se realizará de conformidad con la Ley 1581 de 2012, el Decreto 1074 de 2015 y demás normas colombianas que regulan la protección de datos personales." },
  { type: "p", text: "Dolce garantiza el respeto por los derechos fundamentales de privacidad, intimidad, buen nombre, libertad, transparencia, acceso, circulación restringida, seguridad y confidencialidad durante el tratamiento de los datos personales." },

  { type: "h2", text: "¿Qué datos personales recolectamos?" },
  { type: "p", text: "Dolce podrá recopilar la siguiente información cuando el usuario interactúe con el sitio web o con cualquiera de nuestros canales oficiales:" },
  { type: "ul", items: [
    "Nombre y apellidos.",
    "Documento de identificación cuando sea necesario.",
    "Dirección de entrega.",
    "Ciudad y departamento.",
    "Número de teléfono.",
    "Dirección de correo electrónico.",
    "Información del destinatario del regalo.",
    "Información necesaria para la facturación.",
    "Información relacionada con los pedidos realizados.",
    "Información de navegación obtenida mediante cookies.",
  ]},
  { type: "p", text: "En algunos casos podrá solicitarse información adicional cuando sea necesaria para prestar adecuadamente el servicio contratado." },

  { type: "h2", text: "¿Quién es el responsable del tratamiento de los datos?" },
];

const CONTENT_BOTTOM = [
  { type: "h2", text: "¿Para qué utilizamos sus datos?" },
  { type: "p", text: "Los datos personales serán utilizados exclusivamente para:" },
  { type: "ul", items: [
    "Procesar pedidos.",
    "Coordinar entregas.",
    "Emitir facturas cuando corresponda.",
    "Contactar al cliente sobre su compra.",
    "Atender consultas, peticiones, quejas y reclamos.",
    "Gestionar garantías y devoluciones.",
    "Informar novedades relacionadas con un pedido.",
    "Cumplir obligaciones legales.",
  ]},
  { type: "p", text: "Con autorización del titular, Dolce también podrá utilizar la información para enviar promociones, compartir novedades, informar sobre nuevos productos, realizar campañas de fidelización y enviar descuentos y beneficios." },
  { type: "p", text: "Dolce no vende, alquila ni comercializa la información personal de sus usuarios." },

  { type: "h2", text: "¿Con quién compartimos su información?" },
  { type: "p", text: "Los datos podrán compartirse únicamente cuando sea necesario con:" },
  { type: "ul", items: [
    "Empresas transportadoras.",
    "Pasarelas de pago.",
    "Entidades financieras.",
    "Autoridades competentes cuando exista obligación legal.",
  ]},
  { type: "p", text: "En todos los casos Dolce procurará que dichos terceros cumplan con la normativa de protección de datos aplicable." },

  { type: "h2", text: "Uso de cookies" },
  { type: "p", text: "El sitio web de Dolce utiliza cookies y tecnologías similares para mejorar la experiencia del usuario, analizar el tráfico del sitio y recordar determinadas preferencias de navegación." },
  { type: "p", text: "Las cookies no permiten acceder a información personal almacenada en el dispositivo del usuario." },
  { type: "p", text: "El usuario podrá configurar su navegador para rechazar parcial o totalmente las cookies; sin embargo, algunas funcionalidades del sitio podrían verse afectadas." },

  { type: "h2", text: "Derechos del titular de los datos" },
  { type: "p", text: "El titular de los datos personales podrá en cualquier momento:" },
  { type: "ul", items: [
    "Conocer los datos que Dolce posee sobre él.",
    "Solicitar la actualización de su información.",
    "Corregir datos inexactos.",
    "Solicitar la eliminación de sus datos cuando sea procedente.",
    "Revocar la autorización otorgada para el tratamiento.",
    "Presentar consultas o reclamos relacionados con el tratamiento de sus datos.",
  ]},

  { type: "h2", text: "¿Cómo ejercer sus derechos?" },
  { type: "p", text: "Las solicitudes relacionadas con el tratamiento de datos personales podrán enviarse a:" },
  { type: "ul", items: [
    "Correo electrónico: dolcegiftboxcolombia@gmail.com",
    "WhatsApp: +57 311 329 0390",
  ]},
  { type: "p", text: "Dolce atenderá las solicitudes dentro de los términos establecidos por la legislación colombiana." },

  { type: "h2", text: "Seguridad de la información" },
  { type: "p", text: "Dolce adopta medidas administrativas, técnicas y organizacionales razonables para proteger los datos personales frente al acceso no autorizado, pérdida, alteración, divulgación o uso indebido." },
  { type: "p", text: "No obstante, ningún sistema de transmisión o almacenamiento de información es completamente seguro, por lo que Dolce no puede garantizar una seguridad absoluta." },

  { type: "h2", text: "Modificaciones a esta política" },
  { type: "p", text: "Dolce podrá modificar la presente Política de Privacidad en cualquier momento para adaptarla a cambios normativos, operativos o tecnológicos." },
  { type: "p", text: "Las modificaciones entrarán en vigencia desde su publicación en el sitio web." },
];

function LegalBlocks({ blocks }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "ul") {
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{b.text}</p>;
      })}
    </>
  );
}

export default function PoliticaDePrivacidadPage() {
 const [menuOpen, setMenuOpen] = useState(false);
  const [dudasOpen, setDudasOpen] = useState(false);
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
        .mobile-dudas { display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; }
        .mobile-dudas-icon { transition: transform .25s; }
        .mobile-dudas-icon.open { transform: rotate(180deg); }
        .mobile-sublink { font-size: 14px !important; opacity: .75; }
        .mobile-menu a { color: inherit; text-decoration: none; }
        .mobile-close { position:absolute; top:24px; right:6vw; background:none; border:none; cursor:pointer; color:var(--olive); }

        .page-header { padding: 46px 6vw 10px; text-align:center; }
        .breadcrumbs { font-size: 12.5px; color: var(--taupe); margin-bottom: 14px; }
        .breadcrumbs .active { color: var(--olive); }
        .breadcrumbs a { color: var(--taupe); text-decoration: none; }
        .page-header h1 { font-size: 28px; font-weight: 400; color: var(--olive); margin: 0 0 8px; }
        .page-header p { font-size: 13px; color: var(--taupe); }

        .legal-wrap { max-width: 760px; margin: 20px auto 0; padding: 0 6vw 80px; }
        .legal-wrap h2 { font-size: 18px; font-weight: 400; color: var(--ink); margin: 34px 0 12px; }
        .legal-wrap p { font-size: 14px; line-height: 1.8; color: var(--olive); opacity: .92; margin: 0 0 14px; }
        .legal-wrap ul { margin: 0 0 14px; padding-left: 20px; }
        .legal-wrap li { font-size: 14px; line-height: 1.8; color: var(--olive); opacity: .92; margin-bottom: 6px; }

        .legal-table { border: 1px solid var(--tan); border-radius: 10px; overflow: hidden; margin: 0 0 20px; }
        .legal-table-row { display:flex; border-bottom: 1px solid var(--tan); }
        .legal-table-row:last-child { border-bottom: none; }
        .legal-table-row span:first-child { flex: 0 0 150px; background: var(--cream); padding: 10px 14px; font-size: 13px; color: var(--ink); }
        .legal-table-row span:last-child { flex: 1; padding: 10px 14px; font-size: 13px; color: var(--olive); }

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

      <div className="page-header">
        <p className="breadcrumbs"><Link href="/">Inicio</Link> <span>.</span> <span className="active">Política de Privacidad</span></p>
        <h1>Política de Privacidad</h1>
        <p>Última actualización: 7 de agosto de 2026</p>
      </div>

      <div className="legal-wrap">
        <LegalBlocks blocks={CONTENT_TOP} />

        <div className="legal-table">
          {RESPONSABLE_TABLE.map(([label, value]) => (
            <div className="legal-table-row" key={label}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <LegalBlocks blocks={CONTENT_BOTTOM} />
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
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}