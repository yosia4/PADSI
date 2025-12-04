import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const expectsJson = (req: NextRequest) =>
  req.headers.get("x-requested-with") === "fetch";

const buildErrorResponse = (
  req: NextRequest,
  message: string,
  slug = "invalid_request",
  status = 400
) => {
  if (expectsJson(req)) {
    return NextResponse.json({ error: message }, { status });
  }
  const redirectUrl = new URL("/reward", req.url);
  redirectUrl.searchParams.set("error", slug);
  redirectUrl.searchParams.set("message", message);
  return NextResponse.redirect(redirectUrl);
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const customer_id = Number(form.get("customer_id"));
  const rawType = String(form.get("type") || "EARN").toUpperCase();
  const type = rawType === "REDEEM" ? "REDEEM" : "EARN";
  const rawPoints = Number(form.get("points"));
  const points = Number.isFinite(rawPoints) ? Math.max(0, Math.floor(rawPoints)) : 0;
  const note = form.get("note") ? String(form.get("note")) : null;

  if (!Number.isFinite(customer_id) || customer_id <= 0) {
    return buildErrorResponse(req, "Pelanggan tidak valid.", "customer_invalid");
  }

  if (points <= 0) {
    return buildErrorResponse(req, "Jumlah poin harus lebih dari 0.", "points_invalid");
  }

  const { rows: customerRows } = await query(
    "SELECT id, points FROM customers WHERE id=$1 LIMIT 1",
    [customer_id]
  );
  const customer = customerRows[0] as { id: number; points: number } | undefined;

  if (!customer) {
    return buildErrorResponse(req, "Data pelanggan tidak ditemukan.", "customer_missing", 404);
  }

  if (type === "REDEEM" && Number(customer.points || 0) < points) {
    return buildErrorResponse(req, "Poin pelanggan tidak mencukupi untuk hadiah ini.", "points_insufficient");
  }

  const { rows: inserted } = await query(
    "INSERT INTO rewards (customer_id,type,points,note) VALUES ($1,$2,$3,$4) RETURNING *",
    [customer_id, type, points, note]
  );

  if (type === "EARN") {
    await query("UPDATE customers SET points = points + $1 WHERE id=$2", [points, customer_id]);
  } else {
    await query("UPDATE customers SET points = GREATEST(points - $1,0) WHERE id=$2", [points, customer_id]);
  }

  if (expectsJson(req)) {
    return NextResponse.json({ reward: inserted[0], balance: type === "EARN" ? customer.points + points : customer.points - points });
  }

  return NextResponse.redirect(new URL("/reward", req.url));
}

export async function GET() {
  const { rows } = await query("SELECT * FROM rewards ORDER BY created_at DESC");
  return NextResponse.json(rows);
}
