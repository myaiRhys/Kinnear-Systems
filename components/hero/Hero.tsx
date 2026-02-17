"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TerminalTyping from "./TerminalTyping";

gsap.registerPlugin(ScrollTrigger);

// Dynamic import to avoid SSR for Three.js
const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaTopRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // ─── Entrance timeline ───
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
      });

      tl.from(metaTopRef.current, {
        y: -10,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          headlineRef.current,
          {
            y: 60,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.2"
        )
        .from(
          subheadlineRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          taglineRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.3"
        )
        .from(
          terminalRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.3"
        )
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.2"
        )
        .from(
          [coordsRef.current, scrollIndicatorRef.current],
          {
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        );

      // ─── Parallax on scroll ───
      gsap.to(content, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Fade out hero on scroll
      gsap.to(section, {
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "60% top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] flex flex-col justify-center overflow-hidden"
    >
      {/* Three.js background */}
      <ThreeScene />

      {/* Grid overlay (CSS fallback on top of Three.js for density) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00ffff 1px, transparent 1px),
            linear-gradient(to bottom, #00ffff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 px-6 sm:px-12 lg:px-24 pt-20"
      >
        <div className="max-w-5xl">
          {/* System status tag */}
          <div
            ref={metaTopRef}
            className="text-xs uppercase tracking-[0.3em] text-gray-400 font-mono mb-8"
          >
            <span className="text-cyan">&#9632;</span> System initialized
            &mdash; Ready
          </div>

          {/* Terminal typing animation */}
          <div
            ref={terminalRef}
            className="text-sm sm:text-base font-mono mb-6"
          >
            <TerminalTyping text="KINNEAR SYSTEMS" speed={70} startDelay={800} />
          </div>

          {/* Main headline */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-7xl lg:text-[6.5rem] font-bold leading-[0.92] tracking-tight mb-6"
          >
            <span className="text-white">KINNEAR</span>
            <br />
            <span className="text-cyan">SYSTEMS</span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-lg sm:text-xl lg:text-2xl text-gray-100 font-mono font-semibold tracking-wide mb-4 uppercase"
          >
            Software That Actually Works
          </p>

          {/* Tagline */}
          <div
            ref={taglineRef}
            className="text-sm sm:text-base text-gray-400 font-mono mb-12 max-w-2xl"
          >
            <span className="text-gray-300">&gt;</span> Building automation
            systems that save Cape Town businesses 500+ hours/year
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#work"
              className="group inline-flex items-center justify-center border border-cyan text-cyan px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-mono transition-all duration-300 hover:bg-cyan hover:text-black"
            >
              <span className="mr-2 transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
              See The Work
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center border border-gray-700 text-gray-300 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-mono transition-all duration-300 hover:border-cyan hover:text-cyan"
            >
              <span className="mr-2 transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
              Start A Project
            </a>
          </div>
        </div>
      </div>

      {/* Bottom coordinates */}
      <div
        ref={coordsRef}
        className="absolute bottom-8 left-6 sm:left-12 lg:left-24 text-xs text-gray-700 font-mono uppercase tracking-widest z-10"
      >
        <span>33.9249&deg; S, 18.4241&deg; E</span>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 right-6 sm:right-12 lg:right-24 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-gray-700 font-mono uppercase tracking-widest [writing-mode:vertical-lr]">
          Scroll
        </span>
        <div className="w-px h-12 bg-gray-700 relative overflow-hidden">
          <div className="w-full h-4 bg-cyan absolute top-0 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
