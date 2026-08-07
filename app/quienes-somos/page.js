"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import SearchOverlay from "../components/SearchOverlay";
import {
  ShoppingBag, Menu, X, Search, User, MessageCircle, AtSign, ImageIcon,
} from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

function ImageBox({ ratio = "1 / 1", label = "Imagen pendiente", className = "" }) {
  return (
    <div className={`img-placeholder ${className}`} style={{ aspectRatio: ratio }}>
      <ImageIcon size={28} strokeWidth={1.3} />
      <span>{label}</span>
    </div>
  );
}

function StoryPhoto({ index, alt, label, className = "" }) {
  const [error, setError] = useState(false);
  if (error) {
    return <ImageBox ratio="4 / 5" label={label} className={className} />;
  }
  return (
    <img
      src={`/quienes-somos/historia-${index}.jpg`}
      alt={alt}
      className={`story-photo ${className}`}
      onError={() => setError(true)}
    />
  );
}

export default function QuienesSomosPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
const { totalCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        .nav-links li { font-size: 14px; cursor:pointer; position:relative; padding-bottom:4px; color: var(--olive); }
        .nav-links li::after { content:''; position:absolute; left:0; bottom:0; width:0; height:1px; background:var(--olive); transition:width .3s; }
        .nav-links li:hover::after { width:100%; }
        .nav-links a, .footer-nav a { color: inherit; text-decoration: none; }
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

        .story-wrap { max-width: 980px; margin: 0 auto; padding: 46px 6vw 80px; text-align:center; }
        .story-wrap h1 { font-size: 28px; font-weight: 400; color: var(--olive); margin: 0 0 34px; }
        .story-wrap p { font-size: 15.5px; line-height: 1.85; color: var(--olive); opacity: .92; margin: 0 0 24px; }

        .img-placeholder { width:100%; aspect-ratio: 4 / 5; border-radius: 16px; border: 1.5px dashed var(--taupe);
          background: var(--cream); display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:8px; color: var(--olive); opacity:0.75; text-align:center; padding: 14px; }
        .img-placeholder span { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }

        .story-hero { max-width: 640px; margin: 30px auto 40px; border-radius: 20px; overflow: hidden;
          box-shadow: 0 12px 30px rgba(146,122,93,0.18); }
        .story-photo { width: 100%; display: block; object-fit: cover; }
        .story-hero .story-photo { aspect-ratio: 16 / 9; }
        .story-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 640px; margin: 40px auto; }
        .story-grid .story-photo { aspect-ratio: 4 / 5; border-radius: 16px; }
        @media (max-width: 600px) {
          .story-grid { grid-template-columns: 1fr; }
        }

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
            <li><Link href="/productos">Detalles prediseñados</Link></li>
            <li><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
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
            <li onClick={() => setMenuOpen(false)}><Link href="/productos">Detalles prediseñados</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/contacto">Contacto</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/quienes-somos">Quiénes Somos</Link></li>
          </ul>
        </div>
      )}

      <div className="story-wrap">
        <h1>Quiénes Somos</h1>

        <p>Dolce Gift Box es un proyecto que nace de un gran sueño y anhelo para emprender.</p>

        <div className="story-hero">
          <StoryPhoto index={1} alt="Dolce Giftbox — nuestra historia" label="Foto principal" />
        </div>

        <p>
          Nuestra idea se basa en la necesidad de fomentar el comercio colombiano, pues nos apasiona
          encontrar nuevos proyectos y emprendimientos que pueden ser opción y motivos de regalos
          especiales, además dando un plus de que por la compra de cada detalle no solo apoyas lo local,
          también el medio ambiente, ya que al elegir los productos para nuestras cajas tenemos muy
          presente que deben de ser productos ecoamigables. Desde la creación de nuestra primera caja de
          regalo en noviembre del año 2020 incluimos emprendimientos colombianos ecofriendly.
        </p>

        <div className="story-grid">
          <StoryPhoto index={2} alt="Dolce Giftbox — proceso artesanal" label="Foto 2" />
          <StoryPhoto index={3} alt="Dolce Giftbox — emprendimientos locales" label="Foto 3" />
        </div>

        <p>Cada marca colombiana compone a Dolce, pues sin ellas no podríamos estar donde estamos.</p>

        <p>
          En Dolce encontrarás artículos elaborados por manos artesanas de nuestro país, hechos bajo
          conciencia, con el propósito de brindarte la mejor experiencia cuidando el medio ambiente,
          trabajamos con todo el amor y poniendo atención en cada pequeño detalle para que sorprendas
          en grande.
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}