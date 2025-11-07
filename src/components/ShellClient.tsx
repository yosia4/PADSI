"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "lucide-react";

export default function ShellClient({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 🌗 untuk tema gelap / terang
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = theme === "dark";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Pelanggan", href: "/pelanggan", icon: <Users size={20} /> },
    { name: "Menu", href: "/menu", icon: <ListChecks size={20} /> },
    { name: "Riwayat", href: "/riwayat", icon: <ClipboardList size={20} /> },
    { name: "Reward", href: "/reward", icon: <Gift size={20} /> },
  ];

  if (user?.role === "OWNER") {
    menuItems.push({ name: "Laporan", href: "/laporan", icon: <FileText size={20} /> });
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0b0b] dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-[#e31c1c] dark:bg-[#b11616] text-white flex flex-col justify-between shadow-xl transition-colors duration-300">
        {/* Profil user */}
        <div className="flex flex-col items-center border-b border-white/20 py-6">
          <div className="bg-white/20 rounded-full p-4 mb-3">
            <Users size={36} />
          </div>
          <h2 className="text-lg font-semibold">{user?.name || "Pengguna"}</h2>
          <p className="text-sm italic text-white/80">{user?.role || "Pegawai"}</p>
        </div>

        {/* Navigasi */}
        <nav className="flex flex-col flex-1 justify-start space-y-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition ${
                pathname === item.href ? "bg-white/30 font-semibold" : ""
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bagian bawah: Toggle & Logout */}
        <div className="border-t border-white/20 p-4 space-y-2">
          {/* Tombol toggle tema */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-sm font-medium"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? "Mode Terang" : "Mode Gelap"}
            </button>
          )}

          {/* Tombol logout */}
          <a
            href="/api/logout"
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </a>
        </div>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
