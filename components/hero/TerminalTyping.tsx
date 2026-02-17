"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";

interface TerminalTypingProps {
  /** Single text or array of texts to cycle through */
  text: string | string[];
  speed?: number;
  startDelay?: number;
  /** Pause duration (ms) when a line is fully typed before erasing */
  holdDuration?: number;
  /** Speed of erasing characters (ms per char) */
  eraseSpeed?: number;
  onComplete?: () => void;
  className?: string;
}

type Phase = "idle" | "typing" | "holding" | "erasing";

export default function TerminalTyping({
  text,
  speed = 80,
  startDelay = 1200,
  holdDuration = 3000,
  eraseSpeed = 30,
  onComplete,
  className = "",
}: TerminalTypingProps) {
  const texts = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  );
  const isCycling = texts.length > 1;

  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const textIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTyping = useCallback(() => {
    setStarted(true);
    setPhase("typing");
  }, []);

  // Start delay
  useEffect(() => {
    const timeout = setTimeout(startTyping, startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay, startTyping]);

  // Typing / erasing / cycling logic
  useEffect(() => {
    if (!started) return;

    const currentText = texts[textIndex.current];

    if (phase === "typing") {
      if (displayed.length < currentText.length) {
        timerRef.current = setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, speed + Math.random() * 40);
      } else {
        // Fully typed
        if (isCycling) {
          setPhase("holding");
        } else {
          setPhase("idle");
          onComplete?.();
        }
      }
    } else if (phase === "holding") {
      timerRef.current = setTimeout(() => {
        setPhase("erasing");
      }, holdDuration);
    } else if (phase === "erasing") {
      if (displayed.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, eraseSpeed);
      } else {
        // Move to next text
        textIndex.current = (textIndex.current + 1) % texts.length;
        setPhase("typing");
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [started, displayed, phase, texts, isCycling, speed, holdDuration, eraseSpeed, onComplete]);

  const showBlinkingCursor = phase === "idle" || phase === "holding";

  return (
    <span className={className}>
      <span className="text-gray-400 mr-2">{">"}</span>
      <span className="text-cyan">{displayed}</span>
      <span
        className={`inline-block w-[0.55em] h-[1.1em] bg-cyan ml-[2px] align-middle ${
          showBlinkingCursor ? "cursor-blink" : ""
        }`}
        style={{ opacity: showBlinkingCursor ? undefined : 1 }}
      />
    </span>
  );
}
