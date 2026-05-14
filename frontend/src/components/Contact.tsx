import { useState, useRef, FormEvent } from "react";
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle,
  Sparkles,
  Zap,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createTicket } from "../api/client.ts";
import { fadeInUp, hoverLift, viewportConfig } from "../lib/motionPresets.ts";

interface ContactProps {
  onTicketCreated: () => void;
}

export default function Contact({ onTicketCreated }: ContactProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultTicket, setResultTicket] = useState<any | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const startTime = Date.now();

    try {
      const ticket = await createTicket({ subject, description });
      const endTime = Date.now();
      setProcessingTime(endTime - startTime);
      setResultTicket(ticket);
      setIsResultOpen(true);
      setIsSuccess(true);
      setSubject("");
      setDescription("");
      onTicketCreated();

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to create ticket",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "urgent":
        return {
          color: "bg-red-500/20 border-red-500/40 text-red-300",
          icon: "🚨",
        };
      case "medium":
        return {
          color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
          icon: "⚡",
        };
      case "low":
        return {
          color: "bg-green-500/20 border-green-500/40 text-green-300",
          icon: "✅",
        };
      default:
        return {
          color: "bg-gray-500/20 border-gray-500/40 text-gray-300",
          icon: "📋",
        };
    }
  };

  return (
    <>
      <section
        className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto"
        id="contact"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          className="bg-accent rounded-2xl sm:rounded-3xl md:rounded-[40px] px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-24 lg:px-24 lg:py-32 text-center relative overflow-hidden shadow-[0_30px_100px_rgba(108,108,255,0.3)]"
        >
          {/* Decorative circles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-void/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-full mb-4 sm:mb-6"
            >
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                Live AI Demo
              </span>
            </motion.div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tighter px-4">
              Ready to automate
              <br /> your support?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-12 font-medium px-4">
              Join 500+ companies using AI Support Pro to resolve tickets 10x
              faster and save thousands in operational costs.
            </p>

            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 sm:gap-12 lg:gap-16 mt-8 sm:mt-12 md:mt-16 text-left">
              <div className="flex-1 space-y-6 sm:space-y-8 flex flex-col items-center lg:items-start w-full max-w-md lg:max-w-none">
                <div className="flex flex-col gap-4 sm:gap-6 w-full sm:w-auto">
                  <motion.a
                    href="mailto:suzkhan135@gmail.com?subject=Demo Request - AI Support Pro&body=Hi Team,%0D%0A%0D%0AI'm interested in scheduling a demo of AI Support Pro for my organization.%0D%0A%0D%0ACompany Details:%0D%0A• Company Name: [Your Company]%0D%0A• Industry: [e.g., SaaS, E-commerce, Healthcare]%0D%0A• Current Support Volume: [e.g., 500 tickets/month]%0D%0A• Team Size: [e.g., 5-10 agents]%0D%0A%0D%0APreferred Demo Time:%0D%0A• Option 1: [e.g., Tomorrow 2 PM IST]%0D%0A• Option 2: [e.g., Friday 11 AM IST]%0D%0A%0D%0AKey Pain Points:%0D%0A• [e.g., Long response times]%0D%0A• [e.g., High support costs]%0D%0A%0D%0ALooking forward to seeing AI Support Pro in action!%0D%0A%0D%0ABest regards,%0D%0A[Your Name]%0D%0A[Your Title]%0D%0A[Your Phone Number]"
                    {...hoverLift}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-accent px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 w-full sm:w-fit"
                  >
                    Schedule Demo{" "}
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </motion.a>
                  <motion.a
                    href="mailto:sales@aisupportpro.com"
                    whileHover={{ x: 5 }}
                    className="text-white font-bold text-base sm:text-lg flex items-center gap-3 hover:underline justify-center sm:justify-start"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="hidden sm:inline">
                      sales@aisupportpro.com
                    </span>
                    <span className="sm:hidden text-sm">Get in touch</span>
                  </motion.a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-sm">
                  {[
                    { label: "Avg Response", value: "< 1s" },
                    { label: "Resolution Rate", value: "94%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 sm:p-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl backdrop-blur-sm"
                    >
                      <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/70 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket Creation + AI Tester */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 w-full max-w-md bg-void/30 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative group hover:border-white/30 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl sm:rounded-3xl -z-10" />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                      AI Support Dispatcher
                    </h3>
                    <p className="text-[10px] sm:text-xs text-white/60">
                      Test our AI agents in real-time
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                </div>

                {/* Preset tickets */}
                <div className="mb-5 sm:mb-6">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wide text-white/50 mb-2 sm:mb-3 flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    Quick Test Scenarios
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubject("Payment failing on upgrade");
                        setDescription(
                          "I'm trying to upgrade to the Growth plan but my card keeps getting declined. The bank says everything is fine on their end.",
                        );
                      }}
                      className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      💳 Billing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubject("Cannot log in to my account");
                        setDescription(
                          "I'm locked out of my account even after resetting my password. It says 'invalid credentials' every time I try.",
                        );
                      }}
                      className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      🔒 Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubject("Production API is timing out");
                        setDescription(
                          "Our production integration is failing with timeouts when calling your API. Is there an outage or rate limit on our account?",
                        );
                      }}
                      className="text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      🚨 API
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Ticket subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Describe the issue in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting || isSuccess}
                    className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
                      isSuccess
                        ? "bg-green-500 text-white"
                        : "bg-white text-accent hover:shadow-xl"
                    } disabled:opacity-50`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                        <span className="hidden sm:inline">Processing...</span>
                        <span className="sm:hidden">Processing</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                        Success!
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span className="hidden sm:inline">
                          Run AI Dispatcher
                        </span>
                        <span className="sm:hidden">Run AI</span>
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <p className="text-[10px] sm:text-xs text-red-300 font-medium">
                          {errorMessage}
                        </p>
                      </motion.div>
                    )}
                    {isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2.5 sm:p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                      >
                        <p className="text-[10px] sm:text-xs text-green-300 font-semibold flex items-center gap-2">
                          <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                          <span>Processed in {processingTime}ms</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* AI Result Panel */}
      <AnimatePresence>
        {resultTicket && isResultOpen && (
          <motion.section
            ref={resultRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="px-4 sm:px-6 md:px-12 max-w-5xl mx-auto -mt-6 sm:-mt-10 mb-12 sm:mb-20"
          >
            <div className="bg-gradient-card border border-accent/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(108,108,255,0.3)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

              <div className="flex items-start justify-between mb-5 sm:mb-6 relative z-10 gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-text-primary font-bold text-sm sm:text-base md:text-lg truncate">
                      AI Analysis Complete
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted">
                      Processed in {processingTime}ms
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsResultOpen(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface/50 border border-border-soft flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-all flex-shrink-0"
                >
                  <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </motion.button>
              </div>

              {/* Subject */}
              <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-surface/30 rounded-xl border border-border-soft relative z-10">
                <p className="text-[10px] sm:text-xs text-text-muted mb-1">
                  Subject
                </p>
                <p className="text-sm sm:text-base text-text-primary font-semibold break-words">
                  {resultTicket.subject}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-3 sm:gap-4 text-sm mb-5 sm:mb-6 grid-cols-1 sm:grid-cols-3 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-surface/40 border border-border-soft rounded-xl p-3 sm:p-4"
                >
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-text-muted mb-1.5 sm:mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Category
                  </p>
                  <p className="font-bold text-sm sm:text-base text-text-primary">
                    {resultTicket.category || "Unknown"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`border rounded-xl p-3 sm:p-4 ${getPriorityConfig(resultTicket.priority).color}`}
                >
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide opacity-70 mb-1.5 sm:mb-2 flex items-center gap-2">
                    {getPriorityConfig(resultTicket.priority).icon}
                    Priority
                  </p>
                  <p className="font-bold text-sm sm:text-base">
                    {resultTicket.priority || "Not set"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-surface/40 border border-border-soft rounded-xl p-3 sm:p-4"
                >
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-text-muted mb-1.5 sm:mb-2 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    Status
                  </p>
                  <p className="font-bold text-sm sm:text-base text-text-primary">
                    {resultTicket.status}
                    {resultTicket.status === "resolved" && " · auto"}
                    {resultTicket.status === "new" && " · human"}
                  </p>
                </motion.div>
              </div>

              {/* AI Reply */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-accent flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-text-muted font-bold">
                    AI-Generated Reply
                  </p>
                </div>
                <div className="bg-surface/40 border border-accent/20 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-text-primary whitespace-pre-wrap max-h-48 sm:max-h-60 overflow-y-auto leading-relaxed">
                  {resultTicket.suggestedReply || "No reply generated."}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
