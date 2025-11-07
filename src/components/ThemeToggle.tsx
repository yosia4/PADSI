"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center gap-2 py-2 w-full rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {isDark ? "Mode Terang" : "Mode Gelap"}
    </button>
  );
}
