import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  console.log("DEBUG id recibido:", id);
  console.log("DEBUG tiene SERVICE_ROLE_KEY:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log("DEBUG SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!id) {
    return NextResponse.json({ error: "Falta el id del pedido" }, { status: 400 });
  }

  const { data: order, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id", id)
    .single();

  console.log("DEBUG error:", error);
  console.log("DEBUG order:", order);

  if (error || !order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ order });
}