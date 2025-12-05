"use client";

import { motion } from "framer-motion";
import { useEffect, useId, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartDatum = { label: string; total: number };

type MiniSalesChartProps = {
  data: ChartDatum[];
  color?: string;
  tooltipLabel?: string;
  valueKind?: "currency" | "number";
  valuePrefix?: string;
  valueSuffix?: string;
};

export default function MiniSalesChart({
  data,
  color = "#fb7185",
  tooltipLabel = "Penjualan",
  valueKind = "currency",
  valuePrefix = "",
  valueSuffix = "",
}: MiniSalesChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const gradientId = useId();
  const formatValue = useMemo(() => {
    return (value: number) => {
      const base =
        valueKind === "currency"
          ? `Rp ${Number(value).toLocaleString("id-ID")}`
          : Number(value).toLocaleString("id-ID");
      return `${valuePrefix}${base}${valueSuffix}`;
    };
  }, [valueKind, valuePrefix, valueSuffix]);
  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Belum ada data
      </div>
    );
  }
  if (!mounted) {
    return (
      <div className="h-32 w-full animate-pulse rounded-2xl bg-white/30 dark:bg-white/5" />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-4 left-0 right-0 mx-auto h-3/4 w-1/2 rounded-full bg-gradient-to-r from-white/10 via-white/40 to-transparent blur-3xl"
        initial={{ x: "-60%" }}
        animate={{ x: ["-60%", "140%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" width={60} />
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.3)",
              color: "#1f2937",
            }}
            formatter={(value: number) => [formatValue(value), tooltipLabel]}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={color}
            fill={`url(#${gradientId})`}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
