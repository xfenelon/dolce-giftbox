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

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { slug, name, category, price, available, description, image } = body;

  const { data, error } = await supabase
    .from("arma_items")
    .update({
      slug,
      name,
      category,
      price: parseInt(price, 10),
      available: available !== false,
      description: description || null,
      folder: CATEGORY_FOLDERS[category] || "",
      image: image || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("arma_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}