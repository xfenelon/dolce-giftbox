import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("empaques")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ empaques: data });
}

export async function POST(request) {
  const body = await request.json();
    const { slug, name, material, dimensions, price, available, photo, stock } = body;

  if (!slug || !name || !material || !dimensions || !price || !photo) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("empaques")
    .insert({
      slug,
      name,
      material,
      dimensions,
          price: parseInt(price, 10),
      available: available !== false,
      photo,
      stock: stock ? parseInt(stock, 10) : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ empaque: data });
}