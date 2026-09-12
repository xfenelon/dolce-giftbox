"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Bebé",
  "Cumpleaños mujer",
  "Cumpleaños hombre",
  "Para mujer",
  "Para hombre",
  "Recuperación/Condolencias",
  "Ramo de flores naturales",
  "Peluches de apego",
];

const emptyForm = {
  id: null,
  slug: "",
  name: "",
  category: CATEGORIES[0],
  price: "",
  bullets: "",
  available: true,
  image: "",
};

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadProductos = () => {
    setLoading(true);
    fetch("/api/admin/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.productos || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const openNewForm = () => {
    setForm(emptyForm);
    setShowForm(true);
    setErrorMsg("");
  };

  const openEditForm = (p) => {
    setForm({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price || "",
      bullets: (p.bullets || []).join(", "),
      available: p.available,
      image: p.image || "",
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
    formData.append("slug", form.slug);

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
      price: form.price ? parseInt(form.price, 10) : null,
      bullets: form.bullets
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      available: form.available,
      image: form.image || null,
    };

    const url = form.id ? `/api/admin/productos/${form.id}` : "/api/admin/productos";
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
      loadProductos();
    } else {
      setErrorMsg(data.error || "Error guardando el producto");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;
    await fetch(`/api/admin/productos/${id}`, { method: "DELETE" });
    loadProductos();
  };
  
  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div style={{ fontFamily: "'Marcellus', serif", minHeight: "100vh", background: "#F4EAE1", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
       <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
  <Link href="/admin/empaques" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Empaques</Link>
  <Link href="/admin/arma-items" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Arma tu detalle</Link>
  <Link href="/admin/pedidos" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Pedidos</Link>
</div>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
  <h1 style={{ fontSize: 24, color: "#4A3A2C", fontWeight: 400, margin: 0 }}>Productos</h1>
  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
    <button
      onClick={handleLogout}
      style={{ background: "none", border: "none", color: "#A23B3B", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}
    >
      Cerrar sesión
    </button>
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
                        <Plus size={16} /> Nuevo producto
          </button>
        </div>
        </div>

        {loading ? (
          <p style={{ color: "#927A5D" }}>Cargando...</p>
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            {productos.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  borderBottom: "1px solid #EFE6DC",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "#F4E2DF", flexShrink: 0 }}>
                  {(p.image || `/productos/${p.slug}-1.jpg`) && (
                    <img
                      src={p.image || `/productos/${p.slug}-1.jpg`}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14.5, color: "#4A3A2C" }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#927A5D" }}>
                    {p.category} · ${Number(p.price).toLocaleString("es-CO")} · {p.available ? "Disponible" : "No disponible"}
                  </p>
                </div>
                <button onClick={() => openEditForm(p)} style={iconBtnStyle}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} style={{ ...iconBtnStyle, color: "#A23B3B" }}>
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
                {form.id ? "Editar producto" : "Nuevo producto"}
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
              placeholder="ej: primavera2"
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
              placeholder="139000"
            />

            <label style={labelStyle}>Bullets (separados por coma)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 70 }}
              value={form.bullets}
              onChange={(e) => setForm({ ...form, bullets: e.target.value })}
              placeholder="Vela aromática artesanal, Taza de cerámica, ..."
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