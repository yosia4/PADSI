import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

function normalizePhone(value: string) {
  return value.replace(/\D+/g, "");
}

export async function POST(req: NextRequest) {
  const fallbackError = { error: "Nomor telepon wajib diisi.", field: "phone" };

  let payload: any = null;
  try {
    payload = await req.json();
  } catch {
    payload = null;
  }

  const rawPhone =
    (typeof payload?.phone === "string" && payload.phone) ||
    (typeof payload?.nomor === "string" && payload.nomor) ||
    "";

  const cleanPhone = normalizePhone(rawPhone.trim());

  if (!cleanPhone) {
    return NextResponse.json(fallbackError, { status: 400 });
  }

  const { rows } = await query(
    `
      SELECT id, name, phone, points, total_visits
      FROM customers
      WHERE REGEXP_REPLACE(COALESCE(phone,''), '\\D', '', 'g') = $1
      LIMIT 1
    `,
    [cleanPhone]
  );

  if (!rows[0]) {
    return NextResponse.json(
      { error: "Nomor telepon tidak ditemukan pada data pelanggan." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    customer: rows[0],
  });
}

