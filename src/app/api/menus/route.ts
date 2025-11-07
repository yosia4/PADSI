import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// ➕ Tambah menu baru
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get("name") || "");
  const price = Number(form.get("price") || 0);
  const image_url = String(form.get("image_url") || "");

  // Simpan menu baru ke database
  await query(
    "INSERT INTO menus (name, price, image_url, is_active) VALUES ($1, $2, $3, true)",
    [name, price, image_url]
  );

  return NextResponse.redirect(new URL("/menu", req.url));
}

// 📦 Ambil semua menu aktif
export async function GET() {
  const { rows } = await query(
    "SELECT id, name, price, image_url, created_at FROM menus WHERE is_active = true ORDER BY created_at DESC"
  );
  return NextResponse.json(rows);
}
