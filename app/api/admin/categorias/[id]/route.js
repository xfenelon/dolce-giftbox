import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { name, description, photo_slug, sort_order } = body;
  const newName = name.trim();

  const { data: oldCategoria, error: fetchError } = await supabase
    .from("categorias")
    .select("name")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const oldName = oldCategoria.name;

  const { data, error } = await supabase
    .from("categorias")
    .update({
      name: newName,
      description: description || null,
      photo_slug: photo_slug || null,
      sort_order: sort_order || 0,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (oldName !== newName) {
    const { error: cascadeError } = await supabase
      .from("productos")
      .update({ category: newName })
      .eq("category", oldName);

    if (cascadeError) {
      console.error("Error actualizando productos con la categoria renombrada:", cascadeError);
    }
  }

  return NextResponse.json({ categoria: data });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}