"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  delay: number;
};

/**
 * Efek serbuk merah-rose setiap kali user melakukan klik/tap.
 */
export default function ClickRipple() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const burst = Array.from({ length: 12 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 60;
        const id = counter.current++;
        return {
          id,
          x: e.clientX,
          y: e.clientY,
          offsetX: Math.cos(angle) * distance,
          offsetY: Math.sin(angle) * distance,
          scale: 0.6 + Math.random() * 0.7,
          delay: Math.random() * 80,
        };
      });

      setParticles((prev) => [...prev.slice(-120), ...burst]);

      window.setTimeout(() => {
        const toRemove = burst.map((p) => p.id);
        setParticles((prev) => prev.filter((p) => !toRemove.includes(p.id)));
      }, 1000);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9997] overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="click-particle"
          style={
            {
              left: particle.x,
              top: particle.y,
              "--dx": `${particle.offsetX}px`,
              "--dy": `${particle.offsetY}px`,
              "--scale": `${particle.scale}`,
              "--delay": `${particle.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
