export type TechLayer = "frontend" | "backend" | "tools" | "testing";

export interface TechNode {
  id: string;
  name: string;
  layer: TechLayer;
  symbol: string;
  reason: string;
  details: {
    description: string;
    features: string[];
    version?: string;
  };
  connections: string[];
}

export const techNodes: TechNode[] = [
  // ─── Frontend Layer ───
  {
    id: "react",
    name: "React",
    layer: "frontend",
    symbol: "⚛",
    reason: "Component-driven UI with a massive ecosystem",
    details: {
      description:
        "The backbone of every interface I build. React's component model lets me compose complex UIs from isolated, testable pieces.",
      features: [
        "Server & Client Components",
        "Hooks-based state management",
        "Concurrent rendering",
        "Massive ecosystem & community",
      ],
      version: "19.x",
    },
    connections: ["nextjs", "typescript", "jest"],
  },
  {
    id: "nextjs",
    name: "Next.js 15",
    layer: "frontend",
    symbol: "▲",
    reason: "Full-stack React framework with edge-first architecture",
    details: {
      description:
        "The orchestration layer. Next.js handles routing, SSR/SSG, API routes, and deployment — so I can focus on building features.",
      features: [
        "App Router & Server Actions",
        "Static + Dynamic rendering",
        "Edge Runtime support",
        "Built-in image & font optimization",
      ],
      version: "15.x",
    },
    connections: ["react", "vercel", "firebase", "tailwind"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    layer: "frontend",
    symbol: "TS",
    reason: "Type safety catches bugs before they reach production",
    details: {
      description:
        "Every line of code is typed. TypeScript eliminates entire classes of runtime errors and makes refactoring fearless.",
      features: [
        "Static type checking",
        "IntelliSense & autocompletion",
        "Interface-driven design",
        "Catches errors at compile time",
      ],
      version: "5.x",
    },
    connections: ["react", "nextjs", "jest", "playwright"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    layer: "frontend",
    symbol: "◈",
    reason: "Utility-first CSS for rapid, consistent styling",
    details: {
      description:
        "Design directly in markup. Tailwind's utility classes eliminate context-switching and produce consistent, maintainable styles.",
      features: [
        "Utility-first workflow",
        "JIT compilation",
        "Design token system",
        "Responsive by default",
      ],
      version: "4.x",
    },
    connections: ["nextjs", "figma"],
  },

  // ─── Backend Layer ───
  {
    id: "firebase",
    name: "Firebase",
    layer: "backend",
    symbol: "🔥",
    reason: "Serverless backend that scales without infrastructure management",
    details: {
      description:
        "The entire backend in one platform. Firestore for data, Auth for identity, Functions for logic — all serverless, all managed.",
      features: [
        "Firestore real-time database",
        "Firebase Authentication",
        "Cloud Functions (Node.js)",
        "Hosting & Storage",
      ],
    },
    connections: ["nextjs", "github-actions", "jest"],
  },

  // ─── Tools Layer ───
  {
    id: "github-actions",
    name: "GitHub Actions",
    layer: "tools",
    symbol: "⚡",
    reason: "CI/CD pipelines that live next to the code",
    details: {
      description:
        "Automate everything. Tests run on push, deployments trigger on merge, and the pipeline is version-controlled alongside the code.",
      features: [
        "CI/CD pipeline automation",
        "Matrix testing strategies",
        "Automated deployments",
        "Custom workflow actions",
      ],
    },
    connections: ["vercel", "firebase", "jest", "playwright"],
  },
  {
    id: "vercel",
    name: "Vercel",
    layer: "tools",
    symbol: "▼",
    reason: "Zero-config deployments with global edge network",
    details: {
      description:
        "Push to deploy. Vercel gives every branch a preview URL and deploys to a global edge network with zero configuration.",
      features: [
        "Git-based deployments",
        "Preview environments",
        "Edge network CDN",
        "Analytics & Web Vitals",
      ],
    },
    connections: ["nextjs", "github-actions"],
  },
  {
    id: "figma",
    name: "Figma",
    layer: "tools",
    symbol: "◉",
    reason: "Design-to-code bridge for pixel-perfect implementation",
    details: {
      description:
        "Where design meets engineering. Figma's component system mirrors React's — making the handoff from design to code seamless.",
      features: [
        "Component-based design",
        "Dev mode & inspect",
        "Design tokens export",
        "Real-time collaboration",
      ],
    },
    connections: ["tailwind", "react"],
  },

  // ─── Testing Layer ───
  {
    id: "jest",
    name: "Jest",
    layer: "testing",
    symbol: "✓",
    reason: "Fast unit testing with zero config",
    details: {
      description:
        "The safety net for every function and component. Jest runs in milliseconds and catches regressions before they ship.",
      features: [
        "Snapshot testing",
        "Code coverage reports",
        "Mock functions & modules",
        "Watch mode for TDD",
      ],
    },
    connections: ["react", "firebase", "github-actions"],
  },
  {
    id: "playwright",
    name: "Playwright",
    layer: "testing",
    symbol: "▶",
    reason: "End-to-end testing across every browser",
    details: {
      description:
        "Test what users actually experience. Playwright runs real browsers and catches the integration bugs that unit tests miss.",
      features: [
        "Cross-browser testing",
        "Auto-wait & retry logic",
        "Visual regression testing",
        "Parallel test execution",
      ],
    },
    connections: ["nextjs", "github-actions", "vercel"],
  },
];

export const layers: { id: TechLayer; label: string; command: string }[] = [
  { id: "frontend", label: "Frontend", command: "ui.render()" },
  { id: "backend", label: "Backend", command: "api.connect()" },
  { id: "tools", label: "DevOps", command: "pipeline.run()" },
  { id: "testing", label: "Testing", command: "test.verify()" },
];
