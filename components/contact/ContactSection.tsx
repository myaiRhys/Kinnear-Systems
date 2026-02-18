"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─── */

interface ContactFormData {
  name: string;
  email: string;
  projectType: "custom-system" | "fast-website" | "not-sure";
  message: string;
  budget: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const PROJECT_TYPES = [
  { value: "custom-system", label: "Custom System" },
  { value: "fast-website", label: "Fast Website" },
  { value: "not-sure", label: "Not Sure" },
] as const;

const BUDGET_RANGES = [
  { value: "", label: "Select budget (optional)" },
  { value: "under-15k", label: "Under R15,000" },
  { value: "15k-40k", label: "R15,000 – R40,000" },
  { value: "40k-80k", label: "R40,000 – R80,000" },
  { value: "80k-150k", label: "R80,000 – R150,000" },
  { value: "150k-plus", label: "R150,000+" },
] as const;

/* ─── Rate limiter (client-side) ─── */

const RATE_LIMIT_KEY = "ks_contact_submissions";
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max submissions per window

function checkRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return true;
    const timestamps: number[] = JSON.parse(raw);
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    return recent.length < RATE_LIMIT_MAX;
  } catch {
    return true;
  }
}

function recordSubmission() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  } catch {
    // Fail silently — rate limiting is best-effort on client
  }
}

/* ─── Component ─── */

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      projectType: "not-sure",
      message: "",
      budget: "",
    },
  });

  /* ─── Scroll entrance animations ─── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      if (formContainerRef.current) {
        gsap.from(formContainerRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: formContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      if (sidebarRef.current) {
        gsap.from(sidebarRef.current, {
          x: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: sidebarRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  /* ─── Success animation ─── */
  const animateSuccess = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const successEl = section.querySelector("[data-success-panel]");
    if (!successEl) return;

    gsap.fromTo(
      successEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
    gsap.from(successEl.querySelectorAll("[data-success-line]"), {
      x: -15,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });
  }, []);

  /* ─── Submit handler ─── */
  const onSubmit = async (data: ContactFormData) => {
    setErrorMessage("");

    // Rate limit check
    if (!checkRateLimit()) {
      setStatus("error");
      setErrorMessage(
        "Rate limit exceeded. Please wait before submitting again."
      );
      return;
    }

    setStatus("submitting");

    try {
      // Check if Firebase is configured
      const isConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

      if (isConfigured) {
        await addDoc(collection(db, "contact_submissions"), {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          projectType: data.projectType,
          message: data.message.trim(),
          budget: data.budget || null,
          submittedAt: serverTimestamp(),
          status: "new",
          source: "website",
        });
      } else {
        // Mock delay when Firebase isn't configured (dev mode)
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }

      recordSubmission();
      setSubmittedName(data.name.trim().split(" ")[0]);
      setStatus("success");
      reset();

      // Trigger success animation after state update
      requestAnimationFrame(() => animateSuccess());
    } catch (err) {
      console.error("[ContactForm] Submission failed:", err);
      setStatus("error");
      setErrorMessage(
        "Submission failed. Please try again or email us directly."
      );
    }
  };

  const handleNewMessage = () => {
    setStatus("idle");
    setErrorMessage("");
    setSubmittedName("");
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-alt border-t border-gray-700 px-4 sm:px-12 lg:px-24 py-16 sm:py-24"
    >
      {/* ─── Section Header ─── */}
      <div ref={headerRef} className="mb-10 sm:mb-16 max-w-3xl border-l-2 border-cyan/40 pl-4 sm:pl-6">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-6 font-mono flex items-center gap-3">
          <span className="text-cyan/20 text-2xl font-bold tabular-nums">04</span>
          {"// Contact"}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-mono tracking-tight mb-4">
          Start A Project
        </h2>
        <p className="text-sm text-gray-400 font-mono leading-relaxed">
          <span className="text-gray-300">&gt;</span> Describe your project and
          I&apos;ll respond within 24 hours with a technical assessment and timeline.
        </p>
      </div>

      {/* ─── Form + Sidebar ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        {/* Main form area */}
        <div ref={formContainerRef} className="lg:col-span-2">
          {status === "success" ? (
            <SuccessPanel name={submittedName} onNewMessage={handleNewMessage} />
          ) : (
            <div className="border border-gray-700">
              {/* Terminal title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700 bg-gray-900/30">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
                </div>
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest ml-2">
                  contact.sh
                </span>
                {status === "submitting" && (
                  <span className="ml-auto text-[10px] text-cyan font-mono animate-pulse">
                    transmitting...
                  </span>
                )}
              </div>

              {/* Form body */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 sm:p-8 space-y-6"
                noValidate
              >
                {/* Name */}
                <TerminalField
                  label="name"
                  error={errors.name?.message}
                  required
                >
                  <input
                    {...register("name", {
                      required: "Name is required",
                      maxLength: {
                        value: 100,
                        message: "Name must be under 100 characters",
                      },
                    })}
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={status === "submitting"}
                    className="terminal-input"
                  />
                </TerminalField>

                {/* Email */}
                <TerminalField
                  label="email"
                  error={errors.email?.message}
                  required
                >
                  <input
                    {...register("email", {
                      required: "Email is required",
                      maxLength: {
                        value: 254,
                        message: "Email must be under 254 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    type="email"
                    placeholder="john@company.com"
                    autoComplete="email"
                    disabled={status === "submitting"}
                    className="terminal-input"
                  />
                </TerminalField>

                {/* Project Type */}
                <TerminalField
                  label="project_type"
                  error={errors.projectType?.message}
                  required
                >
                  <select
                    {...register("projectType", {
                      required: "Select a project type",
                    })}
                    disabled={status === "submitting"}
                    className="terminal-input cursor-pointer"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </TerminalField>

                {/* Budget */}
                <TerminalField label="budget" optional>
                  <select
                    {...register("budget")}
                    disabled={status === "submitting"}
                    className="terminal-input cursor-pointer"
                  >
                    {BUDGET_RANGES.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </TerminalField>

                {/* Message */}
                <TerminalField
                  label="message"
                  error={errors.message?.message}
                  required
                >
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 20,
                        message: "Message must be at least 20 characters",
                      },
                      maxLength: {
                        value: 2000,
                        message: "Message must be under 2000 characters",
                      },
                    })}
                    placeholder="Describe your project, goals, and timeline..."
                    rows={5}
                    disabled={status === "submitting"}
                    className="terminal-input resize-none"
                  />
                </TerminalField>

                {/* Error banner */}
                {status === "error" && errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-2 px-3 py-2 border border-red-500/30 bg-red-500/5 text-xs font-mono"
                  >
                    <span className="text-red-400 shrink-0">ERR!</span>
                    <span className="text-red-300">{errorMessage}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={`
                    group w-full flex items-center gap-3
                    border px-4 sm:px-6 py-4 min-h-[48px] font-mono text-sm uppercase tracking-widest
                    transition-all duration-300
                    ${
                      status === "submitting"
                        ? "border-cyan/30 text-cyan/50 cursor-wait"
                        : "border-gray-700 text-gray-300 hover:border-cyan hover:bg-cyan/5 hover:text-cyan cursor-pointer"
                    }
                  `}
                >
                  <span className="text-cyan">$</span>
                  <span className="transition-colors duration-300">
                    {status === "submitting"
                      ? "sending..."
                      : "send_message"}
                  </span>
                  {status === "submitting" ? (
                    <span className="ml-auto w-3 h-3 border border-cyan/50 border-t-cyan rounded-full animate-spin" />
                  ) : (
                    <span className="ml-auto text-gray-700 group-hover:text-cyan transition-colors duration-300">
                      &rarr;
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar info panel */}
        <div ref={sidebarRef} className="space-y-6">
          {/* Response time */}
          <div className="border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-700" />
                <span className="w-2 h-2 rounded-full bg-gray-700" />
                <span className="w-2 h-2 rounded-full bg-gray-700" />
              </div>
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest ml-2">
                status.log
              </span>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">response_time:</span>
                <span className="text-cyan">&lt; 24hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">availability:</span>
                <span className="text-green-400">online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">timezone:</span>
                <span className="text-gray-300">SAST (UTC+2)</span>
              </div>
            </div>
          </div>

          {/* Direct contact */}
          <div className="border border-gray-700 p-4 sm:p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-700 font-mono mb-4">
              Direct channels
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-gray-700">$ </span>
                <span className="text-gray-400">email</span>
                <div className="text-cyan mt-0.5 pl-4">
                  hello@kinnear.systems
                </div>
              </div>
              <div>
                <span className="text-gray-700">$ </span>
                <span className="text-gray-400">location</span>
                <div className="text-gray-300 mt-0.5 pl-4">
                  Cape Town, South Africa
                </div>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="border border-gray-700 p-4 sm:p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-700 font-mono mb-4">
              Process
            </div>
            <div className="space-y-2 text-xs font-mono">
              {[
                "You submit the form",
                "I review within 24hrs",
                "Discovery call scheduled",
                "Proposal & timeline sent",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-cyan/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-gray-700">│</span>
                  <span className="text-gray-400">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Terminal-style Form Field Wrapper
   ───────────────────────────────────────────── */

function TerminalField({
  label,
  error,
  required,
  optional,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block mb-2">
        <span className="text-xs font-mono">
          <span className="text-cyan">$</span>{" "}
          <span className="text-gray-400">{label}</span>
          {required && <span className="text-red-400 ml-1">*</span>}
          {optional && (
            <span className="text-gray-700 ml-2 text-[10px]">(optional)</span>
          )}
        </span>
      </label>
      {children}
      {error && (
        <div className="mt-1.5 text-xs sm:text-[10px] font-mono text-red-400 flex items-center gap-1.5">
          <span className="text-red-500">▸</span> {error}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Success Panel
   ───────────────────────────────────────────── */

function SuccessPanel({
  name,
  onNewMessage,
}: {
  name: string;
  onNewMessage: () => void;
}) {
  return (
    <div data-success-panel role="status" aria-live="polite" className="border border-green-500/30">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-green-500/20 bg-green-500/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
        </div>
        <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest ml-2">
          transmission complete
        </span>
      </div>

      {/* Success content */}
      <div className="p-6 sm:p-8 font-mono space-y-4">
        <div data-success-line className="text-green-400 text-sm">
          <span className="text-green-500">✓</span> Message sent successfully
        </div>

        <div data-success-line className="text-xs text-gray-400 leading-relaxed pl-4 border-l border-green-500/20">
          Thanks{name ? `, ${name}` : ""}. Your project details have been
          logged and I&apos;ll review them within 24 hours. Expect a response
          with a technical assessment and next steps.
        </div>

        <div data-success-line className="text-xs space-y-1">
          <div>
            <span className="text-green-500/60">$</span>{" "}
            <span className="text-gray-400">status:</span>{" "}
            <span className="text-green-400">queued</span>
          </div>
          <div>
            <span className="text-green-500/60">$</span>{" "}
            <span className="text-gray-400">eta:</span>{" "}
            <span className="text-gray-300">&lt; 24 hours</span>
          </div>
          <div>
            <span className="text-green-500/60">$</span>{" "}
            <span className="text-gray-400">ref:</span>{" "}
            <span className="text-gray-700">
              #{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </span>
          </div>
        </div>

        <div data-success-line className="pt-4">
          <button
            onClick={onNewMessage}
            className="group flex items-center gap-3 border border-gray-700 px-4 sm:px-6 py-3 min-h-[48px] font-mono text-xs uppercase tracking-widest transition-all duration-300 hover:border-cyan hover:bg-cyan/5 hover:text-cyan active:bg-cyan/10 text-gray-400 cursor-pointer"
          >
            <span className="text-cyan">$</span>
            <span className="transition-colors duration-300">new_message</span>
            <span className="ml-auto text-gray-700 group-hover:text-cyan transition-colors duration-300">
              &rarr;
            </span>
          </button>
        </div>

        <div data-success-line className="pt-2 text-gray-700 text-xs">
          <span className="cursor-blink">_</span>
        </div>
      </div>
    </div>
  );
}
