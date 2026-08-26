"use client";

import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function CheckoutPendientePage() {
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
      <Clock size={56} strokeWidth={1.2} color="#B08D3E" />
      <h1 style={{ fontSize: 26, color: "#4A3A2C", fontWeight: 400, margin: "18px 0 10px" }}>
        Tu pago está en proceso
      </h1>
      <p style={{ fontSize: 15, maxWidth: 420, lineHeight: 1.7, marginBottom: 26 }}>
        Estamos esperando la confirmación de tu banco o método de pago.
        Te avisaremos apenas se confirme.
      </p>
      <Link
        href="/rastrear-pedido"
        style={{ background: "#927A5D", color: "#fff", padding: "12px 26px", borderRadius: 999, textDecoration: "none" }}
      >
        Ver mi pedido
      </Link>
    </div>
  );
}