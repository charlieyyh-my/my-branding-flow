"use client";

import { useEffect } from "react";

// Fires a one-time confetti burst the first time all guide steps are complete.
// No dependencies — draws to a throwaway full-screen canvas.
export function CompletionCelebration({ allDone }: { allDone: boolean }) {
  useEffect(() => {
    if (!allDone) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem("brandos_celebrated") === "1") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      localStorage.setItem("brandos_celebrated", "1");
      return;
    }
    localStorage.setItem("brandos_celebrated", "1");

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = window.innerWidth;
    const H = window.innerHeight;

    const colors = ["#d6b95f", "#d64545", "#1877F2", "#C13584", "#FF2442", "#e9e7e3"];
    const N = 160;
    const parts = Array.from({ length: N }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 120,
      y: H / 3 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -11 - 4,
      size: Math.random() * 6 + 4,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    }));

    const start = performance.now();
    const DURATION = 2600;
    let raf = 0;

    const frame = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.vy += 0.28; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const alpha = Math.max(0, 1 - elapsed / DURATION);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(frame);
      } else {
        canvas.remove();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      canvas.remove();
    };
  }, [allDone]);

  return null;
}
