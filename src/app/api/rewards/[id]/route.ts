import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const form = await req.formData();
  const method = String(form.get("_method") || "").toUpperCase();
  if (method === "DELETE") {
    const { rows } = await query("SELECT customer_id, type, points FROM rewards WHERE id=$1", [id]);
    const r = (rows as any)[0];
    if (r) {
      if (r.type === "EARN") {
        await query("UPDATE customers SET points = GREATEST(points - $1,0) WHERE id=$2", [r.points, r.customer_id]);
      } else {
        await query("UPDATE customers SET points = points + $1 WHERE id=$2", [r.points, r.customer_id]);
      }
    }
    await query("DELETE FROM rewards WHERE id=$1", [id]);
  }
  return NextResponse.redirect(new URL("/reward", req.url));
}
