"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

// Ciudades donde se entrega al día siguiente. Fuera de estas, va por mensajería (2 a 4 días hábiles).
const LOCAL_CITIES = ["medellin", "itagui", "envigado", "sabaneta", "bello"];

function normalizeCity(city) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function isLocalCity(city) {
  return LOCAL_CITIES.includes(normalizeCity(city));
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(date, days) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

function toDateInputValue(date) {
  const offset = date.getTimezoneOffset();
  const adjusted = new Date(date.getTime() - offset * 60000);
  return adjusted.toISOString().split("T")[0];
}

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

function DeliveryCalendar({ value, onChange, minDate }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date(minDate.getFullYear(), minDate.getMonth(), 1));
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setViewDate(new Date(minDate.getFullYear(), minDate.getMonth(), 1));
    }
  }, [value, minDate]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const minDateStr = toDateInputValue(minDate);

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const formatDisplay = (dateStr) => {
    if (!dateStr) return "Elige el día";
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} de ${d.getFullYear()}`;
  };

  const selectDay = (day) => {
    const pickedStr = toDateInputValue(new Date(year, month, day));
    if (pickedStr < minDateStr) return;
    onChange(pickedStr);
    setOpen(false);
  };

  return (
    <div className="dc-wrap" ref={wrapRef}>
      <button type="button" className="dc-trigger" onClick={() => setOpen((o) => !o)}>
        {formatDisplay(value)}
      </button>
      {open && (
        <div className="dc-popover">
          <div className="dc-header">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} aria-label="Mes anterior">‹</button>
            <span>{MONTH_NAMES[month]} {year}</span>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} aria-label="Mes siguiente">›</button>
          </div>
          <div className="dc-weekdays">
            {DAY_NAMES.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="dc-grid">
            {cells.map((day, i) => {
              if (day === null) return <span key={`e${i}`} className="dc-cell dc-empty" />;
              const cellStr = toDateInputValue(new Date(year, month, day));
              const disabled = cellStr < minDateStr;
              const selected = cellStr === value;
              return (
                <button
                  type="button"
                  key={day}
                  className={`dc-cell ${disabled ? "dc-disabled" : ""} ${selected ? "dc-selected" : ""}`}
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, updateQty, removeItem, totalCount, totalPrice, clearCart } = useCart();

  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderPhoneError, setSenderPhoneError] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientPhoneError, setRecipientPhoneError] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [unitName, setUnitName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [cardFrom, setCardFrom] = useState("");
  const [cardTo, setCardTo] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [cardAnonymous, setCardAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orderDone, setOrderDone] = useState(null);

  const minDate = useMemo(() => {
    if (!city.trim()) return addDays(new Date(), 1);
    return isLocalCity(city) ? addDays(new Date(), 1) : addBusinessDays(new Date(), 2);
  }, [city]);
  const minDateStr = toDateInputValue(minDate);

  const deliveryHint = !city.trim()
    ? "Escribe la ciudad para saber la fecha más pronta disponible."
    : isLocalCity(city)
    ? "Entrega al día siguiente (Medellín y área metropolitana)."
    : "Fuera del área metropolitana: 2 a 4 días hábiles por mensajería.";

  const formattedTotal = `$${totalPrice.toLocaleString("es-CO")}`;

  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone.trim());

  const validatePhoneField = (phone, setError) => {
    if (!phone.trim()) {
      setError("");
      return;
    }
    setError(isValidPhone(phone) ? "" : "Debe tener 10 dígitos, solo números.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!senderName || !senderPhone || !recipientName || !recipientPhone || !city || !neighborhood || !address || !deliveryDate) {
      setErrorMsg("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!isValidPhone(senderPhone) || !isValidPhone(recipientPhone)) {
      setErrorMsg("El celular debe tener 10 dígitos, solo números.");
      return;
    }
    if (deliveryDate < minDateStr) {
      setErrorMsg("Elige una fecha de entrega válida según la ciudad.");
      return;
    }

    setSubmitting(true);

    const orderItems = items.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
      ribbon: i.ribbon || null,
      variant: i.variant || null,
      customName: i.customName || null,
    }));

    const { data, error } = await supabase.rpc("crear_pedido", {
      p_sender_name: senderName,
      p_sender_phone: senderPhone,
      p_recipient_name: recipientName,
      p_recipient_phone: recipientPhone,
      p_city: city,
      p_neighborhood: neighborhood,
      p_address: address,
      p_unit_name: unitName || null,
      p_house_number: houseNumber || null,
      p_delivery_date: deliveryDate,
      p_items: orderItems,
      p_total: totalPrice,
      p_card_from: cardAnonymous ? null : (cardFrom || null),
      p_card_to: cardTo || null,
      p_card_message: cardMessage || null,
      p_card_anonymous: cardAnonymous,
    });

    setSubmitting(false);

    if (error) {
      console.error("Error guardando el pedido:", error.message, error.details, error.hint, error.code);
      setErrorMsg(`Hubo un problema guardando tu pedido: ${error.message || "error desconocido"}`);
      return;
    }

    const orderId = data;

    const summaryLines = orderItems
      .map((i) => `- ${i.name}${i.ribbon ? ` (listón ${i.ribbon})` : ""}${i.variant ? ` (${i.variant})` : ""} x${i.qty}`)
      .join("%0A");
    const waMessage =
      `Hola! Hice el pedido #${orderId} en la página. ` +
      `Envía: ${senderName}, recibe: ${recipientName} en ${city}. ` +
      `Entrega: ${deliveryDate}. Total: ${formattedTotal}. ¿Cómo hago el pago? 🎁%0A${summaryLines}`;

    setOrderDone({ id: orderId, waLink: `https://wa.me/573113290390?text=${waMessage}` });
    clearCart();
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

        .co-header { display:flex; align-items:center; justify-content:space-between; padding: 18px 6vw; border-bottom: 1px solid var(--tan); }
        .co-header img { height: 48px; }
        .co-back { display:flex; align-items:center; gap: 6px; color: var(--olive); text-decoration:none; font-size: 14px; }

        .co-layout { display:flex; gap: 50px; max-width: 1100px; margin: 0 auto; padding: 40px 6vw 80px; align-items:flex-start; flex-wrap: wrap; }
        .co-form-col { flex: 1.3; min-width: 320px; }
        .co-summary-col { flex: 1; min-width: 300px; background: var(--cream); border-radius: 16px; padding: 26px; position: sticky; top: 24px; }

        .co-title { font-size: 24px; color: var(--ink); font-weight: 400; margin: 0 0 6px; }
        .co-subtitle { font-size: 13.5px; color: var(--taupe); margin: 0 0 30px; }

        .co-section-title { font-size: 14px; color: var(--ink); font-weight: 600; letter-spacing: 0.5px; margin: 28px 0 14px; text-transform: uppercase; }
        .co-section-title:first-of-type { margin-top: 0; }

        .co-field-row { display:flex; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
        .co-field { flex: 1; min-width: 220px; display:flex; flex-direction:column; gap: 6px; }
        .co-field label { font-size: 12.5px; color: var(--olive); }
        .co-field label .optional { color: var(--taupe); font-weight: 400; }
        .co-field input { padding: 11px 14px; border: 1px solid var(--tan); border-radius: 8px; font-family: 'Marcellus', serif;
          font-size: 14px; color: var(--ink); background: var(--white); }
        .co-field input:focus { outline: none; border-color: var(--olive); }
        .co-field-error { font-size: 11.5px; color: #A23B3B; margin-top: 2px; }
        .co-hint { font-size: 12px; color: var(--taupe); margin: -6px 0 14px; }

        .dc-wrap { position: relative; }
        .dc-trigger { width: 100%; text-align: left; padding: 11px 14px; border: 1px solid var(--tan); border-radius: 8px;
          font-family: 'Marcellus', serif; font-size: 14px; color: var(--ink); background: var(--white); cursor: pointer; }
        .dc-trigger:hover { border-color: var(--olive); }
        .dc-popover { position: absolute; top: calc(100% + 8px); left: 0; z-index: 20; background: var(--white); border: 1px solid var(--tan);
          border-radius: 14px; box-shadow: 0 14px 34px rgba(74,58,44,0.18); padding: 16px; width: 280px; }
        .dc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; font-size: 14px; color: var(--ink); }
        .dc-header button { background:none; border:none; cursor:pointer; color: var(--olive); font-size: 18px; padding: 4px 8px; border-radius: 6px; }
        .dc-header button:hover { background: var(--cream); }
        .dc-weekdays { display:grid; grid-template-columns: repeat(7, 1fr); text-align:center; font-size: 11px; color: var(--taupe); margin-bottom: 4px; }
        .dc-grid { display:grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .dc-cell { aspect-ratio: 1; display:flex; align-items:center; justify-content:center; font-size: 13px; color: var(--ink);
          background:none; border:none; border-radius: 8px; cursor:pointer; font-family: 'Marcellus', serif; }
        .dc-cell:hover:not(.dc-disabled):not(.dc-empty) { background: var(--cream); }
        .dc-cell.dc-disabled { color: var(--tan); cursor: not-allowed; }
        .dc-cell.dc-selected { background: var(--olive); color: var(--white); }
        .dc-cell.dc-empty { cursor: default; }

        .co-card-box { background: var(--blush); border-radius: 14px; padding: 24px; margin: 28px 0; }
        .co-card-title { font-size: 20px; letter-spacing: 2px; text-transform: uppercase; color: var(--olive); margin: 0 0 20px; }
        .co-card-box .co-field-row { margin-bottom: 16px; }
        .co-card-box .co-field input,
        .co-card-box .co-field textarea { background: var(--white); border: none; border-radius: 12px; padding: 14px 16px;
          font-family: 'Marcellus', serif; font-size: 14px; color: var(--ink); }
        .co-card-textarea { resize: vertical; width: 100%; }
        .co-anon-checkbox { display:flex; align-items:center; gap: 10px; font-size: 14px; color: var(--olive); cursor: pointer; }
        .co-anon-checkbox input { width: 18px; height: 18px; accent-color: var(--olive); cursor: pointer; }

        .co-error { background: #FBEAEA; color: #A23B3B; border: 1px solid #E3B4B4; border-radius: 8px; padding: 12px 16px; font-size: 13px; margin-bottom: 18px; }

        .co-submit-btn { width:100%; background: var(--olive); color: var(--white); border:none; padding: 15px; border-radius: 999px;
          font-family:'Marcellus', serif; font-size: 15px; cursor:pointer; margin-top: 10px; transition: opacity .2s; }
        .co-submit-btn:disabled { opacity: .6; cursor: not-allowed; }

        .co-summary-col h3 { font-size: 17px; color: var(--ink); margin: 0 0 18px; font-weight: 400; }
        .co-item { display:flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(146,122,93,0.15); align-items:flex-start; }
        .co-item-photo { width: 56px; height: 56px; border-radius: 8px; overflow: hidden; background: var(--white); flex-shrink: 0; }
        .co-item-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .co-item-info { flex: 1; min-width: 0; }
        .co-item-info h4 { font-size: 13.5px; color: var(--ink); margin: 0 0 2px; font-weight: 400; }
        .co-item-meta { font-size: 11.5px; color: var(--taupe); margin: 0 0 6px; }
        .co-item-qty { display:flex; align-items:center; gap: 8px; }
        .co-item-qty button { background:none; border:1px solid var(--tan); border-radius: 999px; width: 22px; height: 22px;
          display:flex; align-items:center; justify-content:center; cursor:pointer; color: var(--olive); }
        .co-item-price { font-size: 13px; color: var(--olive); white-space: nowrap; }
        .co-item-remove { background:none; border:none; cursor:pointer; color: var(--taupe); }
        .co-total-row { display:flex; justify-content:space-between; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--tan);
          font-size: 17px; color: var(--ink); }

        .co-empty { max-width: 420px; margin: 100px auto; text-align:center; padding: 0 6vw; color: var(--taupe); }
        .co-empty h2 { font-size: 22px; color: var(--ink); font-weight: 400; margin: 18px 0 10px; }
        .co-empty p { font-size: 14px; color: var(--olive); margin: 0 0 26px; }
        .co-empty-btn { display:inline-block; background: var(--olive); color: var(--white); padding: 13px 30px;
          border-radius: 999px; text-decoration:none; font-family:'Marcellus', serif; font-size: 14px; transition: opacity .2s; }
        .co-empty-btn:hover { opacity: .9; }

        .co-success { max-width: 480px; margin: 80px auto; text-align:center; padding: 0 6vw; }
        .co-success svg { color: #4C8C5C; margin-bottom: 18px; }
        .co-success h2 { font-size: 24px; color: var(--ink); font-weight: 400; margin: 0 0 12px; }
        .co-success p { color: var(--olive); font-size: 14.5px; line-height: 1.7; margin-bottom: 26px; }
        .co-wa-btn { display:inline-flex; align-items:center; gap: 8px; background: #25D366; color: #fff; padding: 13px 28px;
          border-radius: 999px; text-decoration:none; font-family:'Marcellus', serif; font-size: 14px; }

        @media (max-width: 800px) {
          .co-layout { flex-direction: column; }
          .co-summary-col { position: static; width: 100%; }
        }
      `}</style>

      <header className="co-header">
        <Link href="/"><img src="/logoprincipal.png" alt="Dolce Giftbox" /></Link>
        <Link href="/productos" className="co-back"><ArrowLeft size={16} /> Seguir comprando</Link>
      </header>

      {orderDone ? (
        <div className="co-success">
          <CheckCircle2 size={52} strokeWidth={1.3} />
          <h2>¡Pedido recibido!</h2>
          <p>
            Tu pedido #{orderDone.id} quedó guardado. Escríbenos por WhatsApp para coordinar el pago
            y confirmar los últimos detalles de la entrega.
          </p>
          <a className="co-wa-btn" href={orderDone.waLink} target="_blank" rel="noopener noreferrer">
            Confirmar por WhatsApp
          </a>
        </div>
      ) : items.length === 0 ? (
        <div className="co-empty">
          <ShoppingBag size={48} strokeWidth={1.2} />
          <h2>Tu carrito está vacío</h2>
          <p>Todavía no has agregado ninguna caja prediseñada.</p>
          <Link href="/productos" className="co-empty-btn">Ver detalles prediseñados</Link>
        </div>
      ) : (
        <div className="co-layout">
          <form className="co-form-col" onSubmit={handleSubmit}>
            <h1 className="co-title">Finalizar pedido</h1>
            <p className="co-subtitle">Completa los datos de envío y entrega.</p>

            {errorMsg && <div className="co-error">{errorMsg}</div>}

            <p className="co-section-title">Quién envía</p>
            <div className="co-field-row">
              <div className="co-field">
                <label>Nombre de quien envía</label>
                <input value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
              </div>
              <div className="co-field">
                <label>Celular de quien envía</label>
                <input
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  onBlur={() => validatePhoneField(senderPhone, setSenderPhoneError)}
                  type="tel"
                  maxLength={10}
                  placeholder="10 dígitos"
                  required
                />
                {senderPhoneError && <span className="co-field-error">{senderPhoneError}</span>}
              </div>
            </div>

            <p className="co-section-title">Quién recibe</p>
            <div className="co-field-row">
              <div className="co-field">
                <label>Nombre de quien recibe</label>
                <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
              </div>
              <div className="co-field">
                <label>Celular de quien recibe</label>
                <input
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  onBlur={() => validatePhoneField(recipientPhone, setRecipientPhoneError)}
                  type="tel"
                  maxLength={10}
                  placeholder="10 dígitos"
                  required
                />
                {recipientPhoneError && <span className="co-field-error">{recipientPhoneError}</span>}
              </div>
            </div>

            <p className="co-section-title">Dirección de entrega</p>
            <div className="co-field-row">
              <div className="co-field">
                <label>Ciudad</label>
                <input value={city} onChange={(e) => { setCity(e.target.value); setDeliveryDate(""); }} required />
              </div>
              <div className="co-field">
                <label>Barrio</label>
                <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
              </div>
            </div>
            <div className="co-field-row">
              <div className="co-field">
                <label>Dirección</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número..." required />
              </div>
            </div>
            <div className="co-field-row">
              <div className="co-field">
                <label>Unidad o conjunto <span className="optional">(opcional)</span></label>
                <input value={unitName} onChange={(e) => setUnitName(e.target.value)} />
              </div>
              <div className="co-field">
                <label>Casa o apto <span className="optional">(opcional)</span></label>
                <input value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
              </div>
            </div>

            <p className="co-section-title">Fecha de entrega</p>
            <div className="co-field-row">
              <div className="co-field">
                <label>Elige el día</label>
                <DeliveryCalendar value={deliveryDate} onChange={setDeliveryDate} minDate={minDate} />
              </div>
            </div>
                       <p className="co-hint">{deliveryHint}</p>
            <p className="co-hint">Tu pedido será entregado entre las 7:00 a.m. y las 12:00 p.m.</p>

            <div className="co-card-box">
              <p className="co-card-title">¡Envía una carta!</p>

              {!cardAnonymous && (
                <div className="co-field-row">
                  <div className="co-field">
                    <label>De</label>
                    <input
                      value={cardFrom}
                      onChange={(e) => setCardFrom(e.target.value)}
                      placeholder="De (máximo 70 caracteres)"
                      maxLength={70}
                    />
                  </div>
                </div>
              )}

              <div className="co-field-row">
                <div className="co-field">
                  <label>Para</label>
                  <input
                    value={cardTo}
                    onChange={(e) => setCardTo(e.target.value)}
                    placeholder="Para (máximo 17 caracteres)"
                    maxLength={17}
                  />
                </div>
              </div>

              <div className="co-field-row">
                <div className="co-field">
                  <label>Carta</label>
                  <textarea
                    className="co-card-textarea"
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    placeholder="Escribe aquí tu carta (máximo 550 caracteres)"
                    maxLength={550}
                    rows={5}
                  />
                </div>
              </div>

              <label className="co-anon-checkbox">
                <input
                  type="checkbox"
                  checked={cardAnonymous}
                  onChange={(e) => setCardAnonymous(e.target.checked)}
                />
                Enviar anónimo (opcional)
              </label>
            </div>

            <button className="co-submit-btn" type="submit" disabled={submitting}>
              {submitting ? "Guardando pedido..." : "Confirmar pedido"}
            </button>
          </form>

          <div className="co-summary-col">
            <h3>Tu pedido ({totalCount})</h3>
            {items.map((item) => (
              <div className="co-item" key={`${item.slug}-${item.ribbon}-${item.variant}-${item.customName}`}>
                <div className="co-item-photo">
                  <img
                    src={item.image || `/productos/${item.slug}-1.jpg`}
                    alt={item.name}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className="co-item-info">
                  <h4>{item.name}</h4>
                  {(item.ribbon || item.variant) && (
                    <p className="co-item-meta">
                      {item.ribbon && `Listón: ${item.ribbon}`} {item.variant && `· ${item.variant}`}
                    </p>
                  )}
                  <div className="co-item-qty">
                    <button type="button" onClick={() => updateQty(item.slug, item.ribbon, item.qty - 1, item.variant, item.customName)}><Minus size={11} /></button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.slug, item.ribbon, item.qty + 1, item.variant, item.customName)}><Plus size={11} /></button>
                  </div>
                </div>
                <span className="co-item-price">{`$${(item.price * item.qty).toLocaleString("es-CO")}`}</span>
                <button type="button" className="co-item-remove" onClick={() => removeItem(item.slug, item.ribbon, item.variant, item.customName)}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <div className="co-total-row">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}