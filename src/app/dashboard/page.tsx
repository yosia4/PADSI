import Shell from "@/components/Shell";
import { requireRole } from "@/lib/session";
import { query } from "@/lib/db";
import { Users, Clock, ShoppingBag, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const can = await requireRole(["OWNER", "PEGAWAI"]);
  if (!can.ok)
    return (
      <div className="p-6">
        Silakan{" "}
        <a href="/login" className="text-blue-600 underline">
          login
        </a>
        .
      </div>
    );

  const [{ rows: pelanggan }, { rows: kunjungan }, { rows: penjualan }] =
    await Promise.all([
      query("SELECT COUNT(*)::int AS total FROM customers"),
      query("SELECT COUNT(*)::int AS total FROM visits"),
      query("SELECT COALESCE(SUM(total_spend),0)::int AS total FROM visits"),
    ]);

  const totalPelanggan = pelanggan[0]?.total || 0;
  const totalKunjungan = kunjungan[0]?.total || 0;
  const totalPenjualan = penjualan[0]?.total || 0;

  return (
    <Shell>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard Utama
        </h1>

        {/* Grid Card Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Pelanggan */}
          <div className="group bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="bg-red-100 text-red-600 p-4 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Pelanggan
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {totalPelanggan}
              </h2>
            </div>
          </div>

          {/* Total Kunjungan */}
          <div className="group bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Riwayat Kunjungan
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {totalKunjungan}
              </h2>
            </div>
          </div>

          {/* Total Penjualan */}
          <div className="group bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="bg-green-100 text-green-600 p-4 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all duration-200">
              <ShoppingBag size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Penjualan (Rp)
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {Number(totalPenjualan).toLocaleString("id-ID")}
              </h2>
            </div>
          </div>
        </div>

        {/* Tambahan Section Opsional */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Aktivitas Terbaru
            </h2>
            <p className="text-gray-500 text-sm">
              Laporan transaksi pelanggan terbaru akan tampil di sini.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Menu Favorit Bulan Ini
            </h2>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
                <Trophy size={24} />
              </div>
              <p className="text-gray-600 text-sm">
                Data menu dengan pesanan terbanyak akan ditampilkan di sini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
