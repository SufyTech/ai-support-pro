import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const BOOT_STEPS = [
  { text: "Initializing LangGraph agent runtime", duration: 400 },
  { text: "Loading triage + escalation agents", duration: 350 },
  { text: "Connecting RAG knowledge base", duration: 400 },
  { text: "Indexing ChromaDB vector store", duration: 350 },
  { text: "Starting observability layer", duration: 300 },
  { text: "All systems operational", duration: 200 },
];

interface BootLoaderProps {
  onComplete: () => void;
}

export default function BootLoader({ onComplete }: BootLoaderProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDone, setIsDone] = useState(false);

  // Typewriter effect for current step
  useEffect(() => {
    if (currentStep >= BOOT_STEPS.length) return;
    const full = BOOT_STEPS[currentStep].text;
    let i = 0;
    setCurrentText("");
    const typeInterval = setInterval(() => {
      i++;
      setCurrentText(full.slice(0, i));
      if (i >= full.length) clearInterval(typeInterval);
    }, 18);
    return () => clearInterval(typeInterval);
  }, [currentStep]);

  // Advance steps
  useEffect(() => {
    if (currentStep >= BOOT_STEPS.length) return;
    const delay =
      BOOT_STEPS[currentStep].duration +
      BOOT_STEPS[currentStep].text.length * 18 +
      80;
    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      if (currentStep + 1 >= BOOT_STEPS.length) {
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 600);
        }, 300);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const progress = (completedSteps.length / BOOT_STEPS.length) * 100;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="bootloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#060612",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
            @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.4)} 50%{box-shadow:0 0 40px rgba(99,102,241,0.8)} }
            @keyframes scanline {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100vh); }
            }
          `}</style>

          {/* Scanline effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
              opacity: 0.03,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #6366f1, transparent)",
                animation: "scanline 3s linear infinite",
              }}
            />
          </div>

          {/* Grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(to right, #6c6cff 1px, transparent 1px), linear-gradient(to bottom, #6c6cff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Main terminal card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              width: "100%",
              maxWidth: 540,
              margin: "0 24px",
              background: "rgba(10,10,24,0.95)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow:
                "0 0 60px rgba(99,102,241,0.15), 0 32px 64px rgba(0,0,0,0.6)",
            }}
          >
            {/* Terminal title bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                background: "rgba(99,102,241,0.06)",
                borderBottom: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ef4444",
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#10b981",
                  opacity: 0.8,
                }}
              />
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  color: "#334155",
                  letterSpacing: 1,
                }}
              >
                ai-support-pro — boot sequence
              </span>
            </div>

            {/* Terminal body */}
            <div style={{ padding: "24px 28px 28px" }}>
              {/* Logo + title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(99,102,241,0.4)",
                      "0 0 40px rgba(99,102,241,0.8)",
                      "0 0 20px rgba(99,102,241,0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  ⚡
                </motion.div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#e2e8f0",
                      letterSpacing: -0.5,
                    }}
                  >
                    AI Support Pro
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>
                    v1.0.0 · LangGraph + RAG + Observability
                  </div>
                </div>
              </div>

              {/* Boot steps */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {BOOT_STEPS.map((step, i) => {
                  const isDone = completedSteps.includes(i);
                  const isCurrent = currentStep === i && !isDone;
                  const isPending = i > currentStep;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: isPending ? 0.2 : 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 12,
                        lineHeight: 1.4,
                      }}
                    >
                      {/* Status indicator */}
                      <span
                        style={{
                          flexShrink: 0,
                          width: 14,
                          textAlign: "center",
                        }}
                      >
                        {isDone ? (
                          <span style={{ color: "#10b981", fontSize: 13 }}>
                            ✓
                          </span>
                        ) : isCurrent ? (
                          <span
                            style={{
                              color: "#6366f1",
                              animation: "blink 1s infinite",
                              fontSize: 13,
                            }}
                          >
                            ▶
                          </span>
                        ) : (
                          <span style={{ color: "#1e293b" }}>·</span>
                        )}
                      </span>

                      {/* Text */}
                      <span
                        style={{
                          color: isDone
                            ? "#64748b"
                            : isCurrent
                              ? "#e2e8f0"
                              : "#1e293b",
                          transition: "color 0.3s",
                        }}
                      >
                        {isCurrent ? currentText : step.text}
                        {isCurrent && (
                          <span
                            style={{
                              animation: "blink 0.7s infinite",
                              color: "#6366f1",
                              marginLeft: 1,
                            }}
                          >
                            █
                          </span>
                        )}
                      </span>

                      {/* Done badge */}
                      {isDone && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            marginLeft: "auto",
                            fontSize: 10,
                            color: "#10b981",
                            background: "rgba(16,185,129,0.1)",
                            border: "1px solid rgba(16,185,129,0.2)",
                            borderRadius: 4,
                            padding: "1px 6px",
                            flexShrink: 0,
                          }}
                        >
                          OK
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "#334155",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    System boot
                  </span>
                  <span
                    style={{ fontSize: 10, color: "#6366f1", fontWeight: 700 }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: "rgba(99,102,241,0.1)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                      borderRadius: 99,
                      boxShadow: "0 0 8px rgba(99,102,241,0.6)",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
