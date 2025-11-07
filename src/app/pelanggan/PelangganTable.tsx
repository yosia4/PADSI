"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function PelangganTable({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data pelanggan (nama, email, telepon)
  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* === Bagian Tambah & Cari === */}
      <div className="flex justify-between items-center mb-4">
        <form
          action="/api/customers"
          method="post"
          className="flex gap-2 items-center"
        >
          <input
            name="name"
            placeholder="Nama"
            className="border rounded p-2 text-sm"
            required
          />
          <input
            name="email"
            placeholder="Email"
            className="border rounded p-2 text-sm"
          />
          <input
            name="phone"
            placeholder="Telepon"
            className="border rounded p-2 text-sm"
          />
          <button
            type="submit"
            className="bg-[#e31c1c] text-white rounded px-3 py-2 text-sm hover:bg-red-700"
          >
            Tambah
          </button>
        </form>

        {/* Input cari */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Cari</span>
          <input
            type="text"
            placeholder="Nama / Email / Telepon"
            className="border rounded px-2 py-1 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* === Tabel Data Pelanggan === */}
      <div className="overflow-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border w-10 text-center">No</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Telepon</th>
              <th className="p-3 border text-center">Poin</th>
              <th className="p-3 border text-center">Kunjungan</th>
              <th className="p-3 border text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any, i: number) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.email || "-"}</td>
                <td className="border p-2">{c.phone || "-"}</td>
                <td className="border p-2 text-center">{c.points}</td>
                <td className="border p-2 text-center">{c.total_visits}</td>

                {/* Kolom aksi */}
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {/* Edit */}
                    <a
                      href={`/pelanggan/edit/${c.id}`}
                      title="Edit"
                      className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Edit size={16} />
                    </a>

                    {/* Hapus */}
                    <form
                      action={`/api/customers/${c.id}`}
                      method="post"
                      className="inline-block"
                    >
                      <input type="hidden" name="_method" value="DELETE" />
                      <button
                        type="submit"
                        title="Hapus"
                        className="p-2 rounded bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 p-4">
                  Tidak ada pelanggan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
