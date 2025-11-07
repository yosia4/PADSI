import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get("name")||"");
  const email = form.get("email") ? String(form.get("email")) : null;
  const phone = form.get("phone") ? String(form.get("phone")) : null;
  await query("INSERT INTO customers (name,email,phone) VALUES ($1,$2,$3)", [name, email, phone]);
  return NextResponse.redirect(new URL("/pelanggan", req.url));
}

export async function GET() {
  const { rows } = await query("SELECT * FROM customers ORDER BY created_at DESC");
  return NextResponse.json(rows);
}
