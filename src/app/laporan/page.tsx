import Shell from "@/components/Shell";
import { requireRole } from "@/lib/session";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import LaporanClient from "@/components/LaporanClient";

export const dynamic = "force-dynamic";

const emptyPayload = {
  pelanggan: 0,
  kunjungan: 0,
  penjualan: 0,
  favorit: "-",
  favoritImage: null as string | null,
  grafik: [] as Array<{ bulan: string; total: number }>,
  pelangganBulanan: [] as Array<{ bulan: string; total: number }>,
  redeemBulanan: [] as Array<{ bulan: string; total: number }>,
};

export default async function LaporanPage(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const searchParams = props?.searchParams ? await props.searchParams : {};
  const mockMode = searchParams?.mock;
  const can = await requireRole(["OWNER"]);
  if (!can.ok) redirect("/login");

  if (mockMode === "error") {
    return (
      <Shell>
        <LaporanClient data={emptyPayload} dataEmpty loadError="Data laporan gagal dimuat." />
      </Shell>
    );
  }

  if (mockMode === "empty") {
    return (
      <Shell>
        <LaporanClient data={emptyPayload} dataEmpty />
      </Shell>
    );
  }

  let payload = { ...emptyPayload };
  let loadError: string | undefined;

  try {
    const { rows: pelanggan } = await query("SELECT COUNT(*)::int AS total FROM customers");
    const { rows: kunjungan } = await query("SELECT COUNT(*)::int AS total FROM visits");
    const { rows: penjualan } = await query("SELECT COALESCE(SUM(total_spend),0)::int AS total FROM visits");
    const { rows: favorit } = await query(`
      SELECT m.name, m.image_url, COUNT(v.id) AS total
      FROM visits v
      JOIN menus m ON m.id = v.menu_id
      GROUP BY m.name, m.image_url
      ORDER BY total DESC
      LIMIT 1
    `);
    const { rows: grafik } = await query(`
      SELECT TO_CHAR(visited_at, 'Mon') AS bulan, SUM(total_spend)::int AS total
      FROM visits
      GROUP BY bulan
      ORDER BY MIN(visited_at)
    `);
    const { rows: growth } = await query(`
      SELECT
        TO_CHAR(date_trunc('month', created_at), 'Mon') AS bulan,
        COUNT(*)::int AS total,
        date_trunc('month', created_at) AS month_sort
      FROM customers
      WHERE created_at >= date_trunc('month', NOW()) - INTERVAL '11 months'
      GROUP BY bulan, month_sort
      ORDER BY month_sort
    `);
    const { rows: redeem } = await query(`
      SELECT
        TO_CHAR(date_trunc('month', created_at), 'Mon') AS bulan,
        COALESCE(SUM(CASE WHEN type = 'REDEEM' THEN points ELSE 0 END),0)::int AS total,
        date_trunc('month', created_at) AS month_sort
      FROM rewards
      WHERE created_at >= date_trunc('month', NOW()) - INTERVAL '11 months'
      GROUP BY bulan, month_sort
      ORDER BY month_sort
    `);

    payload = {
      pelanggan: pelanggan[0]?.total || 0,
      kunjungan: kunjungan[0]?.total || 0,
      penjualan: penjualan[0]?.total || 0,
      favorit: favorit[0]?.name || "-",
      favoritImage: favorit[0]?.image_url || null,
      grafik,
      pelangganBulanan: growth,
      redeemBulanan: redeem,
    };
  } catch (error) {
    loadError = "Data laporan gagal dimuat.";
  }

  const dataEmpty =
    payload.pelanggan === 0 &&
    payload.kunjungan === 0 &&
    payload.penjualan === 0 &&
    payload.grafik.length === 0;

  return (
    <Shell>
      <LaporanClient data={payload} dataEmpty={dataEmpty} loadError={loadError} />
    </Shell>
  );
}
