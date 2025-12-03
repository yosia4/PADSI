"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import VisitsImportForm from "@/components/VisitsImportForm";
import VisitDeleteButton from "@/components/VisitDeleteButton";
import { jsonFetcher } from "@/lib/fetcher";

type Visit = {
  id: number;
  customer_name: string;
  visited_at: string;
  imported_at: string | null;
  total_spend: number;
  earned_pts: number;
};

type VisitsResponse = {
  visits: Visit[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
};

export default function VisitsPanel({ initialData }: { initialData: VisitsResponse }) {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = initialData.perPage;
  const key = useMemo(() => `/api/visits?q=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`, [query, page, perPage]);
  const { data, isLoading, mutate } = useSWR<VisitsResponse>(key, jsonFetcher, {
    fallbackData: initialData,
    keepPreviousData: true,
  });

  const visits = data?.visits ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;
  const startEntry = total === 0 ? 0 : (currentPage - 1) * (data?.perPage ?? perPage) + 1;
  const endEntry = Math.min(currentPage * (data?.perPage ?? perPage), total);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuery(searchInput.trim());
    setPage(1);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-4 text-gray-800 dark:text-gray-100">
        <VisitsImportForm onImported={() => mutate()} />

        <form onSubmit={handleSearch} className="flex gap-2 text-sm">
          <input
            type="text"
            name="q"
            placeholder="Cari nama pelanggan..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64 rounded border border-gray-200 bg-white p-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-rose-500/40 dark:focus:ring-rose-500/20"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Cari
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white to-rose-50 shadow-lg transition-colors dark:border-white/10 dark:from-[#101010] dark:to-[#181818] dark:shadow-black/60 glow-panel animate-pop">
        <div className="flex items-center gap-3 border-b border-white/70 bg-white/60 px-6 py-4 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <img
            src="/logo-jj.png"
            alt="Logo JJ"
            className="h-11 w-11 rounded-full object-cover shadow animate-floaty"
            loading="lazy"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 dark:text-rose-200">
              SMJJ
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Riwayat Kunjungan
            </h3>
          </div>
        </div>
        <div className="relative overflow-auto">
          <table className="table-playful">
            <thead>
              <tr>
                <th className="text-left">Tanggal</th>
                <th className="text-left">Diimpor</th>
                <th className="text-left">Pelanggan</th>
                <th className="text-right">Belanja</th>
                <th className="text-right">Poin</th>
                <th className="text-center sticky right-0 bg-white/90 backdrop-blur">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => {
                const visitedDate = new Date(v.visited_at);
                const importedDate = v.imported_at ? new Date(v.imported_at) : null;
                const visitedDateText = visitedDate.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const visitedTimeText = visitedDate.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const importedDateText = importedDate
                  ? importedDate.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-";
                const importedTimeText = importedDate
                  ? importedDate.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <tr key={v.id}>
                    <td className="font-semibold text-gray-900 dark:text-gray-100">
                      <div>{visitedDateText}</div>
                      <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Pukul {visitedTimeText} WIB
                      </p>
                    </td>
                    <td className="text-gray-700 dark:text-gray-200">
                      {importedDate ? (
                        <>
                          <div className="font-medium">{importedDateText}</div>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            Jam {importedTimeText} WIB
                          </p>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Belum tercatat
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {v.customer_name}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        #{v.id.toString().padStart(4, "0")}
                      </p>
                    </td>
                    <td className="text-right font-semibold text-rose-600 dark:text-rose-300">
                      Rp {Number(v.total_spend || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 animate-badge dark:bg-rose-500/20 dark:text-rose-200">
                        +{v.earned_pts} pts
                      </span>
                    </td>
                    <td className="sticky right-0 bg-white/90 text-center dark:bg-black/40">
                      <VisitDeleteButton visitId={v.id} onDeleted={() => mutate()} />
                    </td>
                  </tr>
                );
              })}

              {!isLoading && visits.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500 dark:text-gray-400" colSpan={6}>
                    Belum ada riwayat kunjungan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/80 px-6 py-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-gray-300">
          <p>
            Menampilkan {startEntry}&ndash;{endEntry} dari {total} kunjungan
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-400 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/10 dark:disabled:border-white/10 dark:disabled:text-gray-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
            >
              &lsaquo; Sebelumnya
            </button>
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-white/20 dark:text-gray-200">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages || total === 0}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-400 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/10 dark:disabled:border-white/10 dark:disabled:text-gray-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
            >
              Selanjutnya &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
