"use client";

import React from "react";
import { Check } from "lucide-react";
import { useArmaCart } from "../context/ArmaCartContext";

export default function ArmaCartToast({ onViewCart }) {
  const { toast } = useArmaCart();

  if (!toast) return null;

  return (
    <div className="cart-toast">
      <div className="cart-toast-icon"><Check size={16} /></div>
      <div className="cart-toast-text">
        <strong>{toast}</strong>
        <span>se agregó a tu caja</span>
      </div>
      {onViewCart && (
        <button className="cart-toast-btn" onClick={onViewCart}>Ver caja</button>
      )}
    </div>
  );
}