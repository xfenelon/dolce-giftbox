"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

function formatMoney(n) {
  return `$${Number(n).toLocaleString("es-CO")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function CheckoutExitoPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("pedido");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setErrorMsg("No encontramos el número de pedido.");
      return;
    }

    fetch(`/api/obtener-pedido?id=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setOrder(data.order);
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("No pudimos cargar los datos de tu pedido.");
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div
      style={{
        fontFamily: "'Marcellus', serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 6vw",
        textAlign: "center",
        color: "#927A5D",
        background: "#F4EAE1",
      }}
    >
      <CheckCircle2 size={56} strokeWidth={1.2} color="#4C8C5C" />
      <h1 style={{ fontSize: 26, color: "#4A3A2C", fontWeight: 400, margin: "18px 0 6px" }}>
        ¡Pago aprobado!
      </h1>
      <p style={{ fontSize: 14.5, maxWidth: 420, lineHeight: 1.6, marginBottom: 30 }}>
        Gracias por tu compra. Ya estamos preparando tu pedido con cariño.
      </p>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#927A5D" }}>
          <Loader2 size={18} className="spin" />
          Cargando los detalles de tu pedido...
        </div>
      )}

      {!loading && errorMsg && (
        <p style={{ color: "#A23B3B", fontSize: 14 }}>{errorMsg}</p>
      )}

      {!loading && order && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            padding: "28px 30px",
            maxWidth: 460,
            width: "100%",
            textAlign: "left",
            boxShadow: "0 8px 28px rgba(74,58,44,0.08)",
          }}
        >
          <div
            style={{
              background: "#F4E2DF",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontSize: 12, color: "#927A5D", margin: 0 }}>Número de pedido</p>
              <p style={{ fontSize: 20, color: "#4A3A2C", fontWeight: "bold", margin: 0 }}>#{order.id}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 12, color: "#927A5D", margin: 0 }}>Celular de contacto</p>
              <p style={{ fontSize: 16, color: "#4A3A2C", margin: 0 }}>{order.sender_phone}</p>
            </div>
          </div>

          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#4A3A2C", margin: "0 0 10px" }}>
            Tu pedido
          </p>
          {(order.items || []).map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #EFE6DC",
                fontSize: 14,
                color: "#4A3A2C",
              }}
            >
              <span>
                {item.name}
                {item.ribbon ? ` · Listón: ${item.ribbon}` : ""}
                {item.variant ? ` · ${item.variant}` : ""}
                <br />
                <span style={{ fontSize: 12, color: "#927A5D" }}>Cantidad: {item.qty}</span>
              </span>
              <span style={{ whiteSpace: "nowrap" }}>{formatMoney(item.price * item.qty)}</span>
            </div>
          ))}

          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "#927A5D", padding: "3px 0" }}>
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "#927A5D", padding: "3px 0" }}>
              <span>Envío</span>
              <span>{order.shipping_cost === 0 ? "Gratis" : formatMoney(order.shipping_cost)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                color: "#4A3A2C",
                fontWeight: "bold",
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px solid #CEBAA7",
              }}
            >
              <span>Total</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>

          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#4A3A2C", margin: "24px 0 8px" }}>
            Entrega
          </p>
          <p style={{ fontSize: 14, color: "#4A3A2C", margin: "0 0 3px" }}>Para: {order.recipient_name}</p>
          <p style={{ fontSize: 14, color: "#4A3A2C", margin: "0 0 3px" }}>
            {order.address}{order.neighborhood ? `, ${order.neighborhood}` : ""}{order.city ? `, ${order.city}` : ""}
          </p>
          <p style={{ fontSize: 14, color: "#4A3A2C", margin: 0 }}>
            {order.delivery_date ? `Fecha estimada: ${formatDate(order.delivery_date)}` : ""}
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 30 }}>
        <Link
          href="/rastrear-pedido"
          style={{ background: "#927A5D", color: "#fff", padding: "12px 26px", borderRadius: 999, textDecoration: "none" }}
        >
          Ver mi pedido
        </Link>
        <Link
          href="/"
          style={{ border: "1px solid #927A5D", color: "#927A5D", padding: "12px 26px", borderRadius: 999, textDecoration: "none" }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}