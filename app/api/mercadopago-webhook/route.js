import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const url = new URL(request.url);
    let paymentId = url.searchParams.get("id") || url.searchParams.get("data.id");
    let topic = url.searchParams.get("topic") || url.searchParams.get("type");

    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // Algunas notificaciones de Mercado Pago llegan sin cuerpo, solo con la URL.
    }

    if (!paymentId && body?.data?.id) paymentId = body.data.id;
    if (!topic && body?.type) topic = body.type;

    // Solo nos interesan las notificaciones de pagos, no otros eventos.
    if (topic !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
    });
    const payment = await payRes.json();

    if (payment.status === "approved" && payment.external_reference) {
  const orderId = Number(payment.external_reference);

  await supabase.rpc("confirmar_pago_pedido", {
    p_order_id: orderId,
    p_payment_id: String(paymentId),
  });

  const { data: order, error: orderError } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!orderError && order?.sender_email) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/enviar-confirmacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          senderEmail: order.sender_email,
          senderName: order.sender_name,
          senderPhone: order.sender_phone,
          recipientName: order.recipient_name,
          city: order.city,
          neighborhood: order.neighborhood,
          address: order.address,
          deliveryDate: order.delivery_date,
          items: order.items,
          subtotal: order.subtotal,
          shippingCost: order.shipping_cost,
          total: order.total,
        }),
      });
    } catch (emailErr) {
      console.error("Error mandando correo de confirmación:", emailErr);
    }
  }
}

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error en webhook de Mercado Pago:", err);
    // Siempre respondemos 200 para que Mercado Pago no siga reintentando de más.
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}