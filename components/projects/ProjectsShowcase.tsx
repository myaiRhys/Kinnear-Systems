"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./projectsData";
import type { Project } from "./projectsData";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    const cards = grid.querySelectorAll(".project-card");

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(header.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Staggered card entrance
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="border-t border-gray-700 px-6 sm:px-12 lg:px-24 py-24"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-6 font-mono">
          {"// Projects"}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-mono tracking-tight mb-4">
          Selected Work
        </h2>
        <p className="text-sm text-gray-400 font-mono leading-relaxed">
          <span className="text-gray-300">&gt;</span> Systems built to solve
          real problems. Each project measured by the hours it saves and the
          errors it eliminates.
        </p>
      </div>

      {/* Project grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Full-screen modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
