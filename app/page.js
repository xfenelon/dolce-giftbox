"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CartDrawer from "./components/CartDrawer";
import CartToast from "./components/CartToast";
import SearchOverlay from "./components/SearchOverlay";
import { useCart } from "./context/CartContext";
import { getProductBySlug, CATEGORIES as PRODUCT_CATEGORIES } from "./data/products";
import {
  ShoppingBag, Menu, X, Search, User, ChevronLeft, ChevronRight, ChevronDown,
  ImageIcon, AtSign, Minus, Plus, MessageCircle, Share2,
} from "lucide-react";

/* ---------- Brand tokens ----------
  Colors match the live site's CSS variables exactly:
  --white  #FFFFFF   (main background, like the live reference)
  --cream  #F4EAE1   --blush  #F4E2DF   --tan #CEBAA7
  --taupe  #BBA083   --olive  #927A5D   (also used as main text color, like the live site)
  Font: 'Marcellus' -> real site-wide font, free on Google Fonts.
--------------------------------------- */

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

function ExperiencePhoto() {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <img
      src="/experiencia.png"
      alt="Ilustración Dolce Giftbox"
      className="experience-photo-img"
      onError={() => setError(true)}
    />
  );
}

function StepBadge({ icon, label, number }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <>
        <div className="step-circle">{number}</div>
        <p>{label}</p>
      </>
    );
  }
  return <img src={`/como-comprar/${icon}.png`} alt={label} className="step-badge" onError={() => setError(true)} />;
}

function ImageBox({ ratio = "1 / 1", label = "Imagen pendiente", className = "" }) {
  return (
    <div className={`img-placeholder ${className}`} style={{ aspectRatio: ratio }}>
      <ImageIcon size={26} strokeWidth={1.3} />
      <span>{label}</span>
    </div>
  );
}
const HERO_SLIDES = [
  { index: 1, href: "/productos?categoria=Beb%C3%A9" },
  { index: 2, href: "/productos?categoria=Ramo%20de%20flores%20naturales" },
  { index: 3, href: "/productos?categoria=Para%20mujer" },
  { index: 4, href: "/productos?categoria=Para%20hombre" },
  { index: 5, href: "/productos" },
];

const FEATURED_BOXES = [
  { slug: "bianca", name: "Bianca" },
  { slug: "moonlight", name: "Moonlight" },
  { slug: "luna", name: "Luna" },
  { slug: "florecer", name: "Florecer" },
];

function FeaturedBoxPhoto({ slug, alt }) {
  const [error, setError] = useState(false);
  if (error) {
    return <ImageBox ratio="4 / 5" label={alt} />;
  }
  return (
    <img
      src={`/productos/${slug}-1.jpg`}
      alt={alt}
      className="featured-box-photo"
      onError={() => setError(true)}
    />
  );
}

function FeaturedBoxesCarousel() {
  const count = FEATURED_BOXES.length;
  const positions = count - 1;
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % positions);
    }, 2800);
    return () => clearInterval(interval);
  }, [positions]);

  return (
    <section className="section featured-carousel-section">
      <Reveal><h2 className="section-title display" style={{ textAlign: "center" }}>Algunos de nuestros detalles</h2></Reveal>
      <Reveal delay={80}>
        <div className="featured-carousel-frame">
          <div
            className="featured-carousel-track"
            style={{ transform: `translateX(-${index * (100 / count)}%)` }}
          >
            {FEATURED_BOXES.map((box) => (
              <Link href={`/productos/${box.slug}`} className="featured-carousel-slide" key={box.slug}>
                <FeaturedBoxPhoto slug={box.slug} alt={box.name} />
                <p className="featured-carousel-name">{box.name}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="featured-carousel-dots">
          {Array.from({ length: positions }).map((_, i) => (
            <span
              key={i}
              className={`featured-carousel-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function HeroPhoto({ index, alt, label }) {
  const [error, setError] = useState(false);
  if (error) {
    return <ImageBox ratio="16 / 8" label={label} />;
  }
  return (
    <img
      src={`/hero/inicio-${index}.jpg`}
      alt={alt}
      className="hero-photo"
      onError={() => setError(true)}
    />
  );
}
function FeaturedPhoto({ slug, alt, label }) {
  const [error, setError] = useState(false);
  if (error) {
    return <ImageBox ratio="4 / 3.6" label={label} />;
  }
  return (
    <img
      src={`/productos/${slug}-1.jpg`}
      alt={alt}
      className="featured-photo"
      onError={() => setError(true)}
    />
  );
}
function CategoryPhoto({ slug, alt, label }) {
  const [error, setError] = useState(false);
  if (error) {
    return <ImageBox ratio="4 / 3" label={label} />;
  }
  return (
    <img
      src={`/productos/${slug}-1.jpg`}
      alt={alt}
      className="category-photo"
      onError={() => setError(true)}
    />
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const PRODUCTS = [
  { id: 1, name: "Remmy", price: "$144.600" },
  { id: 2, name: "Mist", price: "$145.700" },
  { id: 3, name: "Alicia", price: "$146.400" },
  { id: 4, name: "Gratitude", price: "$174.500" },
  { id: 5, name: "Bib", price: "$171.000" },
  { id: 6, name: "Peach", price: "$176.900" },
  { id: 7, name: "Delicate", price: "$171.000" },
  { id: 8, name: "Wellness", price: "$163.400" },
];

const STEPS = [
  { text: "Añade el detalle al carrito", icon: "anade-carrito" },
  { text: "Completa los datos", icon: "completa-datos" },
  { text: "Realiza el pago", icon: "realiza-pago" },
  { text: "Recibe la confirmación", icon: "recibe-confirmacion" },
  { text: "Recibe el detalle", icon: "recibe-detalle" },
];

const CATEGORIES = [
  { title: "Bebé", desc: "Perfectos para baby showers y bienvenida a bebés", photoSlug: "alicia" },
  { title: "Cumpleaños mujer", desc: "Sorprende en grande en su día especial", photoSlug: "gratitude" },
  { title: "Cumpleaños hombre", desc: "Un detalle para celebrarlo por todo lo alto", photoSlug: "classic" },
  { title: "Para mujer", desc: "Alegra el día de esa mujer tan especial", photoSlug: "bianca" },
  { title: "Para hombre", desc: "Un hermoso detalle para ese hombre especial en tu vida", photoSlug: "luna" },
  { title: "Recuperación/Condolencias", desc: "Acompaña con cariño en momentos difíciles", photoSlug: "bienestar" },
  { title: "Ramo de flores naturales", desc: "Ramos frescos de exportación para cualquier ocasión", photoSlug: "florecer" },
];
const TESTIMONIALS = [
  {
    quote:
      "Quiero felicitarlos por el producto que manejan, me quede sorprendida porque es tal cual como se ve en el catálogo y era demasiado hermoso y ordenado, cuidaron cada detalle y tienen un gusto muy lindo para la decoración, yo quedé fascinada con la compra y mi hermana estaba super feliz, la entrega super puntual y el servicio excelente",
    name: "Jenny Juliana",
  },
  {
    quote:
      "Los felicito, que página tan hermosa, la atención excelente y el regalo ni decir, muchas gracias, me salvaron la vida porque tenía ese regalito pendiente para hoy y lo hicieron muy rápido y muy lindo",
    name: "Mariana",
  },
  {
    quote:
      "Gracias por tenernos al tanto del proceso, no sólo venden productos hermosos, sino que brindan una experiencia tanto a quien recibe como a quien compra",
    name: "Liliana Cortés",
  },
];

export default function DolceGiftboxHome() {
  const [menuOpen, setMenuOpen] = useState(false);
 const [dudasOpen, setDudasOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
const { addItem, totalCount } = useCart();
const featured = getProductBySlug("bianca");
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
    const [ribbon, setRibbon] = useState("Blanco");
  const [showPackaging, setShowPackaging] = useState(false);
  const [qty, setQty] = useState(1);
  const [testiIndex, setTestiIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(1);
  const nextHero = () => setHeroIndex((i) => (i % HERO_SLIDES.length) + 1);
  const prevHero = () => setHeroIndex((i) => ((i + HERO_SLIDES.length - 2) % HERO_SLIDES.length) + 1);
useEffect(() => {
    const interval = setInterval(() => {
     setHeroIndex((i) => (i % HERO_SLIDES.length) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const testi = TESTIMONIALS[testiIndex];
  const nextTesti = () => setTestiIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prevTesti = () => setTestiIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="dolce-root">
      <style>{`
        ${FONT_IMPORT}
        .dolce-root {
          --white:#FFFFFF; --cream:#F4EAE1; --blush:#F4E2DF; --tan:#CEBAA7; --taupe:#BBA083; --olive:#927A5D; --ink:#4A3A2C;
          background: var(--white); color: var(--olive); font-family:'Marcellus', serif; overflow-x:hidden;
        }
        .dolce-root * { box-sizing: border-box; }
        .display { font-family:'Marcellus', serif; }

        @media (prefers-reduced-motion: reduce) {
          .dolce-root *, .dolce-root *::before, .dolce-root *::after { animation-duration:.001ms!important; transition-duration:.001ms!important; }
        }

        .announce {
          background: var(--blush); text-align:center; padding: 9px 16px;
          font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--olive);
        }

        .navbar { position: sticky; top:0; z-index:40; display:flex; align-items:center; justify-content:space-between;
          padding: 18px 6vw; background: rgba(255,255,255,0.94); backdrop-filter: blur(8px);
          border-bottom: 1px solid transparent; transition: box-shadow .3s, padding .3s, border-color .3s; }
        .navbar.scrolled { box-shadow: 0 6px 20px rgba(74,58,44,0.08); border-color: var(--tan); padding: 10px 6vw; }
        .navbar-left { display:flex; align-items:center; gap: 48px; }
        .brand { display:flex; flex-direction:column; line-height:1; }
        .brand-word { font-size: 28px; color: var(--olive); }
        .brand-sub { font-size: 9px; letter-spacing: 4px; color: var(--taupe); margin-top:2px; }
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
        .nav-links a, .footer-nav a { color: inherit; text-decoration: none; }
        .nav-links li::after { content:''; position:absolute; left:0; bottom:0; width:0; height:1px; background:var(--olive); transition:width .3s; }
        .nav-links li:hover::after { width:100%; }
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
        .mobile-close { position:absolute; top:24px; right:6vw; background:none; border:none; cursor:pointer; color:var(--olive); }

        .img-placeholder {
          width:100%; border-radius: 16px; border: 1.5px dashed var(--taupe); background: var(--cream);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
          color: var(--olive); opacity:0.75; text-align:center; padding: 12px;
        }
        .img-placeholder span { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }

        .product-photo { width:100%; border-radius: 12px; object-fit: cover; display:block; }
        .hero { position:relative; padding: 46px 6vw 30px; max-width: 1400px; margin: 0 auto; }
        .hero-frame { position: relative; border-radius: 24px; overflow: hidden; }
        .hero-track { display: flex; transition: transform .6s cubic-bezier(0.65, 0, 0.35, 1); }
        .hero-slide { flex: 0 0 100%; min-width: 0; display: block; }
        .hero-frame .img-placeholder { aspect-ratio: 16/8; border-radius: 0; }
        .hero-frame .hero-photo { width:100%; aspect-ratio: 16 / 8; object-fit: cover; display:block; }
        .pd-main .featured-photo { width: 100%; aspect-ratio: 4 / 3.6; object-fit: cover; border-radius: 16px; display: block; }
        @keyframes heroFade { from { opacity: 0; } to { opacity: 1; } }
        .hero-quote {
          position:absolute; top: 12%; left: 6%; max-width: 320px; background: rgba(255,255,255,0.92);
          border: 1px solid var(--tan); border-radius: 14px; padding: 18px 22px; font-family:'Marcellus';
          font-size: 17px; font-style: italic; color: var(--olive); line-height: 1.5;
        }
        .hero-cta { position:absolute; left: 6%; bottom: 12%; max-width: 340px; }
        .hero-cta h2 { font-size: clamp(30px, 4vw, 44px); color: var(--olive); margin: 0 0 18px; line-height:1.1; }
        .btn-primary { background: var(--olive); color: var(--white); border:none; padding: 14px 32px;
          font-family:'Marcellus'; font-size: 14px; letter-spacing: 1px; border-radius: 999px; cursor:pointer;
          transition: transform .25s, box-shadow .25s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(146,122,93,0.3); }
        .btn-ghost { background:none; border:1px solid var(--taupe); color:var(--olive); padding:13px 28px;
          font-family:'Marcellus'; font-size:14px; letter-spacing:0.5px; border-radius:999px; cursor:pointer; transition:background .25s; }
        .btn-ghost:hover { background: var(--cream); }
        .carousel-nav { display:flex; align-items:center; justify-content:center; gap:16px; margin-top:16px; color: var(--olive); }
        .carousel-nav button { background:none; border:none; cursor:pointer; color: var(--olive); display:flex; }
        .carousel-nav span { font-size: 13px; letter-spacing: 1px; }

        .section { padding: 70px 6vw; }
        .section-narrow { max-width: 760px; margin: 0 auto; text-align:center; }
        .eyebrow { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--taupe); margin-bottom: 14px; }
        .section p.body-text { line-height: 1.85; font-size: 15.5px; color: var(--olive); opacity: 0.9; margin-bottom: 26px; }
        .section h2.section-title { font-size: clamp(26px, 3.4vw, 38px); color: var(--olive); margin: 0 0 14px; line-height:1.3; font-weight:400; }
        .link-underline { color: var(--olive); text-decoration: underline; text-underline-offset: 4px; font-size: 14px; cursor:pointer; }

        .section-head-row { display:flex; align-items:baseline; justify-content:center; margin-bottom: 34px; }
        .section-head-row h2 { font-family:'Marcellus'; font-size: 30px; color: var(--olive); margin:0; font-weight:400; }
        .product-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .product-card { text-align:center; }
        .product-card .img-placeholder { aspect-ratio: 1/1; margin-bottom: 14px; transition: transform .3s; }
        .product-card:hover .img-placeholder { transform: translateY(-4px); }
        .product-card h3 { font-family:'Marcellus'; font-size: 18px; color: var(--olive); margin: 0 0 4px; font-weight: 400; }
        .product-card p { font-size: 13.5px; color: var(--taupe); margin: 0; }
        .products-note { text-align:center; margin-top: 30px; color: var(--taupe); font-size: 13px; letter-spacing: 0.5px; }

        .steps-row { display:flex; align-items:flex-start; justify-content:space-between; gap: 8px; flex-wrap: wrap; }
        .step-item { flex:1; min-width: 130px; text-align:center; }
        .step-circle { width:96px; height:96px; border-radius:50%; background:var(--cream); border:1px solid var(--tan);
          display:flex; align-items:center; justify-content:center; margin: 0 auto 16px; color: var(--olive); font-family:'Marcellus'; font-size:26px; }
        .step-badge { width: 180px; max-width: 100%; height: auto; display:block; margin: 0 auto; }
        .step-item p { font-size: 14px; color: var(--olive); line-height:1.4; margin:0; }
        .step-arrow { align-self: center; color: var(--tan); margin-top: 40px; }

        .experience { display:flex; align-items:center; gap: 48px; flex-wrap: wrap; text-align:left; }
        .experience-text { flex: 1; min-width: 280px; }
        .experience-photo { flex: 1; min-width: 240px; max-width: 380px; margin: 0 auto; }
        .experience-photo-img { width: 100%; height: auto; display:block; }
        .experience .eyebrow { color: var(--olive); }
        .experience h2 { font-family:'Marcellus'; font-size: clamp(24px,3.2vw,32px); color: var(--olive);
          max-width: 720px; margin: 0 auto; line-height: 1.4; font-weight:400; }

        .featured-carousel-section { text-align: center; }
        .featured-carousel-frame { max-width: 720px; margin: 0 auto; overflow: hidden; border-radius: 18px; }
        .featured-carousel-track { display: flex; width: 200%; transition: transform .7s cubic-bezier(0.65, 0, 0.35, 1); }
        .featured-carousel-slide { width: 25%; flex-shrink: 0; padding: 0 8px; text-decoration: none; color: inherit; display: block; }
        .featured-box-photo { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; display: block; border-radius: 14px; box-shadow: 0 10px 26px rgba(74,58,44,0.15); }
        .featured-carousel-name { margin-top: 12px; font-family: 'Marcellus', serif; font-size: 16px; color: var(--olive); }
        .featured-carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 18px; }
        .featured-carousel-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--tan); cursor: pointer; transition: background .2s; border: none; padding: 0; }
        .featured-carousel-dot.active { background: var(--olive); }

        .categories-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .category-card { text-align:center; }
        .category-card .img-placeholder { aspect-ratio: 4/3; margin-bottom: 16px; }
        .category-card .category-photo { width:100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 12px; margin-bottom: 16px; display:block; }
        .category-card h3 { font-family:'Marcellus'; font-size: 21px; color: var(--olive); margin: 0 0 8px; font-weight:400; }
        .category-card p { font-size: 13.5px; color: var(--olive); opacity: .8; margin: 0 0 10px; line-height: 1.5; }

        .testimonios { text-align:center; }
        .testimonios h2.section-title { margin-bottom: 34px; }
        .testi-quote { max-width: 640px; margin: 0 auto; font-family:'Marcellus'; font-style: italic; font-size: 17px;
          color: var(--olive); opacity: .9; line-height: 1.8; min-height: 140px; }
        .testi-name { margin-top: 18px; color: var(--olive); font-size: 14px; letter-spacing: 1px; font-weight:600; }
        .testi-nav { display:flex; justify-content:center; align-items:center; gap:24px; margin-top: 22px; }
        .testi-nav button { background:none; border:none; color: var(--olive); cursor:pointer; }
        .testi-dots { display:flex; gap:6px; }
        .testi-dot { width:6px; height:6px; border-radius:50%; background: var(--tan); }
        .testi-dot.active { background: var(--olive); }

        .product-detail { display:flex; gap: 46px; align-items:flex-start; flex-wrap: wrap; }
        .pd-gallery { display:flex; gap: 12px; width: 100px; flex-direction: column; }
        .pd-gallery .img-placeholder { aspect-ratio: 1/1; }
        .pd-main { flex: 1; min-width: 260px; position: relative; }
                .packaging-badge { position: absolute; bottom: 6px; right: 6px; width: 40px; height: 40px; border-radius: 8px;
          object-fit: cover; border: 2px solid var(--white); box-shadow: 0 2px 6px rgba(74,58,44,0.25); z-index: 2;
          cursor: pointer; transition: transform .2s; }
        .packaging-badge:hover { transform: scale(1.1); }
        .pd-main .img-placeholder { aspect-ratio: 4/3.6; }
        .pd-info { flex: 1; min-width: 280px; }
        .pd-info h3 { font-family:'Marcellus'; font-size: 28px; color: var(--olive); margin: 0 0 8px; font-weight:400; }
        .pd-price { font-size: 20px; color: var(--olive); margin-bottom: 4px; }
        .pd-installments { font-size: 13px; color: var(--taupe); margin-bottom: 22px; }
        .pd-label { font-size: 13.5px; margin-bottom: 10px; color: var(--olive); }
        .ribbon-options { display:flex; gap: 10px; margin-bottom: 24px; }
.ribbon-reference { width: 180px; max-width: 100%; border-radius: 10px; display: block; margin: -4px 0 20px; }        
        .ribbon-chip { border: 1px solid var(--taupe); background: none; padding: 8px 18px; border-radius: 8px;
          font-family:'Marcellus'; font-size: 13px; cursor:pointer; color: var(--olive); transition: all .2s; }
        .ribbon-chip.active { border-color: var(--olive); background: var(--cream); color: var(--olive); }
        .qty-row { display:flex; align-items:center; gap: 18px; margin-bottom: 12px; }
        .qty-control { display:flex; align-items:center; border:1px solid var(--tan); border-radius: 999px; overflow:hidden; }
        .qty-control button { background:none; border:none; padding: 10px 14px; cursor:pointer; color: var(--olive); }
        .qty-control span { padding: 0 10px; font-size: 14px; color: var(--olive); }
        .btn-add-cart { flex:1; background: var(--taupe); color: var(--white); border:none; padding: 14px 30px; border-radius: 999px;
          font-family:'Marcellus'; font-size: 14px; letter-spacing: 0.5px; cursor:pointer; transition: background .25s; }
        .btn-add-cart:hover { background: var(--olive); }
        .pd-min { font-size: 12px; color: var(--taupe); margin-bottom: 22px; }
        .pd-bullets { list-style:none; padding:0; margin: 0 0 12px; }
        .pd-bullets li { font-size: 14px; color: var(--olive); opacity:.9; margin-bottom: 10px; line-height:1.5; }

        .reveal { opacity:0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
        .reveal-visible { opacity:1; transform: translateY(0); }

        .footer { background: var(--blush); color: var(--olive); padding: 50px 6vw 26px; text-align:center; }
        .footer-icon { margin-bottom: 26px; display:flex; justify-content:center; color: var(--olive); }
        .footer-nav { display:flex; justify-content:center; gap: 28px; list-style:none; padding:0; margin: 0 0 26px; flex-wrap: wrap; }
        .footer-nav li { font-size: 14px; cursor:pointer; opacity:.9; color: var(--olive); }
        .footer-contact p { font-size: 14px; opacity: .9; margin: 6px 0; color: var(--olive); }
        .payment-row { display:flex; justify-content:center; gap: 10px; margin: 26px 0; flex-wrap: wrap; }
        .payment-chip { background: rgba(146,122,93,0.08); border:1px solid rgba(146,122,93,0.3); color: var(--olive); border-radius: 6px;
          padding: 6px 12px; font-size: 11px; letter-spacing: 0.5px; }
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
          .product-grid { grid-template-columns: repeat(2, 1fr); }
          .categories-grid { grid-template-columns: 1fr; }
          .experience { flex-direction: column-reverse; text-align:center; }
          .hero-quote { position: static; max-width: 100%; margin-bottom: 14px; }
          .hero-cta { position: static; max-width: 100%; }
          .hero-frame { display:flex; flex-direction: column-reverse; }
          .steps-row { flex-direction: column; align-items:center; }
          .step-arrow { display:none; }
          .product-detail { flex-direction: column; }
          .pd-gallery { flex-direction: row; width: 100%; }
        }
        @media (max-width: 480px) {
          .product-grid { grid-template-columns: 1fr; }
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
                {PRODUCT_CATEGORIES.map((cat) => (
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
  <section className="hero">
 <div className="hero-frame">
    <div className="hero-track" style={{ transform: `translateX(-${(heroIndex - 1) * 100}%)` }}>
      {HERO_SLIDES.map((slide) => (
        <Link href={slide.href} className="hero-slide" key={slide.index}>
          <HeroPhoto index={slide.index} alt="Dolce Giftbox" label={`Foto hero ${slide.index}`} />
        </Link>
      ))}
    </div>
  </div>
  <div className="carousel-nav">
    <button aria-label="Anterior" onClick={prevHero}><ChevronLeft size={18} /></button>
    <span>{heroIndex} / {HERO_SLIDES.length}</span>
    <button aria-label="Siguiente" onClick={nextHero}><ChevronRight size={18} /></button>
  </div>
</section>

     
    <FeaturedBoxesCarousel />

      <section className="section">
        <Reveal><h2 className="section-title display" style={{ textAlign: "center" }}>¿Cómo comprar?</h2></Reveal>
        <div className="steps-row">
         {STEPS.map((s, i) => (
            <React.Fragment key={s.text}>
              <Reveal delay={i * 70} className="step-item">
                <StepBadge icon={s.icon} label={s.text} number={i + 1} />
              </Reveal>
              {i < STEPS.length - 1 && <span className="step-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

     <Reveal>
        <section className="section experience">
          <div className="experience-text">
            <p className="eyebrow">Más que un regalo, somos toda una experiencia</p>
            <h2>Cuando de dar detalles con significado se trate, no pienses en regalos, piensa en Dolce Gift Box</h2>
          </div>
          <div className="experience-photo">
            <ExperiencePhoto />
          </div>
        </section>
      </Reveal>

      <section className="section">
        <Reveal><div className="section-head-row"><h2>Nuestras categorías</h2></div></Reveal>
        <div className="categories-grid">
  {CATEGORIES.map((c, i) => (
    <Reveal key={c.title} delay={i * 70}>
      <Link href={`/productos?categoria=${encodeURIComponent(c.title)}`} className="category-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        <CategoryPhoto slug={c.photoSlug} alt={c.title} label={c.title} />
        <h3 className="display">{c.title}</h3>
        <p>{c.desc}</p>
        <span className="link-underline">Ver más</span>
      </Link>
    </Reveal>
  ))}
</div>
      </section>

      <section className="section testimonios">
        <Reveal><h2 className="section-title display">Testimonios</h2></Reveal>
        <Reveal delay={100}>
          <p className="testi-quote">"{testi.quote}"</p>
          <p className="testi-name">{testi.name}</p>
          <div className="testi-nav">
            <button aria-label="Anterior" onClick={prevTesti}><ChevronLeft size={18} /></button>
            <div className="testi-dots">
              {TESTIMONIALS.map((_, i) => (
                <span key={i} className={`testi-dot ${i === testiIndex ? "active" : ""}`} />
              ))}
            </div>
            <button aria-label="Siguiente" onClick={nextTesti}><ChevronRight size={18} /></button>
          </div>
        </Reveal>
      </section>
<Reveal>
  <section className="section product-detail">
       <div className="pd-main">
      {showPackaging && featured.packaging ? (
        <img src={`/empaques/${featured.packaging.photo}.jpg`} alt={featured.packaging.name} className="featured-photo" />
      ) : (
        <FeaturedPhoto slug={featured.slug} alt={featured.name} label={featured.name} />
      )}
            {featured.packaging && (
        <img
          src={showPackaging ? `/productos/${featured.slug}-1.jpg` : `/empaques/${featured.packaging.photo}.jpg`}
          alt={showPackaging ? featured.name : featured.packaging.name}
          className="packaging-badge"
          role="button"
          tabIndex={0}
          onClick={() => setShowPackaging((v) => !v)}
        />
      )}
    </div>
    <div className="pd-info">
      <h3>{featured.name}</h3>
      <p className="pd-price">{featured.priceLabel}</p>
      <p className="pd-installments">{featured.installmentLabel}</p>
      <p className="pd-label">Color del listón para la cajita: {ribbon}</p>
      <div className="ribbon-options">
        {["Blanco", "Café", "Rosa Palo"].map((c) => (
          <button key={c} className={`ribbon-chip ${ribbon === c ? "active" : ""}`} onClick={() => setRibbon(c)}>{c}</button>
        ))}
      </div>
      <img src="/liston-referencia.jpg" alt="Colores de listón disponibles: café, blanco y palo rosa" className="ribbon-reference" />
      <div className="qty-row">
        <div className="qty-control">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos"><Minus size={14} /></button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Más"><Plus size={14} /></button>
        </div>
        <button
          className="btn-add-cart"
          onClick={() =>
            addItem({
              slug: featured.slug,
              name: featured.name,
              priceLabel: featured.priceLabel,
              price: featured.price,
              ribbon,
              qty,
            })
          }
        >
          Agregar al carrito
        </button>
      </div>
      <ul className="pd-bullets">
        {featured.bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
      <Link href={`/productos/${featured.slug}`} className="link-underline">Ver más</Link>
    </div>
  </section>
</Reveal>
      

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
        <div className="payment-row">
          {["Visa", "Mastercard", "Amex", "Diners", "Efecty", "Mercado Pago"].map((p) => (
            <span key={p} className="payment-chip">{p}</span>
          ))}
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