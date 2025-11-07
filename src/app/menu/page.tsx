import Shell from "@/components/Shell";
import MenuClient from "./MenuClient";
import { requireRole } from "@/lib/session";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  // 🔒 Cek role user (OWNER / PEGAWAI)
  const can = await requireRole(["OWNER", "PEGAWAI"]);
  if (!can.ok)
    return (
      <div className="p-6">
        Silakan{" "}
        <a className="text-blue-600 underline" href="/login">
          login
        </a>
        .
      </div>
    );

  // ✅ Ambil semua menu aktif dari database
  const { rows: menus } = await query(
    "SELECT * FROM menus WHERE is_active = true ORDER BY created_at DESC"
  );

  return (
    <Shell>
      <MenuClient initialMenus={menus} />
    </Shell>
  );
}
