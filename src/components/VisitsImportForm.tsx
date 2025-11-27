"use client";

import { useState } from "react";
import { Upload, Info } from "lucide-react";

type Status = { type: "success" | "error"; message: string } | null;

export default function VisitsImportForm() {
  const [status, setStatus] = useState<Status>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setStatus({ type: "error", message: "Pilih berkas CSV / JSON terlebih dahulu." });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/visits/impor", {
        method: "POST",
        body: formData,
        headers: { "x-requested-with": "fetch" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Impor gagal, periksa format berkas.");
      }

      setStatus({
        type: "success",
        message: "Riwayat berhasil diimpor. Silakan refresh data untuk melihat perubahan.",
      });
      form.reset();
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Terjadi kesalahan." });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-gray-700 dark:text-gray-200 font-medium">
          Impor riwayat (CSV/JSON)
        </label>
        <input
          type="file"
          name="file"
          accept=".csv,.json"
          required
          className="text-xs text-gray-800 dark:text-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="flex items-center gap-1 bg-[#e31c1c] dark:bg-red-600 text-white text-xs px-3 py-1.5 rounded hover:bg-red-700 dark:hover:bg-red-500 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={14} />
          {isUploading ? "Mengunggah..." : "Impor"}
        </button>
      </form>

      <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-500/20 px-3 py-2 text-xs text-rose-600 dark:text-rose-200">
        <Info size={14} />
        Contoh kolom: <code className="font-semibold text-rose-700 dark:text-rose-100">nama_pelanggan, nomor_telepon, tanggal_transaksi, total_transaksi, poin_didapat</code>
      </div>

      {status && (
        <p
          className={`text-xs ${
            status.type === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
