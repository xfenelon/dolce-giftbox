"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, X, ArrowLeft, Search } from "lucide-react";

const STATUS_OPTIONS = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];

const STATUS_COLORS = {
  pendiente: { bg: "#F4E2DF", text: "#A23B3B" },
  confirmado: { bg: "#E4EFE0", text: "#3E7A3E" },
  enviado: { bg: "#E0EAF4", text: "#3E5A7A" },
  entregado: { bg: "#E0EAF4", text: "#2E7D4F" },
  cancelado: { bg: "#EEE", text: "#888" },
};

function formatMoney(n) {
  return `$${Number(n || 0).toLocaleString("es-CO")}`;
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [tracking, setTracking] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const loadPedidos = () => {
    setLoading(true);
    fetch("/api/admin/pedidos")
      .then((res) => res.json())
      .then((data) => {
        setPedidos(data.pedidos || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  const openEdit = (p) => {
    setEditing(p);
    setTracking(p.tracking_number || "");
    setStatus(p.status || "pendiente");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/pedidos/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_number: tracking, status }),
    });
    setSaving(false);
    setEditing(null);
    loadPedidos();
  };

  const filtered = pedidos.filter((p) => {
    const q = search.toLowerCase();
    return (
      String(p.id).includes(q) ||
      p.sender_name?.toLowerCase().includes(q) ||
      p.recipient_name?.toLowerCase().includes(q) ||
      p.sender_phone?.includes(q) ||
      p.tracking_number?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ fontFamily: "'Marcellus', serif", minHeight: "100vh", background: "#F4EAE1", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
  <Link href="/admin" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Productos</Link>
  <Link href="/admin/empaques" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Empaques</Link>
  <Link href="/admin/arma-items" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Arma tu detalle</Link>
  <Link href="/admin/categorias" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Categorías</Link>
</div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: 24, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>Pedidos</h1>
          <div style={{ position: "relative", width: 260 }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: 12, color: "#927A5D" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, celular, #pedido..."
              style={{
                width: "100%",
                padding: "10px 12px 10px 34px",
                border: "1px solid #CEBAA7",
                borderRadius: 8,
                fontFamily: "'Marcellus', serif",
                fontSize: 13,
                background: "#fff",
                color: "#4A3A2C",
              }}
            />
          </div>
        </div>

        {loading ? (
          <p style={{ color: "#927A5D" }}>Cargando...</p>
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            {filtered.map((p) => {
              const colors = STATUS_COLORS[p.status] || STATUS_COLORS.pendiente;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 20px",
                    borderBottom: "1px solid #EFE6DC",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ width: 50, flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 15, color: "#4A3A2C", fontWeight: "bold" }}>#{p.id}</p>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#4A3A2C" }}>
                      {p.sender_name} → {p.recipient_name}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#927A5D" }}>
                      {p.city} · {formatMoney(p.total)} · {p.sender_phone}
                    </p>
                  </div>
                  <div style={{ minWidth: 130 }}>
                    <span
                      style={{
                        background: colors.bg,
                        color: colors.text,
                        fontSize: 11.5,
                        padding: "4px 12px",
                        borderRadius: 999,
                        textTransform: "capitalize",
                      }}
                    >
                      {p.status || "pendiente"}
                    </span>
                  </div>
                  <div style={{ minWidth: 140, fontSize: 12.5, color: "#927A5D" }}>
                    {p.tracking_number ? `Guía: ${p.tracking_number}` : "Sin número de guía"}
                  </div>
                  <button onClick={() => openEdit(p)} style={iconBtnStyle}>
                    <Pencil size={16} />
                  </button>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p style={{ padding: 20, color: "#927A5D", textAlign: "center" }}>No se encontraron pedidos.</p>
            )}
          </div>
        )}
      </div>

      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(74,58,44,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 50,
          }}
        >
          <form
            onSubmit={handleSave}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 30,
              width: 420,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>
                Pedido #{editing.id}
              </h2>
              <button type="button" onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#927A5D" }}>
                <X size={20} />
              </button>
            </div>

                       <p style={{ fontSize: 13, color: "#927A5D", marginBottom: 4 }}>
              {editing.sender_name} ({editing.sender_phone}) → {editing.recipient_name} ({editing.recipient_phone})
            </p>
            <p style={{ fontSize: 13, color: "#927A5D", marginBottom: 4 }}>
              {editing.address}
              {editing.unit_name ? `, ${editing.unit_name}` : ""}
              {editing.house_number ? `, casa/apto ${editing.house_number}` : ""}
              , {editing.neighborhood}, {editing.city}
            </p>
            <p style={{ fontSize: 13, color: "#927A5D", marginBottom: 16 }}>
              Fecha de entrega: {editing.delivery_date} · Total: {formatMoney(editing.total)}
            </p>

            <div style={{ background: "#F4EAE1", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, color: "#4A3A2C", margin: "0 0 8px" }}>
                Productos
              </p>
              {(editing.items || []).map((item, i) => (
                <p key={i} style={{ fontSize: 13, color: "#4A3A2C", margin: "0 0 4px" }}>
                  • {item.name}
                  {item.ribbon ? ` (Listón: ${item.ribbon})` : ""}
                  {item.variant ? ` (${item.variant})` : ""}
                  {item.customName ? ` — Nombre: "${item.customName}"` : ""}
                  {" "}x{item.qty}
                </p>
              ))}
            </div>

            {editing.card_message && (
              <div style={{ background: "#F4E2DF", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                <p style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, color: "#4A3A2C", margin: "0 0 8px" }}>
                  Carta de regalo
                </p>
                {!editing.card_anonymous && editing.card_from && (
                  <p style={{ fontSize: 12.5, color: "#927A5D", margin: "0 0 4px" }}>De: {editing.card_from}</p>
                )}
                {editing.card_to && (
                  <p style={{ fontSize: 12.5, color: "#927A5D", margin: "0 0 4px" }}>Para: {editing.card_to}</p>
                )}
                {editing.card_anonymous && (
                  <p style={{ fontSize: 12.5, color: "#927A5D", margin: "0 0 4px", fontStyle: "italic" }}>Envío anónimo</p>
                )}
                <p style={{ fontSize: 13.5, color: "#4A3A2C", margin: "8px 0 0", lineHeight: 1.5 }}>
                  "{editing.card_message}"
                </p>
              </div>
            )}

            <label style={labelStyle}>Estado del pedido</label>
            <select
              style={inputStyle}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>
              ))}
            </select>

            <label style={labelStyle}>Número de guía / rastreo</label>
            <input
              style={inputStyle}
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="ej: 700123456789"
            />

            <button
              type="submit"
              disabled={saving}
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
                opacity: saving ? 0.6 : 1,
                marginTop: 10,
              }}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12.5, color: "#927A5D", marginBottom: 6, marginTop: 14 };
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #CEBAA7",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "'Marcellus', serif",
  color: "#4A3A2C",
  background: "#fff",
};
const iconBtnStyle = {
  background: "none",
  border: "1px solid #CEBAA7",
  borderRadius: 8,
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#927A5D",
};