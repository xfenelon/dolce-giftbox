import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
        const { slug, name, category, price, bullets, available, image, packaging_slug, stock, variants, option_groups } = body;

  const { data, error } = await supabase
    .from("productos")
    .update({
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
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ producto: data });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}