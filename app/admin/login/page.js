"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseAuth } from "../../lib/supabaseAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

       const { error: authError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Correo o contraseña incorrectos.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F4EAE1",
        fontFamily: "'Marcellus', serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FFFFFF",
          padding: "40px 36px",
          borderRadius: 16,
          width: 320,
          boxShadow: "0 8px 28px rgba(74,58,44,0.1)",
        }}
      >
        <h1 style={{ fontSize: 20, color: "#4A3A2C", fontWeight: 400, marginBottom: 20, textAlign: "center" }}>
          Panel de Dolce Giftbox
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          autoFocus
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #CEBAA7",
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 10,
            fontFamily: "'Marcellus', serif",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #CEBAA7",
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 14,
            fontFamily: "'Marcellus', serif",
          }}
        />
        {error && <p style={{ color: "#A23B3B", fontSize: 13, marginBottom: 14 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: "#927A5D",
            color: "#fff",
            border: "none",
            padding: 13,
            borderRadius: 999,
            fontFamily: "'Marcellus', serif",
            fontSize: 14,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}