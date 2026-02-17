"use client";

import { useEffect } from "react";

export default function ConsoleGreeting() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV === "production" || true) {
      // Always show in both dev and prod — it's an easter egg

      const cyan = "color: #00ffff; font-weight: bold;";
      const gray = "color: #666666;";
      const white = "color: #ffffff; font-weight: bold;";
      const dim = "color: #444444;";

      console.log(
        `%c
    ╔═══════════════════════════════════════════════╗
    ║                                               ║
    ║   ██╗  ██╗██╗███╗   ██╗███╗   ██╗███████╗    ║
    ║   ██║ ██╔╝██║████╗  ██║████╗  ██║██╔════╝    ║
    ║   █████╔╝ ██║██╔██╗ ██║██╔██╗ ██║█████╗      ║
    ║   ██╔═██╗ ██║██║╚██╗██║██║╚██╗██║██╔══╝      ║
    ║   ██║  ██╗██║██║ ╚████║██║ ╚████║███████╗    ║
    ║   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝    ║
    ║                                               ║
    ║          S Y S T E M S                        ║
    ║                                               ║
    ╚═══════════════════════════════════════════════╝
`,
        cyan
      );

      console.log(
        "%c  Hey, you're inspecting the source. We like that.\n",
        white
      );

      console.log(
        "%c  ┌─────────────────────────────────────────┐\n" +
          "  │  Built with: Next.js, React, Three.js,  │\n" +
          "  │  GSAP, Firebase, Tailwind, Framer Motion │\n" +
          "  │                                          │\n" +
          "  │  Try the Konami Code ;)                  │\n" +
          "  │  ↑ ↑ ↓ ↓ ← → ← → B A                  │\n" +
          "  └─────────────────────────────────────────┘\n",
        gray
      );

      console.log(
        "%c  Want to build something like this?\n" +
          "  → hello@kinnear.systems\n" +
          "  → kinnear.systems/#contact\n",
        dim
      );

      console.log(
        "%c  $ whoami%c → Kinnear Systems, Cape Town\n" +
          "%c  $ status%c → All systems operational\n" +
          "%c  $ uptime%c → 99.9%%\n",
        cyan, gray,
        cyan, gray,
        cyan, gray
      );
    }
  }, []);

  return null;
}
