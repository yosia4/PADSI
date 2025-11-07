import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const role = String(form.get("role") || "").toUpperCase();

  const { rows } = await query("SELECT id, email, name, role, password FROM users WHERE email=$1", [email]);
  const user = (rows as any)[0];
  if (!user || user.password !== password || user.role != role) {
    return NextResponse.redirect(new URL("/login?error=1", req.url));
  }
  await createSession(user.id);
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
