import { NextResponse } from "next/server";

// Esta ruta corre en el servidor de Vercel, nunca en el navegador del cliente,
// así que aquí SÍ es seguro usar el Access Token secreto de Mercado Pago.
export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, items, shippingCost } = body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const mpItems = items.map((i) => ({
      title: i.name,
      quantity: i.qty,
      unit_price: i.price,
      currency_id: "COP",
    }));

    if (shippingCost > 0) {
      mpItems.push({
        title: "Envío",
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "COP",
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dolce-giftbox.vercel.app";

      const preference = {
      items: mpItems,
      external_reference: String(orderId),
      notification_url: `${siteUrl}/api/mercadopago-webhook`,
      back_urls: {
        success: `${siteUrl}/checkout/exito?pedido=${orderId}`,
        failure: `${siteUrl}/checkout/fallo?pedido=${orderId}`,
        pending: `${siteUrl}/checkout/pendiente?pedido=${orderId}`,
      },
      auto_return: "approved",
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de Mercado Pago:", data);
      return NextResponse.json(
        { error: data.message || "Error creando la preferencia de pago" },
        { status: 500 }
      );
    }

    // Con credenciales de PRUEBA, Mercado Pago da un link "sandbox_init_point".
    // Con las de PRODUCCIÓN (cuando estén listas), dará "init_point" en su lugar.
    const checkoutUrl = data.sandbox_init_point || data.init_point;

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("Error en crear-preferencia:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}