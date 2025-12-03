"use client";

import { AnimatePresence, motion, useSpring, useTransform, useViewportScroll } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

/**
 * Transisi halaman global dengan efek kaca 3D dan parallax glow.
 */
export default function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { scrollYProgress } = useViewportScroll();
  const glowShift = useTransform(useSpring(scrollYProgress, { damping: 20, stiffness: 150 }), (v) => v * 60 - 30);

  const routeKey = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, x: 60, rotateY: 6, scale: 0.98, filter: "blur(14px)" }}
        animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -60, rotateY: -6, scale: 0.97, filter: "blur(18px)" }}
        transition={transition}
        className="relative min-h-screen will-change-transform rounded-[28px]"
        style={{ perspective: 1200 }}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[34px]"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255, 184, 184, 0.32), transparent 55%)",
            filter: "blur(20px)",
            x: glowShift,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.5, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={transition}
        />
        <motion.div
          className="rounded-[28px] bg-transparent"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={transition}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
