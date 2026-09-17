"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, Ban, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseAuth } from "../lib/supabaseAuth";

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

const PACKAGING_OPTIONS = [
  "",
  "caja-pequena-madera",
  "caja-mediana-madera",
  "caja-grande-madera",
  "caja-redonda-rosada",
  "caja-letrero-madera",
  "corazon-madera-pequena",
  "corazon-madera-grande",
  "estrella-madera",
  "cesta-croche",
  "canasta-metalica",
  "bolsa-yute",
  "bolso-mimbre",
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
  packaging_slug: "",
   stock: "",
   variants: [],
  option_groups: [],
};

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("Todos");
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
           packaging_slug: p.packaging_slug || "",
        stock: p.stock ?? "",
          variants: p.variants || [],
      option_groups: (p.option_groups || []).map((g) => ({
        label: g.label,
        values: (g.values || []).map((v) => ({ name: v.name, stock: v.stock ?? "" })),
      })),
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
           packaging_slug: form.packaging_slug || null,
           stock: form.stock !== "" ? parseInt(form.stock, 10) : null,
        variants: form.variants && form.variants.length > 0 ? form.variants : null,
      option_groups: (() => {
        const cleaned = form.option_groups
          .filter((g) => g.label.trim() && g.values.some((v) => v.name.trim()))
          .map((g) => ({
            label: g.label.trim(),
            values: g.values
              .filter((v) => v.name.trim())
              .map((v) => ({ name: v.name.trim(), stock: v.stock === "" ? null : parseInt(v.stock, 10) })),
          }));
        return cleaned.length > 0 ? cleaned : null;
      })(),
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

  const handleToggleAvailable = async (p) => {
    const payload = {
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      bullets: p.bullets || [],
      available: !p.available,
      image: p.image || null,
      packaging_slug: p.packaging_slug || null,
      stock: p.stock,
      variants: p.variants || null,
      option_groups: p.option_groups || null,
    };
    await fetch(`/api/admin/productos/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    loadProductos();
  };
  
     const handleLogout = async () => {
    await supabaseAuth.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div style={{ fontFamily: "'Marcellus', serif", minHeight: "100vh", background: "#F4EAE1", padding: "40px 5vw" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
       <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
  <Link href="/admin/empaques" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Empaques</Link>
  <Link href="/admin/arma-items" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Arma tu detalle</Link>
  <Link href="/admin/pedidos" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Pedidos</Link>
  <Link href="/admin/categorias" style={{ color: "#927A5D", fontSize: 13, textDecoration: "underline" }}>Categorías</Link>
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

               <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {[{ label: "Todos", count: productos.length }, ...CATEGORIES.map((c) => ({ label: c, count: productos.filter((p) => p.category === c).length }))].map(({ label, count }) => (
            <button
              key={label}
              onClick={() => setCategoryFilter(label)}
              style={{
                background: categoryFilter === label ? "#927A5D" : "#fff",
                color: categoryFilter === label ? "#fff" : "#927A5D",
                border: "1px solid #CEBAA7",
                borderRadius: 999,
                padding: "7px 14px",
                fontSize: 12.5,
                fontFamily: "'Marcellus', serif",
                cursor: "pointer",
              }}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: "#927A5D" }}>Cargando...</p>
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden" }}>
            {productos.filter((p) => categoryFilter === "Todos" || p.category === categoryFilter).length === 0 && (
              <p style={{ padding: 20, color: "#927A5D", fontSize: 13 }}>No hay productos en esta categoría.</p>
            )}
            {productos.filter((p) => categoryFilter === "Todos" || p.category === categoryFilter).map((p) => (
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
                    {p.category} · ${Number(p.price).toLocaleString("es-CO")} · {p.available ? "Disponible" : "No disponible"} · Stock: {p.stock ?? "—"}
                  </p>
                </div>
                                <button
                  onClick={() => handleToggleAvailable(p)}
                  title={p.available ? "Marcar como agotado" : "Marcar como disponible"}
                  style={{ ...iconBtnStyle, color: p.available ? "#C97B4A" : "#4C8B5A" }}
                >
                  {p.available ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                </button>
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

            <label style={labelStyle}>Stock (unidades disponibles)</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="ej: 5 (déjalo vacío si no llevas conteo)"
            />

                      {form.variants && form.variants.length > 0 && (
              <>
                <label style={labelStyle}>Opciones de esta caja</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 6 }}>
                  {form.variants.map((v, i) => (
                    <label key={v.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#4A3A2C" }}>
                      <input
                        type="checkbox"
                        checked={v.available !== false}
                        onChange={(e) => {
                          const updated = [...form.variants];
                          updated[i] = { ...updated[i], available: e.target.checked };
                          setForm({ ...form, variants: updated });
                        }}
                      />
                                       {v.name} {v.available === false ? "(agotada)" : ""}
                    </label>
                  ))}
                </div>
              </>
            )}

                      <label style={labelStyle}>Opciones de artículos dentro de la caja (ej: Color del joyero, Olor de la vela, Sabor del jabón — puedes agregar varios grupos)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 8 }}>
              {form.option_groups.map((group, gi) => (
                <div key={gi} style={{ border: "1px solid #CEBAA7", borderRadius: 10, padding: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      value={group.label}
                      onChange={(e) => {
                        const updated = [...form.option_groups];
                        updated[gi] = { ...updated[gi], label: e.target.value };
                        setForm({ ...form, option_groups: updated });
                      }}
                      placeholder="ej: Olor de la vela"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, option_groups: form.option_groups.filter((_, idx) => idx !== gi) })}
                      style={{ background: "none", border: "none", color: "#A23B3B", cursor: "pointer" }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
                    {group.values.map((v, vi) => (
                      <div key={vi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          style={{ ...inputStyle, flex: 2 }}
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...form.option_groups];
                            const values = [...updated[gi].values];
                            values[vi] = { ...values[vi], name: e.target.value };
                            updated[gi] = { ...updated[gi], values };
                            setForm({ ...form, option_groups: updated });
                          }}
                          placeholder="ej: Vainilla"
                        />
                        <input
                          style={{ ...inputStyle, flex: 1 }}
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => {
                            const updated = [...form.option_groups];
                            const values = [...updated[gi].values];
                            values[vi] = { ...values[vi], stock: e.target.value };
                            updated[gi] = { ...updated[gi], values };
                            setForm({ ...form, option_groups: updated });
                          }}
                          placeholder="Stock"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...form.option_groups];
                            updated[gi] = { ...updated[gi], values: updated[gi].values.filter((_, idx) => idx !== vi) };
                            setForm({ ...form, option_groups: updated });
                          }}
                          style={{ background: "none", border: "none", color: "#A23B3B", cursor: "pointer" }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...form.option_groups];
                      updated[gi] = { ...updated[gi], values: [...updated[gi].values, { name: "", stock: "" }] };
                      setForm({ ...form, option_groups: updated });
                    }}
                    style={{ background: "none", border: "1px solid #CEBAA7", borderRadius: 8, padding: "5px 10px", fontSize: 12.5, color: "#927A5D", cursor: "pointer" }}
                  >
                    + Agregar valor
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, option_groups: [...form.option_groups, { label: "", values: [] }] })}
              style={{ background: "none", border: "1px solid #CEBAA7", borderRadius: 8, padding: "6px 12px", fontSize: 13, color: "#927A5D", cursor: "pointer", marginBottom: 14 }}
            >
              + Agregar grupo de opciones
            </button>

            <label style={labelStyle}>Bullets (separados por coma)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 70 }}
              value={form.bullets}
              onChange={(e) => setForm({ ...form, bullets: e.target.value })}
              placeholder="Vela aromática artesanal, Taza de cerámica, ..."
            />

                        <label style={labelStyle}>Tipo de empaque</label>
            <select
              style={inputStyle}
              value={form.packaging_slug}
              onChange={(e) => setForm({ ...form, packaging_slug: e.target.value })}
            >
              <option value="">Sin empaque asignado</option>
              {PACKAGING_OPTIONS.filter(Boolean).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

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