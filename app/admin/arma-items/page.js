"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, Plus, X, ArrowLeft } from "lucide-react";

const CATEGORIES = [
  "Cuidado personal",
  "Hogar y ambiente",
  "Productos comestibles",
  "Para hombre",
  "Para bebé",
];

const emptyForm = {
  id: null,
  slug: "",
  name: "",
  category: CATEGORIES[0],
  price: "",
  available: true,
  description: "",
  image: "",
};

export default function AdminArmaItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadItems = () => {
    setLoading(true);
    fetch("/api/admin/arma-items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setShowForm(true);
    setErrorMsg("");
  };

  const openEditForm = (it) => {
    setForm({
      id: it.id,
      slug: it.slug,
      name: it.name,
      category: it.category,
      price: it.price || "",
      available: it.available,
      description: it.description || "",
      image: it.image || "",
    });
    setShowForm(true);
    setErrorMsg("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!form.slug) {
      setErrorMsg("Escribe el slug antes de subir la foto.");
      return;
    }

    setUploadingImg(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", `arma-${form.slug}`);

    const res = await fetch("/api/admin/subir-imagen", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadingImg(false);

    if (data.url) {
      setForm((f) => ({ ...f, image: data.url }));
    } else {
      setErrorMsg(data.error || "Error subiendo la imagen");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category,
      price: form.price,
      available: form.available,
      description: form.description.trim(),
      image: form.image,
    };

    const url = form.id ? `/api/admin/arma-items/${form.id}` : "/api/admin/arma-items";
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
      loadItems();
    } else {
      setErrorMsg(data.error || "Error guardando el producto");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;
    await fetch(`/api/admin/arma-items/${id}`, { method: "DELETE" });
    loadItems();
  };

  return (
    <div style={{ fontFamily: "'Marcellus', serif", minHeight: "100vh", background: "#F4EAE1", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
  <Link href="/admin" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Productos</Link>
  <Link href="/admin/empaques" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Empaques</Link>
  <Link href="/admin/pedidos" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Pedidos</Link>
</div>  
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h1 style={{ fontSize: 24, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>Arma tu detalle — Artículos</h1>
          <button
            onClick={openNewForm}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#927A5D",
              color: "#fff",
              border: "none",
              padding: "11px 20px",
              borderRadius: 999,
              fontFamily: "'Marcellus', serif",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Nuevo artículo
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#927A5D" }}>Cargando...</p>
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  borderBottom: "1px solid #EFE6DC",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "#F4E2DF", flexShrink: 0 }}>
                  <img
                    src={it.image || `/arma-productos/${it.folder}/${it.slug}.jpg`}
                    alt={it.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(ev) => (ev.target.style.display = "none")}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14.5, color: "#4A3A2C" }}>{it.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#927A5D" }}>
                    {it.category} · ${Number(it.price).toLocaleString("es-CO")} · {it.available ? "Disponible" : "No disponible"}
                  </p>
                </div>
                <button onClick={() => openEditForm(it)} style={iconBtnStyle}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(it.id)} style={{ ...iconBtnStyle, color: "#A23B3B" }}>
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
              width: 460,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>
                {form.id ? "Editar artículo" : "Nuevo artículo"}
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

            <label style={labelStyle}>Slug (identificador único, sin espacios)</label>
            <input
              style={inputStyle}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="ej: jabon-lavanda"
              required
            />

            <label style={labelStyle}>Nombre</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <label style={labelStyle}>Categoría</label>
            <select
              style={inputStyle}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label style={labelStyle}>Precio (COP)</label>
            <input
              style={inputStyle}
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="25000"
              required
            />

            <label style={labelStyle}>Descripción</label>
            <textarea
              style={{ ...inputStyle, minHeight: 60 }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción corta del producto"
            />

            <label style={labelStyle}>Foto</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: 8 }} />
            {uploadingImg && <p style={{ fontSize: 12, color: "#927A5D" }}>Subiendo imagen...</p>}
            {form.image && (
              <img src={form.image} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#4A3A2C", marginBottom: 20, marginTop: 6 }}>
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />
              Disponible en el sitio
            </label>

            <button
              type="submit"
              disabled={saving || uploadingImg}
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