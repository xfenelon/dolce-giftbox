"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Package, CheckCircle2, Truck, Home } from "lucide-react";
import { supabase } from "../lib/supabase";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

const STATUS_STEPS = [
  { key: "pendiente", label: "Pendiente", icon: Package },
  { key: "confirmado", label: "Confirmado", icon: CheckCircle2 },
  { key: "enviado", label: "Enviado", icon: Truck },
  { key: "entregado", label: "Entregado", icon: Home },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

export default function RastrearPedidoPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setOrder(null);

    if (!orderId.trim() || !/^[0-9]{10}$/.test(phone.trim())) {
      setErrorMsg("Escribe el número de pedido y un celular de 10 dígitos.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.rpc("rastrear_pedido", {
      p_id: Number(orderId.trim()),
      p_phone: phone.trim(),
    });
    setLoading(false);
    setSearched(true);

    if (error) {
      console.error("Error rastreando el pedido:", error.message);
      setErrorMsg("Hubo un problema buscando tu pedido. Intenta de nuevo.");
      return;
    }

    if (!data || data.length === 0) {
      setErrorMsg("No encontramos ese pedido. Revisa el número y el celular que usaste al comprar.");
      return;
    }

    setOrder(data[0]);
  };

  const currentStepIndex = order ? STATUS_STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="dolce-root">
      <style>{`
        ${FONT_IMPORT}
        .dolce-root {
          --white:#FFFFFF; --cream:#F4EAE1; --blush:#F4E2DF; --tan:#CEBAA7; --taupe:#BBA083; --olive:#927A5D; --ink:#4A3A2C;
          background: var(--white); color: var(--olive); font-family:'Marcellus', serif; overflow-x:hidden; min-height: 100vh;
        }
        .dolce-root * { box-sizing: border-box; }

        .rp-header { display:flex; align-items:center; justify-content:space-between; padding: 18px 6vw; border-bottom: 1px solid var(--tan); }
        .rp-header img { height: 48px; }
        .rp-back { display:flex; align-items:center; gap: 6px; color: var(--olive); text-decoration:none; font-size: 14px; }

        .rp-wrap { max-width: 560px; margin: 0 auto; padding: 50px 6vw 100px; }
        .rp-title { font-size: 26px; color: var(--ink); font-weight: 400; margin: 0 0 8px; text-align:center; }
        .rp-subtitle { font-size: 14px; color: var(--taupe); margin: 0 0 34px; text-align:center; }

        .rp-form { display:flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
        .rp-field { flex: 1; min-width: 160px; }
        .rp-field label { display:block; font-size: 12.5px; color: var(--olive); margin-bottom: 6px; }
        .rp-field input { width: 100%; padding: 12px 14px; border: 1px solid var(--tan); border-radius: 8px;
          font-family: 'Marcellus', serif; font-size: 14px; color: var(--ink); background: var(--white); }
        .rp-field input:focus { outline: none; border-color: var(--olive); }
        .rp-submit { width:100%; background: var(--olive); color: var(--white); border:none; padding: 14px; border-radius: 999px;
          font-family:'Marcellus', serif; font-size: 14.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap: 8px;
          margin-top: 8px; transition: opacity .2s; }
        .rp-submit:disabled { opacity: .6; cursor: not-allowed; }

        .rp-error { background: #FBEAEA; color: #A23B3B; border: 1px solid #E3B4B4; border-radius: 8px; padding: 12px 16px;
          font-size: 13px; margin-top: 18px; text-align:center; }

        .rp-result { margin-top: 44px; background: var(--cream); border-radius: 16px; padding: 30px 26px; }
        .rp-result-title { font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: var(--taupe); margin: 0 0 4px; }
        .rp-result-id { font-size: 20px; color: var(--ink); margin: 0 0 22px; }

        .rp-steps { display:flex; justify-content:space-between; position: relative; margin-bottom: 26px; }
        .rp-steps::before { content: ''; position:absolute; top: 18px; left: 18px; right: 18px; height: 2px; background: var(--tan); z-index: 0; }
        .rp-step { position: relative; z-index: 1; display:flex; flex-direction:column; align-items:center; gap: 8px; flex: 1; }
        .rp-step-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--white); border: 2px solid var(--tan);
          display:flex; align-items:center; justify-content:center; color: var(--taupe); }
        .rp-step.done .rp-step-icon { background: var(--olive); border-color: var(--olive); color: var(--white); }
        .rp-step span { font-size: 11px; color: var(--taupe); text-align:center; }
        .rp-step.done span { color: var(--ink); font-weight: 600; }

        .rp-detail-row { display:flex; justify-content:space-between; font-size: 13.5px; color: var(--olive); padding: 10px 0;
          border-top: 1px solid rgba(146,122,93,0.2); }
        .rp-detail-row span:last-child { color: var(--ink); }

        .rp-tracking-box { margin-top: 18px; background: var(--white); border-radius: 12px; padding: 16px 18px; }
        .rp-tracking-label { font-size: 12px; color: var(--taupe); margin: 0 0 4px; }
        .rp-tracking-number { font-size: 16px; color: var(--ink); letter-spacing: 1px; margin: 0 0 12px; }
        .rp-tracking-btn { display:inline-flex; align-items:center; gap: 6px; background: var(--olive); color: var(--white);
          padding: 10px 22px; border-radius: 999px; text-decoration:none; font-family:'Marcellus', serif; font-size: 13px; }
        .rp-no-tracking { font-size: 13px; color: var(--taupe); font-style: italic; }
      `}</style>

      <header className="rp-header">
        <Link href="/"><img src="/logoprincipal.png" alt="Dolce Giftbox" /></Link>
        <Link href="/" className="rp-back"><ArrowLeft size={16} /> Volver al inicio</Link>
      </header>

      <div className="rp-wrap">
        <h1 className="rp-title">Rastrea tu pedido</h1>
        <p className="rp-subtitle">Escribe tu número de pedido y el celular que usaste al comprar.</p>

        <form className="rp-form" onSubmit={handleSubmit}>
          <div className="rp-field">
            <label>Número de pedido</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ej. 5"
              inputMode="numeric"
            />
          </div>
          <div className="rp-field">
            <label>Celular usado en la compra</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10 dígitos"
              maxLength={10}
              type="tel"
            />
          </div>
        </form>
        <button className="rp-submit" onClick={handleSubmit} disabled={loading}>
          <Search size={16} /> {loading ? "Buscando..." : "Buscar pedido"}
        </button>

        {errorMsg && <div className="rp-error">{errorMsg}</div>}

        {order && (
          <div className="rp-result">
            <p className="rp-result-title">Pedido</p>
            <p className="rp-result-id">#{order.id}</p>

            <div className="rp-steps">
              {STATUS_STEPS.map((step, i) => {
                const Icon = step.icon;
                const done = i <= currentStepIndex;
                return (
                  <div key={step.key} className={`rp-step ${done ? "done" : ""}`}>
                    <div className="rp-step-icon"><Icon size={17} /></div>
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="rp-detail-row">
              <span>Ciudad de entrega</span>
              <span>{order.city}</span>
            </div>
            <div className="rp-detail-row">
              <span>Fecha de entrega</span>
              <span>{formatDate(order.delivery_date)}</span>
            </div>

            <div className="rp-tracking-box">
              {order.tracking_number ? (
                <>
                  <p className="rp-tracking-label">Número de guía Interrapidísimo</p>
                                 <p className="rp-tracking-number">{order.tracking_number}</p>
                  
                  <a
                    className="rp-tracking-btn"
                    href="https://interrapidisimo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Truck size={15} /> Rastrear en Interrapidísimo
                  </a>
                </>
              ) : (
                <p className="rp-no-tracking">
                  Todavía no tenemos el número de guía — te lo compartimos por WhatsApp en cuanto despachemos tu pedido.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}