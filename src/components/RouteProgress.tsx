"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Progress bar singkat di bagian atas layar untuk memberi kesan "fast response" saat berganti halaman.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999]">
      <div
        className={clsx(
          "h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 shadow-lg shadow-rose-500/30 transition-all duration-300",
          active ? "scale-x-100 opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
