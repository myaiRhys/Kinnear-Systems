"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/hero/Hero";
import ServicesSection from "@/components/services/ServicesSection";
import ProjectsShowcase from "@/components/projects/ProjectsShowcase";
import TechStackVisualization from "@/components/techstack/TechStackVisualization";
import ContactSection from "@/components/contact/ContactSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const statsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ─── Stats section: staggered card entrance ─── */
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll("[data-stat-card]");
        gsap.from(statCards, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        // Animated counter effect for stat values
        statCards.forEach((card) => {
          const valueEl = card.querySelector("[data-stat-value]");
          if (!valueEl) return;
          gsap.from(valueEl, {
            textContent: 0,
            duration: 0,
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
          // Scale pulse on entrance
          gsap.from(valueEl, {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      }

      /* ─── About section: two-column slide-in ─── */
      if (aboutRef.current) {
        const aboutLeft = aboutRef.current.querySelector("[data-about-left]");
        const aboutRight = aboutRef.current.querySelector("[data-about-right]");

        if (aboutLeft) {
          gsap.from(aboutLeft, {
            x: -50,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }
        if (aboutRight) {
          gsap.from(aboutRight, {
            x: 50,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }

        // Terminal lines stagger inside the right panel
        const terminalLines = aboutRef.current.querySelectorAll("[data-terminal-line]");
        if (terminalLines.length) {
          gsap.from(terminalLines, {
            x: -15,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aboutRight,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <Hero />

      {/* ─── Stats Section ─── */}
      <section
        ref={statsRef}
        className="border-t border-gray-700 px-6 sm:px-12 lg:px-24 py-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10+", label: "Years Experience" },
            { value: "50+", label: "Projects Delivered" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "24/7", label: "System Monitoring" },
          ].map((stat) => (
            <div key={stat.label} data-stat-card className="border-exposed p-6">
              <div
                data-stat-value
                className="text-3xl sm:text-4xl font-bold text-cyan mb-2"
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Services Split-Screen ─── */}
      <ServicesSection />

      {/* ─── Projects Showcase ─── */}
      <ProjectsShowcase />

      {/* ─── Tech Stack Visualization ─── */}
      <TechStackVisualization />

      {/* ─── Contact Form ─── */}
      <ContactSection />

      {/* ─── About Snippet ─── */}
      <section
        ref={aboutRef}
        id="about"
        className="border-t border-gray-700 px-6 sm:px-12 lg:px-24 py-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl">
          <div data-about-left>
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
          <div data-about-right className="border-exposed p-6 text-xs text-gray-400 font-mono">
            <div data-terminal-line className="text-cyan mb-2">$ system.info</div>
            <div className="space-y-1">
              <div data-terminal-line>
                <span className="text-gray-300">platform:</span> web / mobile /
                systems
              </div>
              <div data-terminal-line>
                <span className="text-gray-300">stack:</span> next.js / react /
                node / three.js
              </div>
              <div data-terminal-line>
                <span className="text-gray-300">design:</span> brutalist /
                minimal / functional
              </div>
              <div data-terminal-line>
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
