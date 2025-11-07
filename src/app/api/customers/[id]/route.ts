import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ params sekarang Promise
) {
  const { id } = await params; // ✅ harus di-await dulu
  const form = await req.formData();
  const method = String(form.get("_method") || "").toUpperCase();

  if (method === "DELETE") {
    // 🗑️ Hapus pelanggan
    await query("DELETE FROM customers WHERE id=$1", [id]);
  } 
  else if (method === "PUT") {
    // ✏️ Edit pelanggan
    const name = form.get("name");
    const email = form.get("email");
    const phone = form.get("phone");

    await query(
      "UPDATE customers SET name=$1, email=$2, phone=$3 WHERE id=$4",
      [name, email, phone, id]
    );
  }

  // 🔁 Redirect ke halaman pelanggan
  return NextResponse.redirect(new URL("/pelanggan", req.url));
}
