"use client";

import React from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutFalloPage() {
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
      <XCircle size={56} strokeWidth={1.2} color="#A23B3B" />
      <h1 style={{ fontSize: 26, color: "#4A3A2C", fontWeight: 400, margin: "18px 0 10px" }}>
        El pago no se pudo procesar
      </h1>
      <p style={{ fontSize: 15, maxWidth: 420, lineHeight: 1.7, marginBottom: 26 }}>
        Tu pedido quedó guardado, pero el pago no se completó. Puedes intentar de nuevo
        o escribirnos por WhatsApp para ayudarte.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/rastrear-pedido"
          style={{ background: "#927A5D", color: "#fff", padding: "12px 26px", borderRadius: 999, textDecoration: "none" }}
        >
          Ver mi pedido
        </Link>
        
         <a
          href="https://wa.me/573113290390"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#25D366", color: "#fff", padding: "12px 26px", borderRadius: 999, textDecoration: "none" }}
        >
          Escríbenos
        </a>
      </div>
    </div>
  );
}