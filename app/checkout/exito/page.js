"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutExitoPage() {
  return (
    <div
      style={{
        fontFamily: "'Marcellus', serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6vw",
        textAlign: "center",
        color: "#927A5D",
        background: "#FFFFFF",
      }}
    >
      <CheckCircle2 size={56} strokeWidth={1.2} color="#4C8C5C" />
      <h1 style={{ fontSize: 26, color: "#4A3A2C", fontWeight: 400, margin: "18px 0 10px" }}>
        ¡Pago aprobado!
      </h1>
      <p style={{ fontSize: 15, maxWidth: 420, lineHeight: 1.7, marginBottom: 26 }}>
        Gracias por tu compra. Ya estamos preparando tu pedido. Puedes ver el estado
        en cualquier momento en "Mis pedidos".
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
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