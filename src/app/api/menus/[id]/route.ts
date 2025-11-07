import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params; // ✅ harus di-await di Next.js 16
  const formData = await request.formData();
  const method = formData.get("_method");

  // Jika method adalah DELETE
  if (method === "DELETE") {
    await query("DELETE FROM menus WHERE id = $1", [id]);
    return NextResponse.redirect(new URL("/menu", request.url));
  }

  // Jika method adalah PUT (update data)
  if (method === "PUT") {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const image_url = formData.get("image_url") as string;

    await query(
      "UPDATE menus SET name = $1, price = $2, image_url = $3 WHERE id = $4",
      [name, price, image_url, id]
    );

    return NextResponse.redirect(new URL("/menu", request.url));
  }

  return NextResponse.json({ error: "Metode tidak didukung" }, { status: 400 });
}
