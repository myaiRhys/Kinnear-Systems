"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

/* ─── Types ─── */

interface KonamiTerminalProps {
  onNavigate: (href: string) => void;
}

interface TerminalLine {
  type: "input" | "output" | "ascii" | "error";
  text: string;
}

/* ─── Constants ─── */

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const WELCOME_ASCII: TerminalLine[] = [
  { type: "ascii", text: "" },
  { type: "ascii", text: "  \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557" },
  { type: "ascii", text: "  \u2551  KINNEAR SYSTEMS \u2014 HIDDEN TERMINAL   \u2551" },
  { type: "ascii", text: "  \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d" },
  { type: "ascii", text: "" },
  { type: "output", text: "  Type 'help' to begin." },
  { type: "output", text: "" },
];

const HELP_OUTPUT: TerminalLine[] = [
  { type: "output", text: "" },
  { type: "output", text: "  Available commands:" },
  { type: "output", text: "" },
  { type: "output", text: "    help      \u2014  Show this help message" },
  { type: "output", text: "    ls        \u2014  List site sections" },
  { type: "output", text: "    whoami    \u2014  About Kinnear Systems" },
  { type: "output", text: "    hire      \u2014  Navigate to contact form" },
  { type: "output", text: "    stack     \u2014  Show tech stack" },
  { type: "output", text: "    clear     \u2014  Clear terminal" },
  { type: "output", text: "    exit      \u2014  Close terminal" },
  { type: "output", text: "    quit      \u2014  Close terminal" },
  { type: "output", text: "" },
];

const LS_OUTPUT: TerminalLine[] = [
  { type: "output", text: "" },
  { type: "output", text: "  drwxr-xr-x  about/" },
  { type: "output", text: "  drwxr-xr-x  work/" },
  { type: "output", text: "  drwxr-xr-x  services/" },
  { type: "output", text: "  drwxr-xr-x  stack/" },
  { type: "output", text: "  drwxr-xr-x  contact/" },
  { type: "output", text: "" },
];

const WHOAMI_OUTPUT: TerminalLine[] = [
  { type: "output", text: "" },
  {
    type: "output",
    text: "  Kinnear Systems \u2014 Cape Town software studio.",
  },
  {
    type: "output",
    text: "  Building automation systems that save 500+ hours/year.",
  },
  { type: "output", text: "" },
];

const STACK_OUTPUT: TerminalLine[] = [
  { type: "output", text: "" },
  { type: "output", text: "  // Tech Stack" },
  { type: "output", text: "" },
  { type: "output", text: "    \u25b8 Next.js" },
  { type: "output", text: "    \u25b8 React" },
  { type: "output", text: "    \u25b8 Three.js" },
  { type: "output", text: "    \u25b8 GSAP" },
  { type: "output", text: "    \u25b8 Firebase" },
  { type: "output", text: "    \u25b8 Tailwind CSS" },
  { type: "output", text: "    \u25b8 Framer Motion" },
  { type: "output", text: "" },
];

const MOBILE_TAP_THRESHOLD = 1500; // 5 taps within 1.5 seconds
const MOBILE_TAP_COUNT = 5;
const TYPE_SPEED = 18; // ms per character for type-in effect

/* ─── Component ─── */

export default function KonamiTerminal({ onNavigate }: KonamiTerminalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const konamiIndexRef = useRef(0);
  const tapTimesRef = useRef<number[]>([]);
  const typeQueueRef = useRef<TerminalLine[]>([]);
  const typeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── Scroll to bottom ─── */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  /* ─── Type-in effect: adds lines one character at a time ─── */
  const typeLines = useCallback(
    (newLines: TerminalLine[], onDone?: () => void) => {
      setIsTyping(true);
      typeQueueRef.current = [...newLines];

      const processNext = () => {
        if (typeQueueRef.current.length === 0) {
          setIsTyping(false);
          onDone?.();
          return;
        }

        const line = typeQueueRef.current.shift()!;

        // ASCII and empty lines appear instantly
        if (
          line.type === "ascii" ||
          line.text.trim() === ""
        ) {
          setLines((prev) => [...prev, line]);
          scrollToBottom();
          typeTimeoutRef.current = setTimeout(processNext, 30);
          return;
        }

        // Type each character
        let charIndex = 0;
        const fullText = line.text;

        setLines((prev) => [...prev, { ...line, text: "" }]);

        const typeChar = () => {
          charIndex++;
          if (charIndex <= fullText.length) {
            setLines((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...line,
                text: fullText.slice(0, charIndex),
              };
              return updated;
            });
            scrollToBottom();
            typeTimeoutRef.current = setTimeout(typeChar, TYPE_SPEED);
          } else {
            typeTimeoutRef.current = setTimeout(processNext, 60);
          }
        };

        typeTimeoutRef.current = setTimeout(typeChar, TYPE_SPEED);
      };

      processNext();
    },
    [scrollToBottom]
  );

  /* ─── Open terminal ─── */
  const openTerminal = useCallback(() => {
    setIsOpen(true);
    setLines([]);
    setInputValue("");
    setHistoryIndex(-1);

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Type welcome message
    setTimeout(() => {
      typeLines([...WELCOME_ASCII]);
    }, 100);
  }, [typeLines]);

  /* ─── Close terminal ─── */
  const closeTerminal = useCallback(() => {
    // Clear any pending type animations
    if (typeTimeoutRef.current) {
      clearTimeout(typeTimeoutRef.current);
      typeTimeoutRef.current = null;
    }
    typeQueueRef.current = [];
    setIsTyping(false);

    setIsOpen(false);
    setLines([]);
    setInputValue("");
    setHistoryIndex(-1);

    // Unlock body scroll
    document.body.style.overflow = "";
  }, []);

  /* ─── Execute command ─── */
  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();

      // Add input line
      setLines((prev) => [...prev, { type: "input", text: `$ ${cmd}` }]);
      scrollToBottom();

      if (!trimmed) return;

      // Add to history
      setCommandHistory((prev) => {
        const filtered = prev.filter((c) => c !== trimmed);
        return [...filtered, trimmed];
      });
      setHistoryIndex(-1);

      switch (trimmed) {
        case "help":
          typeLines([...HELP_OUTPUT]);
          break;

        case "ls":
          typeLines([...LS_OUTPUT]);
          break;

        case "whoami":
          typeLines([...WHOAMI_OUTPUT]);
          break;

        case "stack":
          typeLines([...STACK_OUTPUT]);
          break;

        case "hire":
          typeLines(
            [
              { type: "output", text: "" },
              { type: "output", text: "  Navigating to contact form..." },
              { type: "output", text: "" },
            ],
            () => {
              setTimeout(() => {
                closeTerminal();
                onNavigate("#contact");
              }, 600);
            }
          );
          break;

        case "clear":
          // Clear immediately, no type-in
          if (typeTimeoutRef.current) {
            clearTimeout(typeTimeoutRef.current);
            typeTimeoutRef.current = null;
          }
          typeQueueRef.current = [];
          setIsTyping(false);
          setLines([]);
          break;

        case "exit":
        case "quit":
          typeLines(
            [
              { type: "output", text: "" },
              { type: "output", text: "  Closing terminal..." },
            ],
            () => {
              setTimeout(closeTerminal, 400);
            }
          );
          break;

        default:
          typeLines([
            { type: "output", text: "" },
            {
              type: "error",
              text: `  command not found: ${trimmed}. Type 'help' for available commands.`,
            },
            { type: "output", text: "" },
          ]);
          break;
      }
    },
    [closeTerminal, onNavigate, scrollToBottom, typeLines]
  );

  /* ─── Handle input submission ─── */
  const handleSubmit = useCallback(() => {
    if (isTyping) return;
    const cmd = inputValue;
    setInputValue("");
    executeCommand(cmd);
  }, [inputValue, isTyping, executeCommand]);

  /* ─── Handle keyboard in input ─── */
  const handleInputKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        closeTerminal();
        return;
      }

      // Command history navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue("");
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
        return;
      }
    },
    [handleSubmit, closeTerminal, commandHistory, historyIndex]
  );

  /* ─── Konami Code listener ─── */
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (isOpen) return;

      const expected = KONAMI_SEQUENCE[konamiIndexRef.current];
      const pressed = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (pressed === expected) {
        konamiIndexRef.current++;
        if (konamiIndexRef.current === KONAMI_SEQUENCE.length) {
          konamiIndexRef.current = 0;
          openTerminal();
        }
      } else {
        konamiIndexRef.current = 0;
        // Check if the failed key is the start of the sequence
        if (pressed === KONAMI_SEQUENCE[0]) {
          konamiIndexRef.current = 1;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openTerminal]);

  /* ─── Escape key to close ─── */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeTerminal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeTerminal]);

  /* ─── Auto-focus input when opened ─── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  /* ─── Mobile: 5 rapid taps on footer build text ─── */
  useEffect(() => {
    const handleFooterTap = () => {
      if (isOpen) return;

      const now = Date.now();
      tapTimesRef.current.push(now);

      // Keep only taps within the threshold window
      tapTimesRef.current = tapTimesRef.current.filter(
        (t) => now - t < MOBILE_TAP_THRESHOLD
      );

      if (tapTimesRef.current.length >= MOBILE_TAP_COUNT) {
        tapTimesRef.current = [];
        openTerminal();
      }
    };

    // Find the footer build version text
    // We look for elements containing "Build: v0.1.0" in the footer
    const findBuildElement = () => {
      const footerLis = Array.from(document.querySelectorAll("footer li"));
      for (let i = 0; i < footerLis.length; i++) {
        if (footerLis[i].textContent?.includes("Build: v0.1.0")) {
          return footerLis[i];
        }
      }
      return null;
    };

    // Retry finding the element since it may not be rendered yet
    let buildEl: Element | null = null;
    const findTimeout = setTimeout(() => {
      buildEl = findBuildElement();
      if (buildEl) {
        buildEl.addEventListener("click", handleFooterTap);
        (buildEl as HTMLElement).style.cursor = "pointer";
        (buildEl as HTMLElement).setAttribute(
          "title",
          ""
        );
      }
    }, 1000);

    return () => {
      clearTimeout(findTimeout);
      if (buildEl) {
        buildEl.removeEventListener("click", handleFooterTap);
      }
    };
  }, [isOpen, openTerminal]);

  /* ─── Cleanup type timeout on unmount ─── */
  useEffect(() => {
    return () => {
      if (typeTimeoutRef.current) {
        clearTimeout(typeTimeoutRef.current);
      }
    };
  }, []);

  /* ─── Render ─── */

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        // Close if clicking the backdrop (outside the terminal)
        if (e.target === e.currentTarget) {
          closeTerminal();
        }
      }}
    >
      <div
        className="w-full max-w-3xl h-full max-h-[80vh] flex flex-col border border-gray-700 rounded-sm overflow-hidden"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
      >
        {/* ─── Header bar ─── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#ff5f57" }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#febc2e" }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#28c840" }}
            />
          </div>
          <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">
            kinnear-terminal v1.0
          </span>
          <button
            onClick={closeTerminal}
            className="text-gray-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
            aria-label="Close terminal"
          >
            [ESC]
          </button>
        </div>

        {/* ─── Terminal output ─── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed scrollbar-thin"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => {
            if (line.type === "input") {
              return (
                <div key={i} className="text-cyan whitespace-pre">
                  {line.text}
                </div>
              );
            }
            if (line.type === "error") {
              return (
                <div key={i} className="text-red-400 whitespace-pre">
                  {line.text}
                </div>
              );
            }
            if (line.type === "ascii") {
              return (
                <div key={i} className="text-cyan whitespace-pre opacity-80">
                  {line.text}
                </div>
              );
            }
            // output
            return (
              <div key={i} className="text-gray-300 whitespace-pre">
                {line.text}
              </div>
            );
          })}

          {/* ─── Input line ─── */}
          <div className="flex items-center mt-1">
            <span className="text-cyan mr-2 shrink-0 font-mono">$</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setHistoryIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                disabled={isTyping}
                className="w-full bg-transparent text-cyan font-mono text-sm outline-none caret-transparent"
                style={{ fontSize: "inherit", lineHeight: "inherit" }}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal input"
              />
              {/* Custom blinking cursor */}
              <span
                className="absolute top-0 h-full pointer-events-none"
                style={{
                  left: `${inputValue.length}ch`,
                }}
              >
                <span
                  className="inline-block w-[0.55em] h-[1.1em] bg-cyan cursor-blink align-middle"
                  style={{ marginTop: "0.1em" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
