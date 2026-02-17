"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { techNodes, layers, type TechNode, type TechLayer } from "./techStackData";

gsap.registerPlugin(ScrollTrigger);

/* ─── Connection path between two elements ─── */
interface ConnectionPath {
  from: string;
  to: string;
  d: string;
}

export default function TechStackVisualization() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [connections, setConnections] = useState<ConnectionPath[]>([]);
  const [animationReady, setAnimationReady] = useState(false);

  /* ─── Calculate SVG paths between connected nodes ─── */
  const calculateConnections = useCallback(() => {
    if (!graphRef.current) return;
    const graphRect = graphRef.current.getBoundingClientRect();
    const paths: ConnectionPath[] = [];
    const drawn = new Set<string>();

    techNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const key = [node.id, targetId].sort().join("-");
        if (drawn.has(key)) return;
        drawn.add(key);

        const fromEl = nodeRefs.current.get(node.id);
        const toEl = nodeRefs.current.get(targetId);
        if (!fromEl || !toEl) return;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = fromRect.left + fromRect.width / 2 - graphRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - graphRect.top;
        const x2 = toRect.left + toRect.width / 2 - graphRect.left;
        const y2 = toRect.top + toRect.height / 2 - graphRect.top;

        // Bezier curve with vertical bias
        const midY = (y1 + y2) / 2;
        const cpOffset = Math.abs(y2 - y1) * 0.4;
        const d = `M ${x1} ${y1} C ${x1} ${midY + cpOffset}, ${x2} ${midY - cpOffset}, ${x2} ${y2}`;

        paths.push({ from: node.id, to: targetId, d });
      });
    });

    setConnections(paths);
  }, []);

  /* ─── Recalculate paths on resize / layout shift ─── */
  useEffect(() => {
    // Small delay for layout to stabilize
    const timeout = setTimeout(() => {
      calculateConnections();
      setAnimationReady(true);
    }, 100);

    const handleResize = () => calculateConnections();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateConnections]);

  /* ─── GSAP scroll-triggered animations ─── */
  useEffect(() => {
    if (!animationReady || !sectionRef.current) return;

    const section = sectionRef.current;
    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Layer labels entrance
      const layerLabels = section.querySelectorAll("[data-layer-label]");
      gsap.from(layerLabels, {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: graphRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Nodes stagger in per layer
      layers.forEach((layer, layerIndex) => {
        const layerNodes = section.querySelectorAll(
          `[data-layer="${layer.id}"]`
        );
        gsap.from(layerNodes, {
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          delay: layerIndex * 0.15,
          scrollTrigger: {
            trigger: graphRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      // SVG connection lines draw-in
      const paths = section.querySelectorAll("[data-connection-path]");
      paths.forEach((path) => {
        const el = path as SVGPathElement;
        const length = el.getTotalLength();
        gsap.set(el, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: graphRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [animationReady]);

  /* ─── Helpers ─── */
  const getNodesByLayer = (layer: TechLayer) =>
    techNodes.filter((n) => n.layer === layer);

  const isNodeHighlighted = (nodeId: string) => {
    if (!hoveredNode) return false;
    if (nodeId === hoveredNode) return true;
    const hovered = techNodes.find((n) => n.id === hoveredNode);
    return hovered?.connections.includes(nodeId) ?? false;
  };

  const isConnectionHighlighted = (from: string, to: string) => {
    if (!hoveredNode) return false;
    return (
      (from === hoveredNode || to === hoveredNode) &&
      (isNodeHighlighted(from) || isNodeHighlighted(to))
    );
  };

  const setNodeRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        nodeRefs.current.set(id, el);
      }
    },
    []
  );

  const expandedData = expandedNode
    ? techNodes.find((n) => n.id === expandedNode)
    : null;

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="border-t border-gray-700 px-6 sm:px-12 lg:px-24 py-24 relative"
    >
      {/* ─── Section Header ─── */}
      <div ref={headerRef} className="mb-16 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-6 font-mono">
          {"// Tech Stack"}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-mono tracking-tight mb-4">
          System Architecture
        </h2>
        <p className="text-sm text-gray-400 font-mono leading-relaxed">
          <span className="text-gray-300">&gt;</span> The tools and frameworks
          powering every build. Click any node to inspect.
        </p>
      </div>

      {/* ─── Interactive Graph ─── */}
      <div ref={graphRef} className="relative max-w-6xl">
        {/* SVG connections layer */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="cyan-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {connections.map((conn) => {
            const highlighted = isConnectionHighlighted(conn.from, conn.to);
            return (
              <g key={`${conn.from}-${conn.to}`}>
                {/* Base line */}
                <path
                  data-connection-path
                  d={conn.d}
                  fill="none"
                  stroke={highlighted ? "#00ffff" : "#2a2a2a"}
                  strokeWidth={highlighted ? 1.5 : 0.75}
                  className="transition-all duration-300"
                />
                {/* Animated data stream overlay */}
                {highlighted && (
                  <path
                    d={conn.d}
                    fill="none"
                    stroke="url(#cyan-pulse)"
                    strokeWidth="2"
                    strokeDasharray="8 16"
                    className="animate-data-stream"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Node layers */}
        <div className="relative z-10 space-y-10">
          {layers.map((layer) => (
            <div key={layer.id} className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Layer label */}
              <div
                data-layer-label
                className="w-full sm:w-28 shrink-0 py-3 sm:py-0"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-700 font-mono">
                  {layer.label}
                </div>
                <div className="text-[10px] text-cyan/40 font-mono mt-0.5">
                  {layer.command}
                </div>
              </div>

              {/* Nodes in this layer */}
              <div className="flex flex-wrap gap-3 flex-1">
                {getNodesByLayer(layer.id).map((node) => (
                  <TechNodeCard
                    key={node.id}
                    node={node}
                    ref={setNodeRef(node.id)}
                    isHovered={hoveredNode === node.id}
                    isHighlighted={isNodeHighlighted(node.id)}
                    isDimmed={
                      hoveredNode !== null && !isNodeHighlighted(node.id)
                    }
                    isExpanded={expandedNode === node.id}
                    onHoverStart={() => setHoveredNode(node.id)}
                    onHoverEnd={() => setHoveredNode(null)}
                    onClick={() =>
                      setExpandedNode(
                        expandedNode === node.id ? null : node.id
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Expanded Detail Panel ─── */}
      {expandedData && (
        <ExpandedPanel
          node={expandedData}
          onClose={() => setExpandedNode(null)}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   Tech Node Card
   ───────────────────────────────────────────── */

import { forwardRef } from "react";

interface TechNodeCardProps {
  node: TechNode;
  isHovered: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  isExpanded: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

const TechNodeCard = forwardRef<HTMLDivElement, TechNodeCardProps>(
  function TechNodeCard(
    {
      node,
      isHovered,
      isHighlighted,
      isDimmed,
      isExpanded,
      onHoverStart,
      onHoverEnd,
      onClick,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-layer={node.layer}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onClick={onClick}
        className="relative group cursor-pointer"
      >
        {/* Terminal window node */}
        <div
          className={`
            relative border font-mono transition-all duration-300
            min-w-[140px] sm:min-w-[160px]
            ${
              isExpanded
                ? "border-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                : isHovered
                  ? "border-cyan bg-gray-900 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                  : isHighlighted
                    ? "border-cyan/50 bg-gray-900/60"
                    : isDimmed
                      ? "border-gray-700/50 bg-transparent opacity-40"
                      : "border-gray-700 bg-transparent"
            }
          `}
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-inherit">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                isHovered || isExpanded ? "bg-cyan" : "bg-gray-700"
              }`}
            />
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                isHovered || isExpanded ? "bg-cyan/60" : "bg-gray-700"
              }`}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
            <span className="text-[8px] text-gray-700 ml-auto uppercase tracking-wider">
              {node.layer}
            </span>
          </div>

          {/* Node content */}
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-base transition-colors duration-300 ${
                  isHovered || isExpanded || isHighlighted
                    ? "text-cyan"
                    : "text-gray-400"
                }`}
              >
                {node.symbol}
              </span>
              <span
                className={`text-xs font-bold tracking-wide transition-colors duration-300 ${
                  isHovered || isExpanded
                    ? "text-white"
                    : isHighlighted
                      ? "text-gray-100"
                      : "text-gray-300"
                }`}
              >
                {node.name}
              </span>
            </div>
            <div className="text-[9px] text-gray-700 mt-1">
              <span className="text-cyan/40">$</span> {node.id}
              {node.details.version && (
                <span className="text-gray-700"> @{node.details.version}</span>
              )}
            </div>
          </div>

          {/* Active indicator pulse */}
          {(isHovered || isExpanded) && (
            <div className="absolute -top-px -right-px w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-cyan animate-ping opacity-40" />
              <span className="absolute inset-0 rounded-full bg-cyan" />
            </div>
          )}
        </div>

        {/* Hover tooltip */}
        {isHovered && !isExpanded && (
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none">
            <div className="bg-gray-900 border border-cyan/30 px-3 py-2 text-[10px] text-gray-300 font-mono whitespace-nowrap shadow-[0_0_10px_rgba(0,255,255,0.1)]">
              <span className="text-cyan mr-1.5">?</span>
              {node.reason}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-cyan/30" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

/* ─────────────────────────────────────────────
   Expanded Detail Panel
   ───────────────────────────────────────────── */

function ExpandedPanel({
  node,
  onClose,
}: {
  node: TechNode;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    const el = panelRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 20, height: 0 },
      { opacity: 1, y: 0, height: "auto", duration: 0.4, ease: "power3.out" }
    );

    gsap.from(el.querySelectorAll("[data-detail-line]"), {
      x: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.15,
    });
  }, [node.id]);

  const connectedNames = node.connections
    .map((id) => techNodes.find((n) => n.id === id)?.name)
    .filter(Boolean);

  return (
    <div ref={panelRef} className="mt-10 max-w-4xl overflow-hidden">
      <div className="border border-cyan/30 bg-gray-900/50">
        {/* Panel title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-cyan/20 bg-cyan/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan" />
              <span className="w-2 h-2 rounded-full bg-cyan/60" />
              <span className="w-2 h-2 rounded-full bg-gray-700" />
            </div>
            <span className="text-[10px] text-cyan font-mono uppercase tracking-widest">
              inspect: {node.id}
              {node.details.version ? `@${node.details.version}` : ""}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-cyan transition-colors font-mono text-xs px-2 py-1 border border-gray-700 hover:border-cyan/40"
          >
            [×] close
          </button>
        </div>

        {/* Panel content */}
        <div className="p-6 font-mono text-sm space-y-4">
          <div data-detail-line>
            <span className="text-cyan">$ cat</span>{" "}
            <span className="text-gray-400">{node.id}/README.md</span>
          </div>

          <div data-detail-line className="text-gray-300 text-xs leading-relaxed pl-4 border-l border-gray-700">
            {node.details.description}
          </div>

          <div data-detail-line className="mt-4">
            <span className="text-cyan">$ ls</span>{" "}
            <span className="text-gray-400">features/</span>
          </div>

          <div data-detail-line className="space-y-2 pl-4">
            {node.details.features.map((feature, i) => (
              <div key={feature} className="flex items-center gap-2 text-xs">
                <span className="text-cyan/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-gray-400">│</span>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <div data-detail-line className="mt-4">
            <span className="text-cyan">$ deps</span>{" "}
            <span className="text-gray-400">--connected</span>
          </div>

          <div data-detail-line className="flex flex-wrap gap-2 pl-4">
            {connectedNames.map((name) => (
              <span
                key={name}
                className="text-[10px] px-2 py-1 border border-gray-700 text-gray-400 uppercase tracking-wider"
              >
                {name}
              </span>
            ))}
          </div>

          <div data-detail-line className="pt-2 text-gray-700 text-xs">
            <span className="cursor-blink">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
