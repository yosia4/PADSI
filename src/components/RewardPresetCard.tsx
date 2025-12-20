"use client";

import { useState } from "react";
import AppDialog from "./AppDialog";

type Preset = {
  key: string;
  label: string;
  points: string;
  note: string;
  customerId: string;
};

export default function RewardPresetCard({
  preset,
}: {
  preset: Preset;
}) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleRedeem() {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append("customer_id", preset.customerId);
      form.append("type", "REDEEM");
      form.append("points", preset.points);
      form.append("note", preset.note);

      const res = await fetch("/api/rewards", {
        method: "POST",
        body: form,
        headers: { "x-requested-with": "fetch" },
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error || "Penukaran gagal. Coba lagi.");
      }
      const balanceMessage =
        typeof payload?.balance === "number"
          ? `Penukaran berhasil. Sisa poin ${payload.balance.toLocaleString("id-ID")} pts.`
          : "Penukaran berhasil tersimpan.";
      setStatus({ type: "success", message: balanceMessage });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Terjadi kesalahan.",
      });
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm flex flex-col gap-3 animate-pop">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
          Paket Tukar
        </p>
        <h4 className="text-lg font-bold text-gray-900">{preset.label}</h4>
        <p className="text-sm text-gray-500">
          Redeem {preset.points} poin untuk {preset.label.toLowerCase()}.
        </p>
      </div>
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Memproses..." : "Tukar Sekarang"}
      </button>
      {status && (
        <p
          className={`text-xs ${
            status.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {status.message}
        </p>
      )}

      <AppDialog
        open={confirmOpen}
        title="Konfirmasi Tukar Reward"
        description={`Tukar ${preset.points} poin untuk ${preset.label.toLowerCase()}?`}
        confirmText="Tukar"
        cancelText="Batal"
        tone="info"
        onConfirm={handleRedeem}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
