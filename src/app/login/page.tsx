"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  BadgeCheck,
  Layers3,
  Lock,
  Mail,
  Phone,
  Sparkles,
  Workflow,
} from "lucide-react";

const errorMessages: Record<string, string> = {
  email_empty: "Email wajib diisi.",
  email_invalid: "Akun tidak ditemukan.",
  password_empty: "Password wajib diisi.",
  password_invalid: "Password yang dimasukkan salah.",
  credentials_empty: "Email dan password belum diisi.",
  role_invalid: "Role tidak sesuai dengan akun ini.",
  rate: "Terlalu banyak percobaan. Coba lagi beberapa menit.",
  auth_required: "Sesi Anda sudah berakhir. Silakan login kembali untuk melanjutkan.",
};

type LookupResult = {
  id: number;
  name: string;
  phone: string | null;
  points: number;
  total_visits: number;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

const InlineFieldError = ({ message }: { message: string }) => (
  <div
    className="mt-2 flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50/90 px-3 py-2 text-xs font-semibold text-rose-600 shadow-[0_8px_30px_rgba(244,63,94,0.15)]"
    role="alert"
    aria-live="assertive"
  >
    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
    <span className="leading-snug">{message}</span>
  </div>
);

export default function LoginPage() {
  const [role, setRole] = useState<"OWNER" | "PEGAWAI">("PEGAWAI");
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [localErrors, setLocalErrors] = useState<FieldErrors>({});
  const year = useMemo(() => new Date().getFullYear(), []);
  const searchParams = useSearchParams();
  const [emailInput, setEmailInput] = useState(
    searchParams.get("email") || ""
  );
  const errorKey = searchParams.get("error");
  const errorMsg = errorKey ? errorMessages[errorKey] : null;
  const fieldErrorKeys = new Set([
    "email_empty",
    "email_invalid",
    "password_empty",
    "password_invalid",
    "credentials_empty",
  ]);
  const showGeneralError =
    errorMsg &&
    errorKey &&
    !fieldErrorKeys.has(errorKey as keyof typeof errorMessages);
  const isRoleError = errorKey === "role_invalid";
  const emailQueryValue = searchParams.get("email") || "";

  useEffect(() => {
    setEmailInput(emailQueryValue);
    setPasswordInput("");
    setLocalErrors({});
    setSubmitting(false);
  }, [emailQueryValue, errorKey]);

  const serverEmailMessage = (() => {
    if (!errorKey) return null;
    switch (errorKey) {
      case "email_empty":
      case "credentials_empty":
        return errorMessages.email_empty;
      case "email_invalid":
        return errorMessages.email_invalid;
      default:
        return null;
    }
  })();
  const serverPasswordMessage = (() => {
    if (!errorKey) return null;
    switch (errorKey) {
      case "password_empty":
      case "credentials_empty":
        return errorMessages.password_empty;
      case "password_invalid":
        return errorMessages.password_invalid;
      default:
        return null;
    }
  })();

  const emailErrorMessage = localErrors.email || serverEmailMessage;
  const passwordErrorMessage = localErrors.password || serverPasswordMessage;
  const hasEmailError = Boolean(emailErrorMessage);
  const hasPasswordError = Boolean(passwordErrorMessage);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const trimmedEmail = emailInput.trim();
    const trimmedPassword = passwordInput.trim();
    const nextErrors: FieldErrors = {};
    if (!trimmedEmail) {
      nextErrors.email = errorMessages.email_empty;
    }
    if (!trimmedPassword) {
      nextErrors.password = errorMessages.password_empty;
    }
    if (nextErrors.email || nextErrors.password) {
      e.preventDefault();
      setLocalErrors(nextErrors);
      setSubmitting(false);
      return;
    }
    setLocalErrors({});
    setSubmitting(true);
  }

  async function handlePointLookup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = lookupPhone.trim();
    if (!trimmed) {
      setLookupError("Masukkan nomor telepon pelanggan terlebih dahulu.");
      setLookupResult(null);
      return;
    }

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const res = await fetch("/api/customers/points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-requested-with": "fetch",
        },
        body: JSON.stringify({ phone: trimmed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Nomor telepon tidak ditemukan.");
      }
      setLookupResult(data.customer);
    } catch (err: any) {
      setLookupError(err.message || "Terjadi kesalahan saat mencari data.");
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-rose-500/30 blur-[160px]" />
        <div className="absolute bottom-10 right-[-6%] h-[420px] w-[420px] rounded-full bg-indigo-500/30 blur-[180px]" />
      </div>

      <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden h-full flex-col justify-between px-10 py-10 text-white lg:flex">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-2 text-sm font-semibold shadow-lg shadow-black/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              SMJJ • Sistem Manajemen Jambar Jabu
            </div>
            <h1 className="mt-7 text-4xl font-bold leading-snug">
              Kontrol penuh operasional Pelanggan, Menu, Riwayat, dan reward pelanggan di satu panel modern.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/70">
              SMJJ dirancang khusus untuk Jambar Jabu agar bisa mengelola CRM 
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur lg:grid-cols-3">
            {[
              { title: "SMJJ Insight", desc: "Dashboard Total Pelanggan, Riwayat Kunjungan, Total Penjualan", Icon: Sparkles },
              { title: "Workflow Otomatis", desc: "Approval Riwayat realtime", Icon: Workflow },
              { title: "Keamanan Berlapis", desc: "Akses dibatasi per-role", Icon: BadgeCheck },
            ].map(({ title, desc, Icon }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="inline-flex w-fit rounded-2xl bg-white/15 p-2">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-lg font-semibold">{title}</p>
                <p className="text-sm text-white/70">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28 rounded-3xl border border-white/10 bg-white/10 p-4">
              <Image src="/logo-jj.png" alt="Logo Jambar Jabu" fill className="object-contain" sizes="112px" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Powered By</p>
              <p className="text-2xl font-semibold">SMJJ • Sistem Manajemen Jambar Jabu</p>
              <p className="text-sm text-white/70">
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white px-6 py-8 sm:px-10">
          <div className="w-full max-w-4xl space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            <form
              action="/api/login"
              method="post"
              onSubmit={handleSubmit}
              className="flex h-full flex-col rounded-[32px] border border-slate-100 bg-white/85 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur"
            >
              <div className="mb-4 text-center">
                <span className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold text-indigo-600">
                  Selamat datang kembali
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">Masuk ke akun Anda</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Gunakan kredensial resmi untuk mengakses dasbor operasional
                </p>
                {(errorKey === "auth_required" || showGeneralError) && errorMsg && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50/90 px-4 py-2 text-xs font-semibold text-rose-600 shadow-[0_10px_30px_rgba(244,63,94,0.18)]" role="alert">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              <input type="hidden" name="role" value={role} />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Masuk sebagai</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  { label: "Owner", value: "OWNER" as const, helper: "Akses penuh" },
                  { label: "Pegawai", value: "PEGAWAI" as const, helper: "Operasional lapangan" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    data-cy={`role-${option.value.toLowerCase()}`}
                    className={`rounded-2xl border px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300 ${
                      role === option.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-slate-400">{option.helper}</p>
                  </button>
                ))}
              </div>
              {isRoleError && errorMsg && (
                <InlineFieldError message={errorMsg} />
              )}

              <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="email">
                Email
              </label>
              <div
                className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-200 ${
                  hasEmailError ? "border-rose-400 bg-rose-50 shadow-[0_15px_40px_rgba(244,63,94,0.15)]" : "border-slate-200"
                }`}
              >
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Masukan email"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              {hasEmailError && emailErrorMessage && (
                <InlineFieldError message={emailErrorMessage} />
              )}

              <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="password">
                Password
              </label>
              <div
                className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-200 ${
                  hasPasswordError ? "border-rose-400 bg-rose-50 shadow-[0_15px_40px_rgba(244,63,94,0.15)]" : "border-slate-200"
                }`}
              >
                <Lock className="h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
              {hasPasswordError && passwordErrorMessage && (
                <InlineFieldError message={passwordErrorMessage} />
              )}

              {errorKey === "rate" && (
                <p className="mt-3 text-xs text-amber-600">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-indigo-200 transition hover:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300"
              >
                {submitting ? "Memproses..." : "Masuk"}
              </button>

              <div className="mt-6 flex flex-col gap-2 text-center text-xs text-slate-400">
                <p>© {year} SMJJ — Sistem Manajemen Jambar Jabu</p>
                <p className="text-[11px]">
                  Versi internal untuk monitoring kinerja, jadwal, dan loyalitas pelanggan.
                </p>
              </div>
            </form>

            <section className="flex h-full flex-col rounded-[28px] border border-amber-100 bg-amber-50/80 p-5 shadow-[0_16px_45px_rgba(249,115,22,0.12)]">
              <div className="flex items-center gap-3 text-amber-700">
                <Layers3 className="h-6 w-6" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                    Cek Poin Pelanggan
                  </p>
                  <p className="text-xs text-amber-700/70">
                    Ketik nomor telepon pelanggan untuk menampilkan poin dan total kunjungan.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePointLookup} className="mt-4 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 focus-within:ring-2 focus-within:ring-amber-200">
                  <Phone className="h-5 w-5 text-amber-500" />
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="Masukkan nomor telepon pelanggan"
                    className="w-full bg-transparent text-sm text-amber-900 placeholder:text-amber-400 focus:outline-none"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full rounded-2xl bg-amber-500 py-3 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-amber-500/40 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {lookupLoading ? "Mencari..." : "Lihat Poin"}
                </button>
              </form>

              {lookupError && (
                <p className="mt-3 text-center text-xs font-medium text-rose-600">
                  {lookupError}
                </p>
              )}

              {lookupResult && (
                <div className="mt-4 rounded-2xl border border-white/60 bg-white/80 p-4 text-sm text-amber-900 shadow-inner">
                  <p className="text-base font-semibold">{lookupResult.name}</p>
                  <p className="text-xs text-amber-500">
                    {lookupResult.phone || "Nomor tidak tersedia"}
                  </p>
                  <div className="mt-3 flex items-center justify-between bg-amber-50/60 rounded-2xl px-4 py-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-amber-400">Poin</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {Number(lookupResult.points || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-amber-400">
                        Kunjungan
                      </p>
                      <p className="text-xl font-semibold">
                        {Number(lookupResult.total_visits || 0).toLocaleString("id-ID")}x
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
