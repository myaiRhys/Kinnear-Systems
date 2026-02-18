"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Lenis Context ─── */

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/* ─── SmoothScroll Provider ─── */

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Sync Lenis scroll position with GSAP ScrollTrigger
    instance.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP ticker for frame-perfect sync
    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Native scroll fallback for mobile touch devices where Lenis
    // may not properly relay scroll events to ScrollTrigger
    const handleNativeScroll = () => ScrollTrigger.update();
    window.addEventListener("scroll", handleNativeScroll, { passive: true });

    // Refresh ScrollTrigger after Lenis is ready so trigger
    // positions are calculated correctly
    ScrollTrigger.refresh();

    setLenis(instance);

    return () => {
      window.removeEventListener("scroll", handleNativeScroll);
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
