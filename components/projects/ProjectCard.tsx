"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Project } from "./projectsData";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} case study`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="project-card group relative border border-gray-700 bg-gray-900 cursor-pointer
        transition-all duration-500 ease-out
        hover:border-cyan hover:-translate-y-2 hover:shadow-[0_8px_40px_-8px_rgba(0,255,255,0.15)]
        focus-visible:outline-none focus-visible:border-cyan focus-visible:-translate-y-2"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-700 px-5 py-3
        group-hover:border-cyan/30 transition-colors duration-500">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono">
          Project {project.index}
        </span>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-cyan/50 transition-colors duration-500" />
          <span className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-cyan/70 transition-colors duration-500" />
          <span className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-cyan transition-colors duration-500" />
        </div>
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Title */}
        <motion.h3
          layoutId={`project-title-${project.id}`}
          className="text-lg font-bold text-white mb-1 font-mono tracking-tight
            group-hover:text-cyan transition-colors duration-300"
        >
          {project.title}
        </motion.h3>

        {/* Subtitle */}
        <motion.div
          layoutId={`project-subtitle-${project.id}`}
          className="text-[11px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400 font-mono mb-4"
        >
          {project.subtitle}
        </motion.div>

        {/* Description */}
        <p className="text-xs text-gray-300 font-mono leading-relaxed mb-6">
          {project.description}
        </p>

        {/* ROI highlight */}
        <div className="border border-gray-700 bg-black/50 px-4 py-3 mb-6
          group-hover:border-cyan/30 transition-colors duration-500">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono mb-1">
            Impact
          </div>
          <div className="text-sm text-cyan font-mono font-semibold">
            {project.roi}
          </div>
        </div>

        {/* Tech badges - always visible */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="tech-badge text-[10px] uppercase tracking-wider font-mono
                border border-gray-700 px-2.5 py-1 text-gray-400
                group-hover:border-cyan/40 group-hover:text-cyan
                transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-gray-700 px-5 py-3 flex items-center justify-between
        group-hover:border-cyan/30 transition-colors duration-500">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono
          group-hover:text-cyan transition-colors duration-300">
          Tap to explore
        </span>
        <span className="text-cyan tap-indicator text-sm transition-all duration-300
          group-hover:translate-x-1 transform md:text-gray-700 md:group-hover:text-cyan">
          &rarr;
        </span>
      </div>

      {/* Corner accents — visible on mobile, enhanced on hover */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan/30
        group-hover:border-cyan transition-colors duration-500" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan/30
        group-hover:border-cyan transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan/30
        group-hover:border-cyan transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan/30
        group-hover:border-cyan transition-colors duration-500" />
    </div>
  );
}
