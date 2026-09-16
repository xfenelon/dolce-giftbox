import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ productos: data });
}

export async function POST(request) {
  const body = await request.json();
              const { slug, name, category, price, bullets, available, image, packaging_slug, stock, variants, option_groups } = body;

  if (!slug || !name || !category) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("productos")
    .insert({
      slug,
      name,
      category,
      price: price || null,
      bullets: bullets || [],
            available: available !== false,
           image: image || null,
      packaging_slug: packaging_slug || null,
           stock: stock === "" || stock === undefined ? null : stock,
           variants: variants || null,
      option_groups: option_groups || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ producto: data });
}