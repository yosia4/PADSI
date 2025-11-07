import Shell from "@/components/Shell";
import { requireRole } from "@/lib/session";
import { query } from "@/lib/db";
import PelangganTable from "./PelangganTable";

export const dynamic = "force-dynamic";

export default async function PelangganPage() {
  const can = await requireRole(["OWNER", "PEGAWAI"]);
  if (!can.ok)
    return (
      <div className="p-6">
        Silakan{" "}
        <a className="text-blue-600 underline" href="/login">
          login
        </a>.
      </div>
    );

  const { rows: customers } = await query(
    "SELECT * FROM customers ORDER BY created_at DESC"
  );

  return (
    <Shell>
      <h1 className="text-xl font-semibold mb-4">Pelanggan</h1>
      <PelangganTable customers={customers} />
    </Shell>
  );
}
