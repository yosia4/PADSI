"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Users, Clock, ShoppingBag, Trophy, Printer } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LaporanClient({ data }: any) {
  const handleCetak = () => {
    const doc = new jsPDF();
    doc.text(" Laporan Keuangan & Aktivitas Jambar Jabu", 14, 15);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 25);

    autoTable(doc, {
      head: [["Kategori", "Nilai"]],
      body: [
        ["Total Pelanggan", data.pelanggan.toString()],
        ["Total Kunjungan", data.kunjungan.toString()],
        ["Total Penjualan (Rp)", data.penjualan.toLocaleString("id-ID")],
        ["Menu Terfavorit", data.favorit],
      ],
      startY: 35,
    });

    doc.save("laporan.pdf");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📈 Laporan</h1>
        <button
          onClick={handleCetak}
          className="flex items-center gap-2 bg-[#e31c1c] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Printer size={18} /> Cetak PDF
        </button>
      </div>

      {/* Ringkasan Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card icon={<Users />} title="Total Pelanggan" value={data.pelanggan} color="red" />
        <Card icon={<Clock />} title="Total Kunjungan" value={data.kunjungan} color="blue" />
        <Card
          icon={<ShoppingBag />}
          title="Total Penjualan (Rp)"
          value={`Rp ${data.penjualan.toLocaleString("id-ID")}`}
          color="green"
        />
        <Card icon={<Trophy />} title="Menu Terfavorit" value={data.favorit} color="yellow" />
      </div>

      {/* Grafik */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Grafik Penjualan per Bulan
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.grafik}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#e31c1c" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ icon, title, value, color }: any) {
  const colors: any = {
    red: "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    yellow: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white",
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className={`p-4 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h2 className="text-xl font-bold text-gray-800">{value}</h2>
      </div>
    </div>
  );
}
