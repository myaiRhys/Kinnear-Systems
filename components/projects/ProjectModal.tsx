"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "./projectsData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, handleKeyDown]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto
              bg-gray-900 border border-gray-700 my-[5vh] mx-4
              scrollbar-thin"
            initial={{ scale: 0.92, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-700 px-6 py-4 bg-gray-900/95 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <button
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
                    aria-label="Close modal"
                  />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
                  <span className="w-3 h-3 rounded-full bg-green-500/30" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono">
                  Project {project.index} &mdash; Case Study
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-cyan text-xs font-mono uppercase tracking-widest transition-colors"
              >
                [ESC]
              </button>
            </div>

            <div className="p-6 sm:p-8 lg:p-10 space-y-10">
              {/* Title block */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <motion.div
                  layoutId={`project-subtitle-${project.id}`}
                  className="text-[10px] uppercase tracking-[0.3em] text-cyan font-mono mb-3"
                >
                  {project.subtitle}
                </motion.div>
                <motion.h2
                  layoutId={`project-title-${project.id}`}
                  className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight mb-4"
                >
                  {project.title}
                </motion.h2>
                <p className="text-sm text-gray-300 font-mono leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              </motion.div>

              {/* Tech stack */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono mb-3">
                  Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                      className="text-[10px] uppercase tracking-wider font-mono
                        border border-cyan/40 px-3 py-1.5 text-cyan
                        hover:bg-cyan/10 transition-colors duration-200"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Architecture diagram placeholder */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono mb-3">
                  Architecture
                </div>
                <div className="border border-gray-700 bg-black/50 p-8 flex flex-col items-center justify-center min-h-[200px]">
                  <div className="text-xs text-gray-400 font-mono mb-4">
                    $ render architecture --project={project.id}
                  </div>
                  {/* ASCII art architecture diagram */}
                  <pre className="text-[10px] sm:text-xs text-cyan/60 font-mono leading-relaxed text-center select-none">
                    {`┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   React     │
│  (Browser)  │◀────│   App       │
└─────────────┘     └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Firebase   │
                    │  Real-time  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──┐  ┌──────▼──┐  ┌─────▼───┐
       │ Firestore│  │  Auth   │  │ Storage │
       └─────────┘  └─────────┘  └─────────┘`}
                  </pre>
                </div>
              </motion.div>

              {/* Problem → Solution → Results */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Problem */}
                <div className="border border-gray-700 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-red-400/70 font-mono mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                    Problem
                  </div>
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="border border-gray-700 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-400/70 font-mono mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
                    Solution
                  </div>
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">
                    {project.solution}
                  </p>
                </div>

                {/* Results */}
                <div className="border border-cyan/30 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-cyan font-mono mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                    Results
                  </div>
                  <ul className="space-y-2">
                    {project.results.map((result) => (
                      <li
                        key={result}
                        className="text-xs text-gray-300 font-mono leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-cyan mt-0.5 shrink-0">&gt;</span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Code snippet */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono mb-3">
                  Key Implementation &mdash; {project.codeSnippet.label}
                </div>
                <div className="border border-gray-700 bg-black overflow-hidden">
                  {/* Code header */}
                  <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-700" />
                        <span className="w-2 h-2 rounded-full bg-gray-700" />
                        <span className="w-2 h-2 rounded-full bg-gray-700" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {project.codeSnippet.label}.{project.codeSnippet.language === "typescript" ? "ts" : project.codeSnippet.language}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-700 font-mono uppercase">
                      {project.codeSnippet.language}
                    </span>
                  </div>
                  {/* Code content */}
                  <pre className="p-4 overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed">
                    <code>{project.codeSnippet.code}</code>
                  </pre>
                </div>
              </motion.div>

              {/* ROI highlight bar */}
              <motion.div
                className="border border-cyan/40 bg-cyan/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono mb-1">
                    Key Metric
                  </div>
                  <div className="text-lg text-cyan font-mono font-bold">
                    {project.roi}
                  </div>
                </div>
                <a
                  href={`#case-study-${project.id}`}
                  className="inline-flex items-center border border-cyan text-cyan px-6 py-2.5
                    text-[10px] uppercase tracking-[0.2em] font-mono
                    transition-all duration-300 hover:bg-cyan hover:text-black
                    shrink-0"
                >
                  <span className="mr-2">&rarr;</span>
                  Full Case Study
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
