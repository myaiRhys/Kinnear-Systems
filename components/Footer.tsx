"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  /* ─── Scroll-triggered entrance ─── */
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      const columns = footer.querySelectorAll("[data-footer-col]");
      gsap.from(columns, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footer,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      const bottomBar = footer.querySelector("[data-footer-bottom]");
      if (bottomBar) {
        gsap.from(bottomBar, {
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }
    }, footer);

    return () => ctx.revert();
  }, []);

  /* ─── Smooth scroll to section ─── */
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(href, { offset: -60, duration: 1.4 });
      }
    },
    [lenis]
  );

  return (
    <footer ref={footerRef} className="border-t border-gray-700 bg-black">
      <div className="px-4 sm:px-6 py-8">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 text-xs uppercase tracking-widest font-mono">
          {/* Column 1 */}
          <div data-footer-col>
            <h4 className="text-cyan mb-3 sm:mb-4">{"// Navigation"}</h4>
            <ul className="space-y-0">
              {["About", "Work", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => scrollToSection(e, `#${item.toLowerCase()}`)}
                    className="block py-2 min-h-[44px] flex items-center text-gray-400 transition-colors duration-200 hover:text-white active:text-cyan"
                  >
                    &#8212; {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div data-footer-col>
            <h4 className="text-cyan mb-3 sm:mb-4">{"// Connect"}</h4>
            <ul className="space-y-0 text-gray-400">
              <li>
                <span className="block py-2 min-h-[44px] flex items-center text-gray-300 hover:text-white active:text-cyan transition-colors cursor-pointer">
                  &#8212; GitHub
                </span>
              </li>
              <li>
                <span className="block py-2 min-h-[44px] flex items-center text-gray-300 hover:text-white active:text-cyan transition-colors cursor-pointer">
                  &#8212; LinkedIn
                </span>
              </li>
              <li>
                <span className="block py-2 min-h-[44px] flex items-center text-gray-300 hover:text-white active:text-cyan transition-colors cursor-pointer">
                  &#8212; Email
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div data-footer-col>
            <h4 className="text-cyan mb-3 sm:mb-4">{"// Status"}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-cyan">&#9679;</span> All systems
                operational
              </li>
              <li>Build: v0.1.0</li>
              <li>Framework: Next.js 15</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          data-footer-bottom
          className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-mono uppercase tracking-widest"
        >
          <span>
            &copy; {year} Kinnear Systems. All rights reserved.
          </span>
          <span className="mt-2 sm:mt-0">
            Designed &amp; built with precision
          </span>
        </div>
      </div>
    </footer>
  );
}
