"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import SearchOverlay from "../components/SearchOverlay";
import {
  ShoppingBag, Menu, X, Search, User, MessageCircle, AtSign, Phone, Mail,
} from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

function ContactIllustration() {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <img
      src="/contacto/ilustracion-1.jpg"
      alt="Dolce Giftbox — armando un detalle con cariño"
      className="contact-illustration"
      onError={() => setError(true)}
    />
  );
}

export default function ContactoPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
const { totalCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notRobot, setNotRobot] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notRobot) return;
    setSent(true);
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

        .page-header { padding: 40px 6vw 10px; text-align:center; }
        .breadcrumbs { font-size: 12.5px; color: var(--taupe); margin-bottom: 14px; }
        .breadcrumbs .active { color: var(--olive); }
        .page-header h1 { font-size: 26px; font-weight: 400; color: var(--olive); margin: 0 0 22px; }

        .contact-layout { display:flex; gap: 48px; max-width: 1100px; margin: 0 auto; padding: 10px 6vw 20px; align-items: flex-start; }
        .contact-left { flex: 1; min-width: 280px; position: sticky; top: 100px; }
        .contact-right { flex: 1.2; min-width: 320px; }
        .contact-hero { border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(146,122,93,0.18); }
        .contact-illustration { width: 100%; display: block; aspect-ratio: 1/1; object-fit: cover; }

        @media (max-width: 800px) {
          .contact-layout { flex-direction: column; }
          .contact-left { position: static; }
        }

        .intro { font-size: 15px; line-height: 1.8; color: var(--olive); opacity: .9; margin: 0 0 24px; }

        .contact-rows { display:flex; flex-direction:column; gap: 14px; align-items:flex-start; margin-bottom: 32px; }
        .contact-row { display:flex; align-items:center; gap: 10px; font-size: 15px; color: var(--olive); text-decoration:none; }
        .contact-row:hover { text-decoration: underline; }

        .form-wrap { margin: 0; padding: 0; }
        .form-group { margin-bottom: 22px; text-align: left; }
        .form-group label { display:block; font-size: 14px; color: var(--olive); margin-bottom: 8px; }
        .form-group input, .form-group textarea {
          width: 100%; border: 1px solid var(--tan); border-radius: 8px; padding: 12px 14px;
          font-family:'Marcellus'; font-size: 14px; color: var(--ink); background: var(--white);
        }
        .form-group textarea { min-height: 110px; resize: vertical; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--olive); }

        .robot-check { display:flex; align-items:center; gap: 10px; border: 1px solid var(--tan); border-radius: 8px;
          padding: 14px 16px; margin-bottom: 24px; font-size: 14px; color: var(--ink); background: var(--cream); }
        .robot-check input { width: 18px; height: 18px; }

        .btn-submit { width: 100%; background: var(--taupe); color: var(--white); border:none; padding: 14px;
          border-radius: 8px; font-family:'Marcellus'; font-size: 15px; letter-spacing: 0.5px; cursor:pointer; transition: background .25s; }
        .btn-submit:hover { background: var(--olive); }
        .btn-submit:disabled { opacity: .5; cursor: not-allowed; }

        .sent-note { text-align:center; font-size: 14px; color: var(--olive); margin-top: 16px; }
        .note-small { font-size: 12.5px; color: var(--taupe); text-align:center; margin-top: 14px; line-height: 1.6; }

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

      <div className="page-header">
        <p className="breadcrumbs">Inicio <span>.</span> <span className="active">Contacto</span></p>
        <h1>Contacto</h1>
      </div>

      <div className="contact-layout">
        <div className="contact-left">
          <div className="contact-hero">
            <ContactIllustration />
          </div>
        </div>

        <div className="contact-right">
          <p className="intro">
            Si deseas algún cambio o personalizar tu producto escríbenos directamente por WhatsApp,
            con mucho gusto te ayudaremos a armar la cajita a tu gusto.
          </p>

          <div className="contact-rows">
            <a className="contact-row" href="https://wa.me/573113290390" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} /> 57 311 329 0390
            </a>
            <a className="contact-row" href="tel:3113290390">
              <Phone size={17} /> 311 329 0390
            </a>
            <a className="contact-row" href="mailto:dolcegiftboxcolombia@gmail.com">
              <Mail size={17} /> dolcegiftboxcolombia@gmail.com
            </a>
          </div>

          <div className="form-wrap">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" placeholder="ej.: María Perez" value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="ej.: tuemail@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="ej.: 1123445567" value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Mensaje</label>
                <textarea placeholder="ej.: Tu mensaje" value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })} required />
              </div>

              <label className="robot-check">
                <input type="checkbox" checked={notRobot} onChange={(e) => setNotRobot(e.target.checked)} />
                No soy un robot
              </label>

              <button type="submit" className="btn-submit" disabled={!notRobot}>Enviar</button>

              {sent && <p className="sent-note">¡Gracias! Cuando conectemos el envío real, tu mensaje llegará aquí.</p>}
              <p className="note-small">
                Este formulario todavía no envía correos de verdad — falta conectarlo a un servicio de envío
                (lo hacemos en la parte de infraestructura del proyecto).
              </p>
            </form>
          </div>
        </div>
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