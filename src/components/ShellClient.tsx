"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  LogOut,
  LayoutDashboard,
  Users,
  ClipboardList,
  Gift,
  FileText,
  ListChecks,
  Moon,
  Sun,
  Settings,
  Menu,
  X,
} from "lucide-react";
import AppDialog from "./AppDialog";
import ToastProvider from "./ToastProvider";
import ProfileSettingsModal from "./ProfileSettingsModal";

export default function ShellClient({
  user,
  children,
}: {
  user: any;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "SMJJ";
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  useEffect(() => setProfile(user), [user]);
  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);
  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    setLogoutError(null);
    setLogoutLoading(true);
    try {
      const response = await fetch("/api/logout", { method: "GET" });
      if (!response.ok) throw new Error("Logout failed");
      const redirectUrl = response.redirected ? response.url : "/login";
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      setLogoutError("Logout gagal. Silakan coba lagi.");
    } finally {
      setLogoutLoading(false);
    }
  };

  // dYO- untuk tema gelap / terang
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = theme === "dark";

  type Role = "OWNER" | "PEGAWAI";
  type MenuItem = {
    name: string;
    href?: string;
    icon: ReactNode;
    action?: () => void;
    disabled?: boolean;
  };
  const currentRole = (profile?.role || user?.role || "PEGAWAI") as Role;
  const roleMenus: Record<Role, MenuItem[]> = {
    OWNER: [
      { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Pelanggan", href: "/pelanggan", icon: <Users size={18} /> },
      { name: "Menu", href: "/menu", icon: <ListChecks size={18} /> },
      { name: "Riwayat", href: "/riwayat", icon: <ClipboardList size={18} /> },
      { name: "Reward", href: "/reward", icon: <Gift size={18} /> },
      { name: "Laporan", href: "/laporan", icon: <FileText size={20} /> },
    ],
    PEGAWAI: [
      { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Pelanggan", href: "/pelanggan", icon: <Users size={18} /> },
      { name: "Menu", href: "/menu", icon: <ListChecks size={18} /> },
      { name: "Riwayat", href: "/riwayat", icon: <ClipboardList size={18} /> },
      { name: "Reward", href: "/reward", icon: <Gift size={18} /> },
    ],
  };
  useEffect(() => setSidebarOpen(false), [pathname]);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const handleThemeToggle = () => {
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  };
  const menuItems = roleMenus[currentRole] || roleMenus.PEGAWAI;
  const isActivePath = (href: string) =>
    pathname === href || (pathname?.startsWith(`${href}/`) ?? false);

  return (
    <ToastProvider>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-slate-100 text-gray-900 transition-colors duration-300 dark:from-[#050505] dark:via-[#0d0d0d] dark:to-[#151515] dark:text-gray-100">
      {logoutLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-[30px] bg-gradient-to-br from-rose-500 to-orange-500 p-1 shadow-2xl">
            <div className="absolute inset-0 -z-10 animate-pulse rounded-[36px] bg-gradient-to-br from-rose-500/30 to-orange-500/30 blur-3xl" />
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[26px] bg-gray-950/80 text-white backdrop-blur-xl">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/40 animate-spin" />
                <LogOut className="text-white" size={28} />
              </div>
              <p className="mt-4 text-sm font-semibold tracking-wide">Mengakhiri sesi</p>
              <p className="text-xs text-white/70">Menyiapkan logout...</p>
            </div>
          </div>
        </div>
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-rose-400/25 blur-[140px] dark:bg-rose-500/10" />
        <div className="absolute bottom-[-20%] right-[-10%] h-96 w-96 rounded-full bg-sky-300/25 blur-[160px] dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-3 py-4 text-[11px] lg:h-screen lg:w-full lg:max-w-none lg:flex-row lg:overflow-hidden lg:px-6 lg:py-8">
        <div className="rounded-3xl border border-white/60 bg-white/80 px-4 py-3 text-gray-700 shadow-lg shadow-gray-200/60 dark:border-white/10 dark:bg-white/5 dark:text-white lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-rose-500/80 dark:text-rose-200/80">
                Navigasi
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {sidebarOpen ? "Sembunyikan menu" : "Tampilkan menu"}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 hover:-translate-y-0.5 active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-white"
              aria-expanded={sidebarOpen}
              aria-controls="app-sidebar"
            >
              <span className="flex items-center gap-2">
                {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                {sidebarOpen ? "Tutup" : "Menu"}
              </span>
            </button>
          </div>
        </div>
        {/* Sidebar modern */}
        <aside
          id="app-sidebar"
          className={`fixed inset-y-0 left-0 z-30 flex w-[85%] max-w-sm translate-x-0 flex-shrink-0 flex-col justify-between overflow-y-auto rounded-r-[36px] border border-white/60 bg-white/95 px-4 py-6 text-[11px] shadow-2xl backdrop-blur-2xl transition-transform duration-300 dark:border-white/10 dark:bg-[#111]/95 sm:w-80 sm:rounded-3xl sm:border-white/40 sm:bg-white lg:sticky lg:top-8 lg:z-auto lg:w-56 lg:overflow-visible lg:rounded-3xl lg:bg-white/90 lg:px-4 lg:py-4 lg:transition-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"
          }`}
        >
          {/* Profil user */}
          <div className="space-y-3 text-center text-[13px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-rose-500/80 dark:text-rose-200/80">
              {appName}
            </p>
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-200/60 dark:shadow-rose-950/30">
              {profile?.avatar_data ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_data}
                  alt={profile?.name || "Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users size={30} />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-300/80">Selamat datang</p>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.name || "Pengguna"}</h2>
              <span className="mt-2 inline-flex items-center rounded-full bg-rose-50 px-3 py-0.5 text-[11px] font-semibold text-rose-600 dark:bg-white/10 dark:text-rose-200">
                {profile?.role || user?.role || "Pegawai"}
              </span>
            </div>
          </div>

          {/* Navigasi */}
          <nav className="mt-4 flex flex-1 flex-col space-y-1 text-[11px]">
            {menuItems.map((item) => {
              const isActive = item.href ? isActivePath(item.href) : false;
              const baseClasses = `group flex items-center gap-2 rounded-2xl px-3 py-1.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                isActive
                  ? "bg-rose-500/15 text-rose-600 shadow-inner shadow-rose-200/50 dark:bg-white/10 dark:text-white"
                  : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
              }`;
              const content = (
                <>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl border text-[11px] ${
                      isActive
                        ? "border-rose-500 bg-white text-rose-600 dark:border-white/30 dark:bg-white/10 dark:text-white"
                        : "border-gray-200 text-gray-500 dark:border-white/10 dark:text-gray-300"
                    }`}
                  >
                    {item.icon && (
                      <span className="text-[16px] leading-none">
                        {item.icon}
                      </span>
                    )}
                  </span>
                  <span className="flex-1 text-[13px] font-medium">{item.name}</span>
                  {item.href && (
                    <span className="text-lg text-gray-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-gray-500">
                      &rsaquo;
                    </span>
                  )}
                </>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeSidebar}
                    className={baseClasses}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    if (item.disabled) return;
                    item.action?.();
                    closeSidebar();
                  }}
                  className={`${baseClasses} text-left disabled:cursor-not-allowed disabled:opacity-70`}
                  disabled={item.disabled}
                >
                  {content}
                </button>
              );
            })}
          </nav>

          {/* Bagian bawah: Toggle & Logout */}
          <div className="mt-4 space-y-3 rounded-2xl border border-white/60 bg-white/90 p-3 text-[12px] shadow-inner shadow-gray-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/40">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl bg-white px-3 py-2 text-[11px] font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 hover:-translate-y-0.5 active:scale-95 dark:bg-white/10 dark:text-gray-100"
            >
              <span className="flex items-center gap-2">
                <Settings size={16} />
                Pengaturan Profil
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                Edit
              </span>
            </button>
            {/* Tombol toggle tema */}
            {mounted && (
              <button
                onClick={handleThemeToggle}
                aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
                className="flex items-center justify-between gap-2 rounded-2xl bg-gray-900/5 px-3 py-2.5 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-900/10 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20"
              >
                <span className="flex items-center gap-2">
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? "Mode Terang" : "Mode Gelap"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Toggle</span>
              </button>
            )}

            {/* Tombol logout */}
            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={logoutLoading}
              className="flex w-full items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-2.5 text-[11px] font-semibold text-white shadow-lg shadow-rose-200/70 transition hover:shadow-xl hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-rose-900/40"
            >
              <span className="flex items-center gap-2">
                <LogOut size={16} />
                {logoutLoading ? "Memproses..." : "Logout"}
              </span>
              <span className="text-[10px] uppercase tracking-[0.35em]">Keluar</span>
            </button>
            {logoutError && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-300">
                {logoutError}
              </p>
            )}
          </div>
        </aside>

        {/* Konten utama */}
        <main className="flex-1 rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-2xl shadow-gray-200/70 backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-black/40 dark:shadow-black/50 sm:p-6 lg:rounded-[32px] lg:p-8 lg:h-full lg:overflow-y-auto">
          <div className="min-h-full pb-10">{children}</div>
        </main>
      </div>

      <AppDialog
        open={showLogoutConfirm}
        title="Keluar dari sesi?"
        description="Anda akan keluar dari aplikasi ini dan harus login kembali untuk melanjutkan."
        confirmText="Logout"
        cancelText="Batal"
        tone="danger"
        icon={<LogOut size={22} />}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
      <ProfileSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={profile}
        onUpdated={(updated) => setProfile(updated)}
      />
      </div>
    </ToastProvider>
  );
}
