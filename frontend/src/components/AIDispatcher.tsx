import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Sparkles, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { createReview } from "../api/client";
import { Review } from "../types";
import { fadeInUp, viewportConfig } from "../lib/motionPresets";

interface AIDispatcherProps {
  onReviewCreated?: (review: Review) => void;
}

export default function AIDispatcher({ onReviewCreated }: AIDispatcherProps) {
  const [prTitle, setPrTitle] = useState("");
  const [codeDiff, setCodeDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);

  const quickScenarios = [
    {
      icon: "🐛",
      label: "Bug Fix",
      prTitle: "Fix retry logic in API client",
      codeDiff:
        "+ for attempt in range(3):\n+     try:\n+         return requests.get(url)\n+     except: continue",
    },
    {
      icon: "🔐",
      label: "Auth Change",
      prTitle: "Update password hashing logic",
      codeDiff: "- password = hash(password)\n+ password = md5(password)",
    },
    {
      icon: "📦",
      label: "Dependency",
      prTitle: "Bump lodash to 4.17.21",
      codeDiff: '- "lodash": "4.17.15"\n+ "lodash": "4.17.21"',
    },
  ];

  const handleQuickTest = (scenario: (typeof quickScenarios)[0]) => {
    setPrTitle(scenario.prTitle);
    setCodeDiff(scenario.codeDiff);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prTitle.trim() || !codeDiff.trim()) {
      setError("Please fill in both PR title and code diff");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const newReview = await createReview({
        pr_title: prTitle.trim(),
        code_diff: codeDiff.trim(),
      });

      setResult(newReview);

      if (onReviewCreated) {
        onReviewCreated(newReview);
      }

      setTimeout(() => {
        const reviewSection = document.getElementById("review-list");
        if (reviewSection) {
          reviewSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);

      setTimeout(() => {
        setPrTitle("");
        setCodeDiff("");
        setResult(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Failed to create review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="demo"
      className="py-24 bg-surface/20 border-y border-border-soft"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              AI Code Review Dispatcher
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black mb-4">
            Test our AI agents in real-time
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Submit a PR title and code diff, and watch our AI agents
            automatically triage risk, review the change, and generate a verdict
            in milliseconds.
          </p>
        </motion.div>

        {/* Quick Test Scenarios */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-8"
        >
          <p className="text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">
            Quick Test Scenarios
          </p>
          <div className="flex flex-wrap gap-3">
            {quickScenarios.map((scenario) => (
              <button
                key={scenario.label}
                onClick={() => handleQuickTest(scenario)}
                disabled={loading}
                className="px-4 py-2 bg-surface/40 hover:bg-surface/60 border border-border-soft hover:border-accent/30 rounded-lg text-sm font-medium text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>{scenario.icon}</span>
                {scenario.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          onSubmit={handleSubmit}
          className="bg-gradient-card backdrop-blur-sm border border-border-soft rounded-2xl p-8 shadow-xl"
        >
          <div className="space-y-6">
            {/* PR Title Input */}
            <div>
              <label
                htmlFor="prTitle"
                className="block text-sm font-bold text-text-primary mb-2"
              >
                PR Title
              </label>
              <input
                type="text"
                id="prTitle"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                placeholder="e.g., Add retry logic to API client"
                disabled={loading}
                className="w-full px-4 py-3 bg-surface/40 border border-border-soft rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Code Diff Input */}
            <div>
              <label
                htmlFor="codeDiff"
                className="block text-sm font-bold text-text-primary mb-2"
              >
                Code Diff
              </label>
              <textarea
                id="codeDiff"
                value={codeDiff}
                onChange={(e) => setCodeDiff(e.target.value)}
                placeholder="Paste your diff here, e.g.:&#10;- old code&#10;+ new code"
                rows={6}
                disabled={loading}
                className="w-full px-4 py-3 bg-surface/40 border border-border-soft rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all resize-none font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !prTitle.trim() || !codeDiff.trim()}
              className="w-full px-6 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_10px_40px_rgba(108,108,255,0.3)]"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Reviewing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Run AI Review
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">Error</p>
                <p className="text-sm text-red-300/80">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8 bg-gradient-card backdrop-blur-sm border border-accent/30 rounded-2xl p-8 shadow-xl relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none"
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      AI Review Complete
                    </h3>
                    <p className="text-sm text-text-muted">
                      Processed in milliseconds
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface/40 rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">
                      PR Title
                    </p>
                    <p className="text-sm text-text-primary font-medium">
                      {(result as any).pr_title}
                    </p>
                  </div>
                  <div className="bg-surface/40 rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">
                      Change Type
                    </p>
                    <p className="text-sm text-accent font-bold">
                      {(result as any).change_type}
                    </p>
                  </div>
                  <div className="bg-surface/40 rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">
                      🚨 Risk Level
                    </p>
                    <p className="text-sm text-text-primary font-bold capitalize">
                      {(result as any).risk_level}
                    </p>
                  </div>
                  <div className="bg-surface/40 rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">
                      Status
                    </p>
                    <p className="text-sm text-text-primary font-bold capitalize">
                      {result.status}
                    </p>
                  </div>
                </div>

                {(result as any).reviewComment && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <p className="text-xs font-bold text-accent uppercase tracking-wider">
                        AI Review Comment
                      </p>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {(result as any).reviewComment}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
