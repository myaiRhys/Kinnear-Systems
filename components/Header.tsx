"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  /* ─── Entrance animation ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  /* ─── Live clock ─── */
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date()
          .toLocaleTimeString("en-US", { hour12: false })
          .replace(/:/g, ":");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ─── Hide on scroll down, show on scroll up ─── */
  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      const currentY = lenis.scroll;
      const delta = currentY - lastScrollY.current;

      if (currentY > 300) {
        if (delta > 5) {
          setIsVisible(false);
          setMobileMenuOpen(false);
        } else if (delta < -5) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis]);

  /* ─── Close mobile menu on resize to desktop ─── */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ─── Lock scroll when mobile menu is open ─── */
  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [mobileMenuOpen, lenis]);

  /* ─── Active section tracking ─── */
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""));
    const triggers: ScrollTrigger[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  /* ─── Active indicator position ─── */
  useEffect(() => {
    if (!indicatorRef.current || !navRef.current || !activeSection) return;

    const activeLink = navRef.current.querySelector(
      `[data-section="${activeSection}"]`
    ) as HTMLElement | null;

    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      gsap.to(indicatorRef.current, {
        x: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(indicatorRef.current, {
        opacity: 0,
        duration: 0.2,
      });
    }
  }, [activeSection]);

  /* ─── Smooth scroll to section ─── */
  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (lenis) {
        lenis.scrollTo(href, { offset: -60, duration: 1.4 });
      }
    },
    [lenis]
  );

  return (
    <header
      ref={headerRef}
      className={`
        fixed top-0 left-0 w-full z-50
        border-b border-gray-700 bg-black/90 backdrop-blur-sm
        transition-transform duration-300 ease-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 font-mono text-xs uppercase tracking-widest">
        {/* Logo / Name — scrolls to top */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            lenis?.scrollTo(0, { duration: 1.4 });
          }}
          className="flex items-center gap-3 cursor-pointer min-h-[44px] items-center"
        >
          <span className="text-cyan font-bold text-sm">
            KINNEAR<span className="text-gray-400">.SYS</span>
          </span>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline">
            Systems &amp; Solutions
          </span>
        </a>

        {/* Desktop navigation */}
        <nav ref={navRef} aria-label="Main navigation" className="hidden md:flex items-center gap-6 lg:gap-8 relative">
          {/* Active indicator bar */}
          <div
            ref={indicatorRef}
            className="absolute -bottom-[13px] sm:-bottom-[17px] h-px bg-cyan opacity-0"
            style={{ width: 0 }}
          />
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-section={item.href.replace("#", "")}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`
                py-2 px-1 min-h-[44px] flex items-center
                transition-colors duration-200
                ${
                  activeSection === item.href.replace("#", "")
                    ? "text-cyan"
                    : "text-gray-300 hover:text-cyan"
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side: status + hamburger */}
        <div className="flex items-center gap-3 sm:gap-4 text-gray-400">
          <span className="hidden sm:inline">
            <span className="text-cyan">&#9679;</span> ONLINE
          </span>
          <span ref={timeRef} className="tabular-nums hidden sm:inline">
            00:00:00
          </span>

          {/* Mobile hamburger — terminal style */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex flex-col items-center justify-center w-11 h-11 gap-1.5"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`block w-5 h-px bg-current transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[3.5px] text-cyan" : "text-gray-300"
              }`}
            />
            <span
              className={`block w-5 h-px bg-current transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[3.5px] text-cyan" : "text-gray-300"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ─── Mobile menu panel ─── */}
      <nav
        aria-label="Mobile navigation"
        className={`
          md:hidden overflow-hidden border-t border-gray-700
          transition-all duration-300 ease-out
          ${mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-t-transparent"}
        `}
      >
        <div className="px-4 py-4 space-y-1 font-mono text-sm">
          {/* Terminal prompt header */}
          <div className="text-[10px] text-gray-700 uppercase tracking-widest mb-3 px-3">
            $ nav --list
          </div>

          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`
                flex items-center gap-3 px-3 min-h-[48px]
                border-l-2 transition-all duration-200
                ${
                  activeSection === item.href.replace("#", "")
                    ? "border-l-cyan text-cyan bg-cyan/5"
                    : "border-l-gray-700 text-gray-300 active:bg-gray-800"
                }
              `}
            >
              <span className="text-gray-700 text-xs tabular-nums w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="uppercase tracking-widest">{item.label}</span>
              <span className="ml-auto text-gray-700">&rarr;</span>
            </a>
          ))}

          {/* Status line at bottom of menu */}
          <div className="flex items-center justify-between px-3 pt-3 mt-2 border-t border-gray-800 text-[10px] text-gray-700 uppercase tracking-widest">
            <span>
              <span className="text-cyan">&#9679;</span> online
            </span>
            <span ref={mobileMenuOpen ? undefined : timeRef} className="tabular-nums">
              {new Date().toLocaleTimeString("en-US", { hour12: false })}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
