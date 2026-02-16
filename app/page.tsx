"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
      })
        .from(
          subtitleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4"
        )
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.3"
        )
        .from(
          gridRef.current,
          {
            opacity: 0,
            duration: 1,
          },
          "-=0.5"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-20">
        {/* Exposed grid background */}
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00ffff 1px, transparent 1px),
              linear-gradient(to bottom, #00ffff 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl">
          {/* System tag */}
          <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 font-mono">
            <span className="text-cyan">&#9632;</span> System initialized
            &mdash; Ready
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
          >
            <span className="text-white">KINNEAR</span>
            <br />
            <span className="text-cyan">SYSTEMS</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed mb-12 font-mono"
          >
            Engineering precision digital solutions at the intersection of
            technology and design. Building systems that perform.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#work"
              className="inline-flex items-center justify-center border border-cyan text-cyan px-8 py-3 text-xs uppercase tracking-[0.2em] font-mono transition-all duration-300 hover:bg-cyan hover:text-black"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center border border-gray-700 text-gray-300 px-8 py-3 text-xs uppercase tracking-[0.2em] font-mono transition-all duration-300 hover:border-white hover:text-white"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Bottom coordinates */}
        <div className="absolute bottom-8 left-6 sm:left-12 lg:left-24 text-xs text-gray-700 font-mono uppercase tracking-widest">
          <span>48.8566&deg; N, 2.3522&deg; E</span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-6 sm:right-12 lg:right-24 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-700 font-mono uppercase tracking-widest [writing-mode:vertical-lr]">
            Scroll
          </span>
          <div className="w-px h-12 bg-gray-700 relative overflow-hidden">
            <div className="w-full h-4 bg-cyan absolute top-0 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="border-t border-gray-700 px-6 sm:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10+", label: "Years Experience" },
            { value: "50+", label: "Projects Delivered" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "24/7", label: "System Monitoring" },
          ].map((stat) => (
            <div key={stat.label} className="border-exposed p-6">
              <div className="text-3xl sm:text-4xl font-bold text-cyan mb-2">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── About Snippet ─── */}
      <section className="border-t border-gray-700 px-6 sm:px-12 lg:px-24 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-cyan mb-6 font-mono">
              {"// About"}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed font-mono">
              We architect and build robust digital systems with a focus on
              performance, reliability, and clean design. Every project is
              treated as a system &mdash; structured, tested, and optimized for
              production.
            </p>
          </div>
          <div className="border-exposed p-6 text-xs text-gray-400 font-mono">
            <div className="text-cyan mb-2">$ system.info</div>
            <div className="space-y-1">
              <div>
                <span className="text-gray-300">platform:</span> web / mobile /
                systems
              </div>
              <div>
                <span className="text-gray-300">stack:</span> next.js / react /
                node / three.js
              </div>
              <div>
                <span className="text-gray-300">design:</span> brutalist /
                minimal / functional
              </div>
              <div>
                <span className="text-gray-300">status:</span>{" "}
                <span className="text-cyan">operational</span>
              </div>
            </div>
            <div className="mt-4 text-gray-700">
              <span className="cursor-blink">_</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
