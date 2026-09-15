"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, Plus, X } from "lucide-react";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  photo_slug: "",
  sort_order: "",
};

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadCategorias = () => {
    setLoading(true);
    fetch("/api/admin/categorias")
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data.categorias || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const openNewForm = () => {
    const nextOrder = categorias.length
      ? Math.max(...categorias.map((c) => c.sort_order || 0)) + 1
      : 1;
    setForm({ ...emptyForm, sort_order: nextOrder });
    setShowForm(true);
    setErrorMsg("");
  };

  const openEditForm = (c) => {
    setForm({
      id: c.id,
      name: c.name,
      description: c.description || "",
      photo_slug: c.photo_slug || "",
      sort_order: c.sort_order || 0,
    });
    setShowForm(true);
    setErrorMsg("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      photo_slug: form.photo_slug.trim(),
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    const url = form.id ? `/api/admin/categorias/${form.id}` : "/api/admin/categorias";
    const method = form.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setShowForm(false);
      loadCategorias();
    } else {
      setErrorMsg(data.error || "Error guardando la categoría");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar esta categoría? Si tiene productos asignados, reasígnalos primero desde Productos.")) return;
    await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    loadCategorias();
  };

  return (
    <div style={{ fontFamily: "'Marcellus', serif", minHeight: "100vh", background: "#F4EAE1", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <Link href="/admin" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Productos</Link>
          <Link href="/admin/empaques" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Empaques</Link>
          <Link href="/admin/arma-items" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Arma tu detalle</Link>
          <Link href="/admin/pedidos" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Pedidos</Link>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h1 style={{ fontSize: 24, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>Categorías</h1>
          <button
            onClick={openNewForm}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#927A5D", color: "#fff", border: "none",
              padding: "11px 20px", borderRadius: 999,
              fontFamily: "'Marcellus', serif", fontSize: 14, cursor: "pointer",
            }}
          >
            <Plus size={16} /> Nueva categoría
          </button>
        </div>

        <p style={{ fontSize: 12.5, color: "#927A5D", marginBottom: 20 }}>
          Estas categorías aparecen en el menú de "Detalles prediseñados" en todo el sitio. Antes de borrar una, asegúrate de que ningún producto la tenga asignada.
        </p>

        {loading ? (
          <p style={{ color: "#927A5D" }}>Cargando...</p>
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            {categorias.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 20px", borderBottom: "1px solid #EFE6DC",
                }}
              >
                <span style={{ width: 30, color: "#BBA083", fontSize: 13 }}>{c.sort_order}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14.5, color: "#4A3A2C" }}>{c.name}</p>
                  {c.description && (
                    <p style={{ margin: 0, fontSize: 12, color: "#927A5D" }}>{c.description}</p>
                  )}
                </div>
                <button onClick={() => openEditForm(c)} style={iconBtnStyle}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(c.id)} style={{ ...iconBtnStyle, color: "#A23B3B" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(74,58,44,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, zIndex: 50,
          }}
        >
          <form
            onSubmit={handleSave}
            style={{ background: "#fff", borderRadius: 16, padding: 30, width: 420, maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>
                {form.id ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#927A5D" }}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <p style={{ background: "#FBEAEA", color: "#A23B3B", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                {errorMsg}
              </p>
            )}

            <label style={labelStyle}>Nombre</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="ej: Aniversario"
              required
            />

            <label style={labelStyle}>Descripción (aparece en la tarjeta del inicio)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 60 }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="ej: Detalles especiales para celebrar su aniversario"
            />

            <label style={labelStyle}>Slug de foto (nombre de un producto existente para usar su foto de portada)</label>
            <input
              style={inputStyle}
              value={form.photo_slug}
              onChange={(e) => setForm({ ...form, photo_slug: e.target.value })}
              placeholder="ej: gratitude"
            />

            <label style={labelStyle}>Orden (número menor aparece primero)</label>
            <input
              style={inputStyle}
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            />

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%", background: "#927A5D", color: "#fff", border: "none",
                padding: 13, borderRadius: 999, fontFamily: "'Marcellus', serif",
                fontSize: 14, cursor: "pointer", opacity: saving ? 0.6 : 1, marginTop: 10,
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
  width: "100%", padding: "10px 12px", border: "1px solid #CEBAA7", borderRadius: 8,
  fontSize: 14, fontFamily: "'Marcellus', serif", color: "#4A3A2C", background: "#fff",
};
const iconBtnStyle = {
  background: "none", border: "1px solid #CEBAA7", borderRadius: 8,
  width: 32, height: 32, display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer", color: "#927A5D",
};