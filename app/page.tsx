"use client";

import Hero from "@/components/hero/Hero";
import ProjectsShowcase from "@/components/projects/ProjectsShowcase";

export default function Home() {
  return (
    <div>
      {/* ─── Hero Section ─── */}
      <Hero />

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

      {/* ─── Projects Showcase ─── */}
      <ProjectsShowcase />

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
