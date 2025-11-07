"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function MenuClient({ initialMenus }: { initialMenus: any[] }) {
  const [menus, setMenus] = useState(initialMenus);
  const [search, setSearch] = useState("");

  // 🧾 Tambah menu baru
  async function handleAddMenu(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // ✅ simpan referensi form sebelum await

    const res = await fetch("/api/menus", {
      method: "POST",
      body: new FormData(form),
    });

    if (res.ok) {
      form.reset(); // ✅ tidak error lagi
      const updated = await fetch("/api/menus").then((r) => r.json());
      setMenus(updated);
    }
  }

  // ❌ Hapus menu
  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;
    await fetch(`/api/menus/${id}`, {
      method: "POST",
      body: new URLSearchParams({ _method: "DELETE" }),
    });
    setMenus((prev) => prev.filter((m) => m.id !== id));
  }

  // 🔍 Filter hasil pencarian
  const filtered = menus.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        🍴 Menu Favorit
      </h1>

      {/* === Tambah dan Cari === */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* Form Tambah Menu */}
        <form
          onSubmit={handleAddMenu}
          className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <input
            name="name"
            placeholder="Nama Menu"
            className="border rounded p-2 text-sm"
            required
          />
          <input
            name="price"
            placeholder="Harga"
            type="number"
            className="border rounded p-2 text-sm w-28"
            required
          />
          <input
            name="image_url"
            placeholder="URL Gambar"
            className="border rounded p-2 text-sm w-60"
          />
          <button
            type="submit"
            className="bg-[#e31c1c] text-white rounded px-3 py-2 text-sm hover:bg-red-700"
          >
            Tambah
          </button>
        </form>

        {/* Form Cari */}
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm text-gray-700">Cari</span>
          <input
            type="text"
            placeholder="Nama menu..."
            className="border rounded px-2 py-1 text-sm flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* === Daftar Menu === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((menu) => (
          <div
            key={menu.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* 🖼️ Gambar menu */}
            <img
              src={menu.image_url || "/placeholder.png"}
              alt={menu.name}
              className="w-full h-48 object-cover"
            />

            {/* ℹ️ Informasi menu */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div className="text-center">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {menu.name}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Rp {Number(menu.price || 0).toLocaleString("id-ID")}
                </p>
              </div>

              {/* 🔘 Tombol aksi */}
              <div className="flex justify-center gap-3 mt-4">
                {/* Tombol Edit */}
                <a
                  href={`/menu/edit/${menu.id}`}
                  title="Edit"
                  className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Edit size={16} />
                </a>

                {/* Tombol Hapus */}
                <button
                  onClick={() => handleDelete(menu.id)}
                  title="Hapus"
                  className="p-2 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            Menu tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
