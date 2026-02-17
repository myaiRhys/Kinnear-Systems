"use client";

import { useEffect, useRef, useCallback } from "react";

const LERP_EASE = 0.15;
const MAX_PARTICLES = 20;
const PARTICLE_LIFETIME = 600;
const MIN_SPAWN_DISTANCE = 8;
const CROSSHAIR_SIZE = 20;
const CROSSHAIR_THICKNESS = 1;
const DOT_SIZE = 3;
const PARTICLE_SIZE_MIN = 2;
const PARTICLE_SIZE_MAX = 3;

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  born: number;
  size: number;
}

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const lastSpawnPos = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);
  const particleIndex = useRef(0);
  const rafId = useRef<number>(0);
  const isHoveringInteractive = useRef(false);
  const isDesktop = useRef(false);
  const isMounted = useRef(false);

  const checkDesktop = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    if (window.innerWidth < 768) return false;
    if (window.matchMedia("(pointer: coarse)").matches) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    return true;
  }, []);

  useEffect(() => {
    if (!checkDesktop()) {
      isDesktop.current = false;
      return;
    }

    isDesktop.current = true;
    isMounted.current = true;

    // Inject style tag for hiding system cursor
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-custom-cursor", "true");
    styleEl.textContent =
      ".cursor-none-global, .cursor-none-global * { cursor: none !important; }";
    document.head.appendChild(styleEl);

    // Hide system cursor
    document.documentElement.classList.add("cursor-none-global");

    // Pre-create particle DOM elements
    const particleContainer = particleContainerRef.current;
    if (particleContainer) {
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const el = document.createElement("div");
        el.style.position = "absolute";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#00ffff";
        el.style.pointerEvents = "none";
        el.style.opacity = "0";
        el.style.width = "0px";
        el.style.height = "0px";
        el.style.transform = "translate(-50%, -50%)";
        el.style.willChange = "opacity, transform, width, height";
        particleContainer.appendChild(el);
        particles.current.push({
          el,
          x: 0,
          y: 0,
          born: 0,
          size: PARTICLE_SIZE_MIN,
        });
      }
    }

    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Check spawn distance for particles
      const dx = e.clientX - lastSpawnPos.current.x;
      const dy = e.clientY - lastSpawnPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= MIN_SPAWN_DISTANCE) {
        spawnParticle(e.clientX, e.clientY);
        lastSpawnPos.current.x = e.clientX;
        lastSpawnPos.current.y = e.clientY;
      }
    };

    // Mouseover handler for interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isInteractive(target)) {
        isHoveringInteractive.current = true;
        updateCursorStyle(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isInteractive(target)) {
        isHoveringInteractive.current = false;
        updateCursorStyle(false);
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    // Start animation loop
    const animate = () => {
      if (!isMounted.current) return;

      // Lerp cursor position
      cursorPos.current.x +=
        (mousePos.current.x - cursorPos.current.x) * LERP_EASE;
      cursorPos.current.y +=
        (mousePos.current.y - cursorPos.current.y) * LERP_EASE;

      // Update cursor DOM position
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
      }

      // Update particles
      const now = performance.now();
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        if (p.born === 0) continue;

        const age = now - p.born;
        if (age >= PARTICLE_LIFETIME) {
          p.born = 0;
          p.el.style.opacity = "0";
          continue;
        }

        const progress = age / PARTICLE_LIFETIME;
        const opacity = 0.4 * (1 - progress);
        const scale = 1 - progress * 0.6;
        p.el.style.opacity = String(opacity);
        const currentSize = p.size * scale;
        p.el.style.width = `${currentSize}px`;
        p.el.style.height = `${currentSize}px`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      isMounted.current = false;
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.documentElement.classList.remove("cursor-none-global");
      styleEl.remove();
    };
  }, [checkDesktop]);

  function spawnParticle(x: number, y: number) {
    const idx = particleIndex.current % MAX_PARTICLES;
    const p = particles.current[idx];
    if (!p) return;

    const size =
      PARTICLE_SIZE_MIN +
      Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN);
    p.x = x;
    p.y = y;
    p.born = performance.now();
    p.size = size;
    p.el.style.left = `${x}px`;
    p.el.style.top = `${y}px`;
    p.el.style.width = `${size}px`;
    p.el.style.height = `${size}px`;
    p.el.style.opacity = "0.4";

    particleIndex.current++;
  }

  function isInteractive(el: HTMLElement | null): boolean {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (
      tag === "a" ||
      tag === "button" ||
      tag === "input" ||
      tag === "select" ||
      tag === "textarea"
    )
      return true;
    if (el.getAttribute("role") === "button") return true;
    return false;
  }

  function updateCursorStyle(hovering: boolean) {
    if (!cursorRef.current) return;
    const hLine = cursorRef.current.querySelector(
      "[data-cursor-h]"
    ) as HTMLElement;
    const vLine = cursorRef.current.querySelector(
      "[data-cursor-v]"
    ) as HTMLElement;
    const dot = cursorRef.current.querySelector(
      "[data-cursor-dot]"
    ) as HTMLElement;

    if (hovering) {
      if (hLine) {
        hLine.style.width = "28px";
        hLine.style.opacity = "1";
      }
      if (vLine) {
        vLine.style.height = "28px";
        vLine.style.opacity = "1";
      }
      if (dot) {
        dot.style.opacity = "1";
      }
    } else {
      if (hLine) {
        hLine.style.width = `${CROSSHAIR_SIZE}px`;
        hLine.style.opacity = "0.7";
      }
      if (vLine) {
        vLine.style.height = `${CROSSHAIR_SIZE}px`;
        vLine.style.opacity = "0.7";
      }
      if (dot) {
        dot.style.opacity = "0.7";
      }
    }
  }

  // SSR safety and desktop-only check
  if (typeof window === "undefined") return null;
  if (!checkDesktop()) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Particle container */}
      <div ref={particleContainerRef} style={{ position: "absolute", inset: 0 }} />

      {/* Crosshair cursor */}
      <div
        ref={cursorRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          willChange: "transform",
        }}
      >
        {/* Horizontal line */}
        <div
          data-cursor-h=""
          style={{
            position: "absolute",
            width: `${CROSSHAIR_SIZE}px`,
            height: `${CROSSHAIR_THICKNESS}px`,
            backgroundColor: "#00ffff",
            opacity: 0.7,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            transition: "width 0.15s ease, opacity 0.15s ease",
          }}
        />
        {/* Vertical line */}
        <div
          data-cursor-v=""
          style={{
            position: "absolute",
            width: `${CROSSHAIR_THICKNESS}px`,
            height: `${CROSSHAIR_SIZE}px`,
            backgroundColor: "#00ffff",
            opacity: 0.7,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            transition: "height 0.15s ease, opacity 0.15s ease",
          }}
        />
        {/* Center dot */}
        <div
          data-cursor-dot=""
          style={{
            position: "absolute",
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            borderRadius: "50%",
            backgroundColor: "#00ffff",
            opacity: 0.7,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.15s ease",
          }}
        />
      </div>
    </div>
  );
}
