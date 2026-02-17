"use client";

import { useEffect, useState, useCallback } from "react";

interface TerminalTypingProps {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
  className?: string;
}

export default function TerminalTyping({
  text,
  speed = 80,
  startDelay = 1200,
  onComplete,
  className = "",
}: TerminalTypingProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  const startTyping = useCallback(() => {
    setStarted(true);
  }, []);

  // Start delay
  useEffect(() => {
    const timeout = setTimeout(startTyping, startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay, startTyping]);

  // Typing effect
  useEffect(() => {
    if (!started || complete) return;

    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed + Math.random() * 40);
      return () => clearTimeout(timeout);
    } else {
      setComplete(true);
      onComplete?.();
    }
  }, [started, displayed, text, speed, complete, onComplete]);

  return (
    <span className={className}>
      <span className="text-gray-400 mr-2">{">"}</span>
      <span className="text-cyan">{displayed}</span>
      <span
        className={`inline-block w-[0.55em] h-[1.1em] bg-cyan ml-[2px] align-middle ${
          complete ? "cursor-blink" : ""
        }`}
        style={{ opacity: complete ? undefined : 1 }}
      />
    </span>
  );
}
