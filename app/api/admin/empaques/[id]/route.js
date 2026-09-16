import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
   const { slug, name, material, dimensions, price, available, photo, stock } = body;

  const { data, error } = await supabase
    .from("empaques")
    .update({
      slug,
      name,
      material,
      dimensions,
           price: parseInt(price, 10),
      available: available !== false,
      photo,
      stock: stock ? parseInt(stock, 10) : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ empaque: data });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("empaques").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}