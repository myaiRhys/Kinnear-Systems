"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServiceModel {
  headline: string;
  timeline: string;
  price: string;
  features: string[];
  cta: string;
  ctaHref: string;
}

const customSystems: ServiceModel = {
  headline: "CUSTOM SYSTEMS",
  timeline: "4-8 weeks",
  price: "From R80,000",
  features: [
    "Firebase + React + PWA",
    "Full automation",
    "Custom workflows",
    "Ongoing support",
  ],
  cta: "Book Discovery Call",
  ctaHref: "#contact",
};

const fastWebsites: ServiceModel = {
  headline: "FAST WEBSITES",
  timeline: "3 days",
  price: "From R15,000",
  features: [
    "Modern templates",
    "Tailwind CSS",
    "Mobile-first",
    "SEO optimized",
  ],
  cta: "See Templates",
  ctaHref: "#templates",
};

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(
    null
  );
  const [activeFeature, setActiveFeature] = useState<number>(-1);
  const featureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  // Scroll-triggered entrance animations
  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !header || !left || !right) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(header.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Left panel slides in from the left
      gsap.from(left, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // Right panel slides in from the right
      gsap.from(right, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Feature highlight cycle
  useEffect(() => {
    featureIntervalRef.current = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 2000);

    return () => {
      if (featureIntervalRef.current) {
        clearInterval(featureIntervalRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="border-t border-gray-700 px-4 sm:px-12 lg:px-24 py-16 sm:py-24"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-10 sm:mb-16 max-w-3xl border-l-2 border-cyan/40 pl-4 sm:pl-6">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-6 font-mono flex items-center gap-3">
          <span className="text-cyan/20 text-2xl font-bold tabular-nums">01</span>
          {"// Services"}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-mono tracking-tight mb-4">
          Two Paths Forward
        </h2>
        <p className="text-sm text-gray-400 font-mono leading-relaxed">
          <span className="text-gray-300">&gt;</span> Choose the track that fits
          your project. Enterprise-grade systems or rapid deployment &mdash;
          both built to production standards.
        </p>
      </div>

      {/* Split-screen panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl">
        {/* Divider label - visible on large screens */}
        <ServicePanel
          ref={leftRef}
          service={customSystems}
          side="left"
          isHovered={hoveredSide === "left"}
          isDimmed={hoveredSide === "right"}
          activeFeature={activeFeature}
          onMouseEnter={() => setHoveredSide("left")}
          onMouseLeave={() => setHoveredSide(null)}
        />
        <ServicePanel
          ref={rightRef}
          service={fastWebsites}
          side="right"
          isHovered={hoveredSide === "right"}
          isDimmed={hoveredSide === "left"}
          activeFeature={activeFeature}
          onMouseEnter={() => setHoveredSide("right")}
          onMouseLeave={() => setHoveredSide(null)}
        />
      </div>
    </section>
  );
}

/* ─── Service Panel ─── */

import { forwardRef } from "react";

interface ServicePanelProps {
  service: ServiceModel;
  side: "left" | "right";
  isHovered: boolean;
  isDimmed: boolean;
  activeFeature: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ServicePanel = forwardRef<HTMLDivElement, ServicePanelProps>(
  function ServicePanel(
    { service, side, isHovered, isDimmed, activeFeature, onMouseEnter, onMouseLeave },
    ref
  ) {
    return (
      <div
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
          border border-gray-700 p-5 sm:p-8 lg:p-10
          transition-all duration-500 ease-out
          ${side === "left" ? "lg:border-r-0" : ""}
          ${isHovered ? "bg-gray-900/80 border-cyan/40" : ""}
          ${isDimmed ? "opacity-50" : "opacity-100"}
        `}
      >
        {/* Terminal window header */}
        <div className="flex items-center gap-2 mb-5 sm:mb-8 pb-4 border-b border-gray-700">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${
                isHovered ? "bg-cyan" : "bg-gray-700"
              }`}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest ml-2">
            {side === "left" ? "systems.exe" : "deploy.sh"}
          </span>
        </div>

        {/* Headline */}
        <h3
          className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-6 transition-colors duration-500 ${
            isHovered ? "text-cyan" : "text-white"
          }`}
        >
          {service.headline}
        </h3>

        {/* Timeline + Price */}
        <div className="flex gap-6 mb-8">
          <div className="border border-gray-700 px-4 py-3 flex-1">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-1">
              timeline
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {service.timeline}
            </div>
          </div>
          <div className="border border-gray-700 px-4 py-3 flex-1">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-1">
              starting
            </div>
            <div className="text-lg font-bold text-cyan font-mono">
              {service.price}
            </div>
          </div>
        </div>

        {/* Feature list with terminal prompts */}
        <div className="space-y-3 mb-10">
          {service.features.map((feature, i) => (
            <div
              key={feature}
              className={`
                flex items-center gap-3 py-2.5 px-3 min-h-[44px]
                border-l-2 transition-all duration-500 font-mono text-sm
                ${
                  activeFeature === i
                    ? "border-l-cyan bg-cyan/5 text-white"
                    : "border-l-gray-700 text-gray-400"
                }
              `}
            >
              <span
                className={`transition-colors duration-500 ${
                  activeFeature === i ? "text-cyan" : "text-gray-700"
                }`}
              >
                &gt;
              </span>
              {feature}
            </div>
          ))}
        </div>

        {/* CTA styled as terminal command */}
        <a
          href={service.ctaHref}
          className={`
            group flex items-center gap-3
            border border-gray-700 px-4 sm:px-6 py-4 min-h-[48px]
            font-mono text-sm uppercase tracking-widest
            transition-all duration-300
            hover:border-cyan hover:bg-cyan/5
            active:bg-cyan/10
            ${isHovered ? "border-cyan/40" : ""}
          `}
        >
          <span className="text-cyan">$</span>
          <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
            {service.cta.toLowerCase().replace(/\s+/g, "-")}
          </span>
          <span className="ml-auto text-gray-700 group-hover:text-cyan transition-colors duration-300">
            &rarr;
          </span>
        </a>
      </div>
    );
  }
);
