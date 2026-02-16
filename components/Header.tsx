"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Animate header entrance
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    // Live clock
    const interval = setInterval(() => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date()
          .toLocaleTimeString("en-US", { hour12: false })
          .replace(/:/g, ":");
      }
    }, 1000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 border-b border-gray-700 bg-black/90 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-6 py-4 font-mono text-xs uppercase tracking-widest">
        {/* Logo / Name */}
        <div className="flex items-center gap-3">
          <span className="text-cyan font-bold text-sm">
            KINNEAR<span className="text-gray-400">.SYS</span>
          </span>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline">
            Systems &amp; Solutions
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["About", "Work", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 transition-colors duration-200 hover:text-cyan"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Status bar */}
        <div className="flex items-center gap-4 text-gray-400">
          <span className="hidden sm:inline">
            <span className="text-cyan">&#9679;</span> ONLINE
          </span>
          <span ref={timeRef} className="tabular-nums">
            00:00:00
          </span>
        </div>
      </div>
    </header>
  );
}
