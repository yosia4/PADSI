import Shell from "@/components/Shell";
import { requireRole } from "@/lib/session";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import { ensureVisitsImportedAtColumn } from "@/lib/schema";
import VisitsPanel from "./VisitsPanel";

export const dynamic = "force-dynamic";

export default async function RiwayatPage() {
  const can = await requireRole(["OWNER", "PEGAWAI"]);
  if (!can.ok) redirect("/login");
  await ensureVisitsImportedAtColumn();

  const perPage = 12;
  const page = 1;
  const offset = (page - 1) * perPage;
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
      ["%%", perPage, offset]
    ),
    query(
      `
      SELECT COUNT(*)::int as total
      FROM visits v
      JOIN customers c ON c.id = v.customer_id
      WHERE c.name ILIKE $1
    `,
      ["%%"]
    ),
  ]);

  const totalVisits = countResult.rows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalVisits / perPage));

  return (
    <Shell>
      <h1 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Riwayat Kunjungan
      </h1>
      <VisitsPanel
        initialData={{
          visits: visitsResult.rows,
          total: totalVisits,
          totalPages,
          page,
          perPage,
        }}
      />
    </Shell>
  );
}
