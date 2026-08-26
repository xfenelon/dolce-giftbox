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
      await supabase.rpc("confirmar_pago_pedido", {
        p_order_id: Number(payment.external_reference),
        p_payment_id: String(paymentId),
      });
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