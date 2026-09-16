import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORY_FOLDERS = {
  "Cuidado personal": "cuidado-personal",
  "Hogar y ambiente": "hogar-ambiente",
  "Productos comestibles": "comestibles",
  "Para hombre": "hombre",
  "Para bebé": "bebe",
};

export async function GET() {
  const { data, error } = await supabase
    .from("arma_items")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data });
}

export async function POST(request) {
  const body = await request.json();
   const { slug, name, category, price, available, description, image, stock } = body;

  if (!slug || !name || !category || !price) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("arma_items")
    .insert({
      slug,
      name,
      category,
      price: parseInt(price, 10),
      available: available !== false,
            description: description || null,
      folder: CATEGORY_FOLDERS[category] || "",
      image: image || null,
      stock: stock ? parseInt(stock, 10) : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}