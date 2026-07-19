import { useState } from "react";
import { motion } from "motion/react";
import { Bolt } from "lucide-react";
import { Review } from "../types.ts";

interface HeroProps {
  reviews: Review[];
  loading: boolean;
  onGetStarted: () => void;
}

export default function Hero({ reviews, loading, onGetStarted }: HeroProps) {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayedReviews = [...reviews]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    })
    .slice(0, 4);

  return (
    <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 z-[-1] gradient-hero"></div>

      <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-accent/20 rounded-full blur-[80px] sm:blur-[120px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-[80px] sm:blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-56 sm:w-80 h-56 sm:h-80 bg-accent/15 rounded-full blur-[80px] sm:blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-border-soft bg-surface text-[10px] sm:text-[11px] uppercase tracking-widest font-medium px-3 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8 animate-shimmer shimmer-chip text-text-muted flex items-center gap-2"
      >
        <Bolt className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent" />
        <span className="hidden sm:inline">Multi-Agent AI · Now in Beta</span>
        <span className="sm:hidden">Multi-Agent AI</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl max-w-5xl mx-auto mb-6 sm:mb-8 font-black leading-[1.1] tracking-tighter px-4"
      >
        Reviews that think.
        <br />
        <span className="text-gradient drop-shadow-[0_0_30px_rgba(108,108,255,0.3)]">
          Catches risk. Ships faster.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
      >
        AI Code Review Bot deploys a coordinated team of AI agents that triage,
        review, flag risk, and approve pull requests — 24/7, at any scale.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-center mb-6 sm:mb-8 w-full px-4"
      >
        <motion.button
          aria-label="Get started"
          onClick={onGetStarted}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full sm:w-auto bg-accent text-white rounded-full px-8 sm:px-10 py-3 sm:py-4 font-semibold text-sm sm:text-base hover:brightness-110 shadow-[0_0_60px_rgba(108,108,255,0.25)] transition-all cursor-pointer"
        >
          Get Started
        </motion.button>
        <motion.button
          aria-label="See how it works"
          onClick={() => scrollToId("how-it-works")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full sm:w-auto bg-surface-alt border border-border-soft text-text-primary px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base hover:bg-white/5 transition-all cursor-pointer"
        >
          How It Works
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[10px] sm:text-xs text-text-muted mb-16 sm:mb-24 font-medium uppercase tracking-[0.2em] px-4 text-center"
      >
        <span className="hidden sm:inline">
          No credit card required · Free Beta · Open Source
        </span>
        <span className="sm:hidden">No credit card · Free 14 days</span>
      </motion.div>

      {/* Hero Visual Mockup - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-5xl h-[400px] sm:h-[500px] md:h-[600px] gradient-card border border-border rounded-xl sm:rounded-2xl p-0.5 sm:p-1 relative shadow-[0_30px_100px_rgba(108,108,255,0.15)] animate-float"
      >
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-[0_0_80px_rgba(108,108,255,0.15)] z-[-1]" />
        <div className="w-full h-full bg-void/50 backdrop-blur-2xl rounded-[14px] overflow-hidden flex flex-col sm:flex-row border border-white/5 font-mono">
          {/* Mock Sidebar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:flex w-48 md:w-72 border-r border-border p-3 md:p-5 bg-surface/30 flex-col gap-2 md:gap-3">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="h-3 md:h-4 bg-surface-alt rounded w-1/3" />
              {!loading && reviews.length > 0 && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setSortOrder("desc")}
                    className={`text-[7px] md:text-[8px] font-bold px-1 md:px-1.5 py-0.5 rounded transition-colors ${
                      sortOrder === "desc"
                        ? "bg-accent text-white"
                        : "bg-surface-alt text-text-muted hover:text-text-primary"
                    }`}
                  >
                    NEW
                  </button>
                  <button
                    onClick={() => setSortOrder("asc")}
                    className={`text-[7px] md:text-[8px] font-bold px-1 md:px-1.5 py-0.5 rounded transition-colors ${
                      sortOrder === "asc"
                        ? "bg-accent text-white"
                        : "bg-surface-alt text-text-muted hover:text-text-primary"
                    }`}
                  >
                    OLD
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2 md:space-y-3 overflow-y-auto">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-10 md:h-14 bg-surface/20 rounded-lg md:rounded-xl border border-border-soft/50 animate-pulse"
                    />
                  ))
              ) : displayedReviews.length > 0 ? (
                displayedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="h-auto bg-surface/50 rounded-lg md:rounded-xl border border-border-soft p-2 md:p-3 text-[8px] md:text-[10px] text-left hover:border-accent/40 transition-colors"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-accent uppercase font-bold text-[7px] md:text-[8px]">
                        {review.change_type}
                      </span>
                      <span className="text-text-muted text-[7px] md:text-[8px]">
                        {new Date(review.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="truncate text-text-primary mb-1 text-[8px] md:text-[9px]">
                      {review.pr_title}
                    </div>
                    <div
                      className={`text-[7px] md:text-[8px] uppercase px-1 md:px-1.5 py-0.5 rounded inline-block font-bold ${
                        review.status === "new"
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {review.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[9px] md:text-xs text-text-muted text-center py-6 md:py-10 italic">
                  No reviews
                </div>
              )}
            </div>
          </div>

          {/* Mock Main Content - Responsive */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 text-xs sm:text-sm text-text-secondary text-left overflow-y-auto">
            <div className="h-10 sm:h-12 border-b border-border-soft flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      loading ? "bg-text-muted" : "bg-success"
                    } opacity-75`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      loading ? "bg-text-muted" : "bg-success"
                    }`}
                  />
                </span>
                <span
                  className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest ${
                    loading ? "text-text-muted" : "text-success"
                  }`}
                >
                  {loading ? "Connecting..." : "Agent Active"}
                </span>
              </div>
              <div
                className={`px-1.5 sm:px-2 py-0.5 rounded bg-success/10 border border-success/20 text-[8px] sm:text-[9px] font-bold text-success`}
              >
                STABLE
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-3 sm:h-4 bg-surface/30 rounded w-1/3 animate-pulse" />
                  <div className="h-3 sm:h-4 bg-surface/30 rounded w-1/2 animate-pulse" />
                  <div className="h-20 sm:h-24 bg-surface/20 rounded-xl sm:rounded-2xl animate-pulse mt-6 sm:mt-8" />
                </div>
              ) : reviews.length > 0 ? (
                <>
                  <div className="flex gap-2 text-[10px] sm:text-xs">
                    <span className="text-accent opacity-50">&gt;</span>
                    <span>System: Reviewing {reviews[0].id}...</span>
                  </div>
                  <div className="flex gap-2 text-[10px] sm:text-xs">
                    <span className="text-accent">&gt;</span>
                    <span className="text-accent font-medium">
                      Auto-Review generated [99.2% confidence]
                    </span>
                  </div>

                  <div className="bg-surface-alt/70 backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border-soft text-text-primary mt-6 sm:mt-8 relative leading-relaxed overflow-y-auto max-h-[200px] sm:max-h-[300px] text-[11px] sm:text-sm">
                    <div className="text-[9px] sm:text-[11px] text-text-muted mb-3 sm:mb-4 font-bold uppercase">
                      Reviewing:{" "}
                      {displayedReviews[0]?.pr_title || reviews[0].pr_title}
                    </div>
                    "Our AI has automatically reviewed this{" "}
                    {displayedReviews[0]?.change_type || reviews[0].change_type}{" "}
                    change.
                    {(displayedReviews[0]?.risk_level ||
                      reviews[0].risk_level) === "critical"
                      ? " Since this touches high-risk code, it has been escalated for human review."
                      : " The review comment has been posted."}
                    "
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-accent ml-2 align-middle"
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-3 sm:gap-4 opacity-50">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-border-soft border-t-accent animate-spin" />
                  <p className="text-[10px] sm:text-xs">
                    Waiting for incoming pull requests...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
