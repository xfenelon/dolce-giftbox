import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { tracking_number, status } = body;

  const { data, error } = await supabase
    .from("pedidos")
    .update({
      tracking_number: tracking_number || null,
      status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pedido: data });
}