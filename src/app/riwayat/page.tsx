import Shell from "@/components/Shell";
import { requireRole } from "@/lib/session";
import { query } from "@/lib/db";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // 🧩 Pastikan searchParams di-await (karena Promise di Next.js 16)
  const { q } = await searchParams;
  const keyword = q ? `%${q}%` : "%%";

  // 🔐 Validasi role user
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

  // 🗂️ Ambil data kunjungan
  const { rows: visits } = await query(
    `
    SELECT v.*, c.name as customer_name
    FROM visits v
    JOIN customers c ON c.id = v.customer_id
    WHERE c.name ILIKE $1
    ORDER BY visited_at DESC
  `,
    [keyword]
  );

  return (
    <Shell>
      <h1 className="text-xl font-semibold mb-4">Riwayat Kunjungan</h1>

      {/* 🔍 Form Pencarian */}
      <form method="get" className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          placeholder="Cari nama pelanggan..."
          defaultValue={q || ""}
          className="border rounded p-2 w-64 focus:ring-2 focus:ring-[#e31c1c] focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#e31c1c] text-white px-3 rounded hover:bg-red-700 transition"
        >
          Cari
        </button>
      </form>

      {/* 📋 Tabel Data */}
      <div className="overflow-auto rounded-xl bg-white dark:bg-[#121212] shadow transition-colors duration-300">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Pelanggan</th>
              <th className="p-3 text-right">Belanja</th>
              <th className="p-3 text-right">Poin</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v: any) => (
              <tr
                key={v.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3">
                  {new Date(v.visited_at).toISOString().slice(0, 10)}
                </td>
                <td className="p-3">{v.customer_name}</td>
                <td className="p-3 text-right">Rp {v.total_spend}</td>
                <td className="p-3 text-right">{v.earned_pts}</td>
                <td className="p-3 text-center">
                  <form
                    action={`/api/visits/${v.id}`}
                    method="post"
                    className="flex justify-center"
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      title="Hapus"
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
