import Shell from "@/components/Shell";
import { requireRole } from "@/lib/session";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RewardPage() {
  const can = await requireRole(["OWNER", "PEGAWAI"]);
  if (!can.ok) return <div className='p-6'>Silakan <a className='text-blue-600 underline' href='/login'>login</a>.</div>;

  const { rows: txs } = await query(`
    SELECT r.*, c.name as customer_name
    FROM rewards r JOIN customers c ON c.id = r.customer_id
    ORDER BY created_at DESC
  `);

  const { rows: customers } = await query("SELECT id, name FROM customers ORDER BY name ASC");

  return (
    <Shell>
      <h1 className="text-xl font-semibold mb-4">Poin Reward</h1>
      <form action="/api/rewards" method="post" className="mb-4 flex gap-2">
        <select name="customer_id" className="border rounded p-2">
          {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="type" className="border rounded p-2">
          <option value="EARN">EARN</option>
          <option value="REDEEM">REDEEM</option>
        </select>
        <input name="points" type="number" placeholder="Poin" className="border rounded p-2" />
        <input name="note" placeholder="Catatan" className="border rounded p-2" />
        <button className="bg-jjred text-white rounded px-3">Tambah</button>
      </form>
      <div className="rounded-xl bg-white shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Pelanggan</th>
              <th className="p-3 text-left">Tipe</th>
              <th className="p-3 text-right">Poin</th>
              <th className="p-3">Catatan</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t: any) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{new Date(t.created_at).toISOString().slice(0,10)}</td>
                <td className="p-3">{t.customer_name}</td>
                <td className="p-3">{t.type}</td>
                <td className="p-3 text-right">{t.points}</td>
                <td className="p-3">{t.note || "-"}</td>
                <td className="p-3">
                  <form action={`/api/rewards/${t.id}`} method="post" className="flex gap-2">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button className="text-red-600">Hapus</button>
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
