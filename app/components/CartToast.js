"use client";

import React from "react";
import { Check } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartToast({ onViewCart }) {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="cart-toast">
      <div className="cart-toast-icon"><Check size={16} /></div>
      <div className="cart-toast-text">
        <strong>{toast}</strong>
        <span>se agregó al carrito</span>
      </div>
      {onViewCart && (
        <button className="cart-toast-btn" onClick={onViewCart}>Ver carrito</button>
      )}
    </div>
  );
}