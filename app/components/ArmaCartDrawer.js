"use client";

import React from "react";
import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useArmaCart } from "../context/ArmaCartContext";

export default function ArmaCartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, totalCount, totalPrice } = useArmaCart();

  if (!open) return null;

    const formattedTotal = `$${totalPrice.toLocaleString("es-CO")}`;
  const onlyPackaging = items.length > 0 && items.every((i) => i.type === "empaque");

  const whatsappMessage = items
    .map((i) => `- ${i.name} x${i.qty}`)
    .join("%0A");

  return (
    <>
      <style>{`
        .cart-overlay { position: fixed; inset: 0; background: rgba(74,58,44,0.35); z-index: 80; }
        .cart-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 380px; max-width: 92vw; background: #FFFFFF;
          z-index: 81; box-shadow: -8px 0 30px rgba(0,0,0,0.15); display: flex; flex-direction: column; }
        .cart-drawer-header { display:flex; align-items:center; justify-content:space-between; padding: 22px 24px;
          border-bottom: 1px solid #CEBAA7; }
        .cart-drawer-header h3 { font-size: 20px; color: #927A5D; font-weight: 400; margin: 0; font-family: 'Marcellus', serif; }
        .cart-drawer-header button { background:none; border:none; cursor:pointer; color: #927A5D; }
        .cart-empty { padding: 60px 24px; text-align:center; color: #BBA083; font-family: 'Marcellus', serif; }
        .cart-items { flex: 1; overflow-y: auto; padding: 16px 24px; }
        .cart-item { display:flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid #F4E2DF; }
        .cart-item-photo { width: 72px; height: 72px; border-radius: 10px; overflow: hidden; background: #F4EAE1; flex-shrink: 0; }
        .cart-item-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-info h4 { font-size: 14.5px; color: #4A3A2C; margin: 0 0 3px; font-weight: 400; font-family: 'Marcellus', serif; }
        .cart-item-controls { display:flex; align-items:center; justify-content: space-between; }
        .cart-item-qty { display:flex; align-items:center; border:1px solid #CEBAA7; border-radius: 999px; overflow:hidden; }
        .cart-item-qty button { background:none; border:none; padding: 5px 9px; cursor:pointer; color: #927A5D; display:flex; }
        .cart-item-qty span { padding: 0 8px; font-size: 13px; color: #4A3A2C; }
        .cart-item-remove { background:none; border:none; cursor:pointer; color: #BBA083; }
        .cart-item-price { font-size: 13px; color: #927A5D; margin-top: 6px; }
        .cart-drawer-footer { padding: 20px 24px 26px; border-top: 1px solid #CEBAA7; }
        .cart-total-row { display:flex; justify-content: space-between; align-items:center; margin-bottom: 16px;
          font-family: 'Marcellus', serif; color: #4A3A2C; }
        .cart-total-row span:last-child { font-size: 18px; color: #927A5D; }
                .cart-fit-note { text-align:center; font-size: 12px; color: #927A5D; opacity: .85; margin: 0 0 10px; }
        .cart-warning { text-align:center; font-size: 12.5px; color: #A23B3B; background: #FBEAEA; border: 1px solid #E3B4B4;
          border-radius: 8px; padding: 10px 14px; margin: 0 0 10px; }
        .cart-checkout-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
          background: #25D366; color: #fff; border:none; padding: 14px; border-radius: 999px;
          font-family:'Marcellus', serif; font-size: 14px; cursor:pointer; text-decoration:none; margin-bottom: 10px; }
        .cart-continue-link { display:block; text-align:center; font-size: 13px; color: #927A5D; text-decoration: underline; }
      `}</style>

      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h3>Tu caja ({totalCount})</h3>
          <button onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">Todavía no has agregado nada a tu caja.</div>
        ) : (
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item.slug}>
                <div className="cart-item-photo">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <div className="cart-item-controls">
                    <div className="cart-item-qty">
                      <button onClick={() => updateQty(item.slug, item.qty - 1)} aria-label="Menos"><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.slug, item.qty + 1)} aria-label="Más"><Plus size={12} /></button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(item.slug)} aria-label="Quitar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="cart-item-price">{item.priceLabel}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>
                   <p className="cart-fit-note">Confirmaremos que los productos quepan en el empaque.</p>
          {onlyPackaging ? (
            <p className="cart-warning">El empaque no se vende solo. Agrega al menos un producto para armar tu caja.</p>
          ) : (
            <a className="cart-checkout-btn" href={`https://wa.me/573113290390?text=${encodeURIComponent("Hola! Quisiera armar una caja con estos artículos:")}%0A${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} /> Finalizar por WhatsApp
            </a>
          )}
            <span className="cart-continue-link" onClick={onClose}>Seguir comprando</span>
          </div>
        )}
      </div>
    </>
  );
}