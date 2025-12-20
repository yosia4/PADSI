import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const expectsJson = (req: NextRequest) =>
  req.headers.get("x-requested-with") === "fetch";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const form = await req.formData();
  const method = String(form.get("_method") || "").toUpperCase();

  if (method === "DELETE") {
    const { rows } = await query(
      "SELECT customer_id, earned_pts FROM visits WHERE id=$1",
      [id]
    );
    const visit = (rows as any)[0];
    if (!visit) {
      if (expectsJson(req)) {
        return NextResponse.json(
          { error: "Data riwayat tidak ditemukan." },
          { status: 404 }
        );
      }
      return NextResponse.redirect(new URL("/riwayat", req.url));
    }

    await query(
      `UPDATE customers
       SET total_visits = GREATEST(total_visits - 1, 0),
           points = GREATEST(points - $1, 0)
       WHERE id = $2`,
      [visit.earned_pts, visit.customer_id]
    );
    await query("DELETE FROM visits WHERE id=$1", [id]);

    if (expectsJson(req)) {
      return NextResponse.json({ success: true });
    }
  }

  return NextResponse.redirect(new URL("/riwayat", req.url));
}
