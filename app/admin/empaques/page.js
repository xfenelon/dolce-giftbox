"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, Plus, X, ArrowLeft, Ban, CheckCircle2 } from "lucide-react";

const emptyForm = {
  id: null,
  slug: "",
  name: "",
  material: "",
  dimensions: "",
  price: "",
   available: true,
  photo: "",
  stock: "",
};

export default function AdminEmpaquesPage() {
  const [empaques, setEmpaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadEmpaques = () => {
    setLoading(true);
    fetch("/api/admin/empaques")
      .then((res) => res.json())
      .then((data) => {
        setEmpaques(data.empaques || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEmpaques();
  }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setShowForm(true);
    setErrorMsg("");
  };

  const openEditForm = (e) => {
    setForm({
      id: e.id,
      slug: e.slug,
      name: e.name,
      material: e.material,
      dimensions: e.dimensions,
      price: e.price || "",
         available: e.available,
      photo: e.photo || "",
      stock: e.stock ?? "",
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
    formData.append("slug", `empaque-${form.slug}`);

    const res = await fetch("/api/admin/subir-imagen", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadingImg(false);

    if (data.url) {
      setForm((f) => ({ ...f, photo: data.url }));
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
      material: form.material.trim(),
      dimensions: form.dimensions.trim(),
      price: form.price,
          available: form.available,
      photo: form.photo,
      stock: form.stock,
    };
    const url = form.id ? `/api/admin/empaques/${form.id}` : "/api/admin/empaques";
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
      loadEmpaques();
    } else {
      setErrorMsg(data.error || "Error guardando el empaque");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar este empaque?")) return;
    await fetch(`/api/admin/empaques/${id}`, { method: "DELETE" });
    loadEmpaques();
  };

  const handleToggleAvailable = async (e) => {
    const payload = {
      slug: e.slug,
      name: e.name,
      material: e.material,
      dimensions: e.dimensions,
      price: e.price,
      available: !e.available,
      photo: e.photo,
      stock: e.stock,
    };
    await fetch(`/api/admin/empaques/${e.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    loadEmpaques();
  };

  return (
    <div style={{ fontFamily: "'Marcellus', serif", minHeight: "100vh", background: "#F4EAE1", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
  <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#927A5D", textDecoration: "none", fontSize: 13 }}>
    <ArrowLeft size={14} /> Productos
  </Link>
  <Link href="/admin/arma-items" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Arma tu detalle</Link>
  <Link href="/admin/pedidos" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Pedidos</Link>
  <Link href="/admin/categorias" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Categorías</Link>
</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h1 style={{ fontSize: 24, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>Empaques</h1>
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
            <Plus size={16} /> Nuevo empaque
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#927A5D" }}>Cargando...</p>
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            {empaques.map((e) => (
              <div
                key={e.id}
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
                    src={e.photo?.startsWith("http") ? e.photo : `/empaques/${e.photo}.jpg`}
                    alt={e.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(ev) => (ev.target.style.display = "none")}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14.5, color: "#4A3A2C" }}>{e.name}</p>
                                  <p style={{ margin: 0, fontSize: 12, color: "#927A5D" }}>
                    {e.material} · {e.dimensions} · ${Number(e.price).toLocaleString("es-CO")} · {e.available ? "Disponible" : "No disponible"} · Stock: {e.stock ?? "—"}
                  </p>
                </div>
                                <button
                  onClick={() => handleToggleAvailable(e)}
                  title={e.available ? "Marcar como agotado" : "Marcar como disponible"}
                  style={{ ...iconBtnStyle, color: e.available ? "#C97B4A" : "#4C8B5A" }}
                >
                  {e.available ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                </button>
                <button onClick={() => openEditForm(e)} style={iconBtnStyle}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(e.id)} style={{ ...iconBtnStyle, color: "#A23B3B" }}>
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
                {form.id ? "Editar empaque" : "Nuevo empaque"}
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
              placeholder="ej: caja-mediana"
              required
            />

            <label style={labelStyle}>Nombre</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <label style={labelStyle}>Material</label>
            <input
              style={inputStyle}
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              placeholder="ej: Madera natural"
              required
            />

            <label style={labelStyle}>Dimensiones</label>
            <input
              style={inputStyle}
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="ej: 20x15x10 cm"
              required
            />

                       <label style={labelStyle}>Precio (COP)</label>
            <input
              style={inputStyle}
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="45000"
              required
            />

            <label style={labelStyle}>Stock (unidades disponibles)</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="ej: 5 (déjalo vacío si no llevas conteo)"
            />

            <label style={labelStyle}>Foto</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: 8 }} />
            {uploadingImg && <p style={{ fontSize: 12, color: "#927A5D" }}>Subiendo imagen...</p>}
            {form.photo && form.photo.startsWith("http") && (
              <img src={form.photo} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />
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