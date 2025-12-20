import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const expectsJson = (req: NextRequest) =>
  req.headers.get("x-requested-with") === "fetch";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const customer_id = Number(form.get("customer_id"));
  const total_spend = Number(form.get("total_spend"));
  const isInvalid =
    !Number.isFinite(customer_id) ||
    !Number.isFinite(total_spend) ||
    total_spend <= 0;
  if (isInvalid) {
    const message = "Data kunjungan tidak valid.";
    if (expectsJson(req)) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const redirectUrl = new URL("/riwayat?error=invalid", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const { rows: customers } = await query(
    "SELECT id FROM customers WHERE id=$1",
    [customer_id]
  );
  if (customers.length === 0) {
    const message = "Data pelanggan tidak ditemukan.";
    if (expectsJson(req)) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    const redirectUrl = new URL("/riwayat?error=customer_missing", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const earned = Math.floor(total_spend / 1000);
  const { rows } = await query(
    "INSERT INTO visits (customer_id,total_spend,earned_pts) VALUES ($1,$2,$3) RETURNING *",
    [customer_id, total_spend, earned]
  );
  await query(
    "UPDATE customers SET total_visits = total_visits + 1, points = points + $1 WHERE id=$2",
    [earned, customer_id]
  );
  await query(
    "INSERT INTO rewards (customer_id,type,points,note) VALUES ($1,'EARN',$2,$3)",
    [customer_id, earned, "Poin otomatis dari kunjungan"]
  );

  if (expectsJson(req)) {
    return NextResponse.json(rows[0]);
  }
  return NextResponse.redirect(new URL("/riwayat", req.url));
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const pageParam = Number(searchParams.get("page") || "1");
  const perPageParam = Number(searchParams.get("perPage") || "12");
  const perPage = Number.isFinite(perPageParam) && perPageParam > 0 ? perPageParam : 12;
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const offset = (page - 1) * perPage;
  const keyword = q ? `%${q}%` : "%%";

  const [visitsResult, countResult] = await Promise.all([
    query(
      `
      SELECT v.*, c.name as customer_name
      FROM visits v
      JOIN customers c ON c.id = v.customer_id
      WHERE c.name ILIKE $1
      ORDER BY visited_at DESC
      LIMIT $2 OFFSET $3
    `,
      [keyword, perPage, offset]
    ),
    query(
      `
      SELECT COUNT(*)::int as total
      FROM visits v
      JOIN customers c ON c.id = v.customer_id
      WHERE c.name ILIKE $1
    `,
      [keyword]
    ),
  ]);

  const total = countResult.rows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return NextResponse.json({
    visits: visitsResult.rows,
    total,
    totalPages,
    page,
    perPage,
  });
}
