import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Search,
  BookOpen,
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { fadeInUp, viewportConfig } from "../lib/motionPresets";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface RAGResult {
  question: string;
  answer: string;
  sources: string[];
  chunks_used: number;
}

const sampleQuestions = [
  {
    icon: "💳",
    label: "Cancel subscription",
    question: "How do I cancel my subscription?",
  },
  {
    icon: "🔒",
    label: "Reset password",
    question: "How do I reset my password?",
  },
  { icon: "⚡", label: "429 errors", question: "Why am I getting 429 errors?" },
  {
    icon: "🔌",
    label: "Slack integration",
    question: "How do I fix Slack integration?",
  },
];

export default function KnowledgeSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RAGResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (q?: string) => {
    const question = q || query;
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/rag/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) throw new Error("Failed to get answer");
      const data = await response.json();

      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to search knowledge base.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setQuery(question);
    handleSearch(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section
      id="knowledge-search"
      className="py-24 border-y border-border-soft bg-surface/10"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              RAG Knowledge Base
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black mb-4">
            Ask anything. Get instant answers.
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Our AI searches through the entire support knowledge base and
            returns accurate, cited answers in milliseconds — powered by RAG.
          </p>
        </motion.div>

        {/* Quick Questions */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-8"
        >
          <p className="text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">
            Try a question
          </p>
          <div className="flex flex-wrap gap-3">
            {sampleQuestions.map((q) => (
              <button
                key={q.label}
                onClick={() => handleQuickQuestion(q.question)}
                disabled={loading}
                className="px-4 py-2 bg-surface/40 hover:bg-surface/60 border border-border-soft hover:border-accent/30 rounded-lg text-sm font-medium text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>{q.icon}</span>
                {q.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="bg-gradient-card backdrop-blur-sm border border-border-soft rounded-2xl p-8 shadow-xl mb-6"
        >
          <label className="block text-sm font-bold text-text-primary mb-2">
            Your Question
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., How do I cancel my subscription?"
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-surface/40 border border-border-soft rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-[0_10px_40px_rgba(108,108,255,0.3)] whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? "Searching..." : "Ask AI"}
            </button>
          </div>
          <p className="text-xs text-text-muted mt-3">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-surface/60 border border-border-soft rounded text-xs">
              Enter
            </kbd>{" "}
            to search · Powered by RAG + Groq
          </p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">Error</p>
                <p className="text-sm text-red-300/80">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-card backdrop-blur-sm border border-accent/30 rounded-2xl p-8 shadow-xl relative overflow-hidden"
            >
              {/* Shimmer */}
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none"
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      AI Answer
                    </h3>
                    <p className="text-sm text-text-muted">
                      {result.chunks_used} knowledge chunks retrieved
                    </p>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-surface/40 rounded-lg p-4 mb-4">
                  <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">
                    Question
                  </p>
                  <p className="text-sm text-text-primary font-medium">
                    {result.question}
                  </p>
                </div>

                {/* Answer */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <p className="text-xs font-bold text-accent uppercase tracking-wider">
                      AI-Generated Answer
                    </p>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {result.answer}
                  </p>
                </div>

                {/* Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-bold">
                      Sources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((source) => (
                        <span
                          key={source}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface/40 border border-border-soft rounded-full text-xs text-text-muted font-medium"
                        >
                          <FileText className="w-3 h-3" />
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !loading && !error && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="text-center py-12 text-text-muted"
          >
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">
              Ask a question to search the knowledge base
            </p>
            <p className="text-xs mt-1 opacity-60">
              Billing · Account · Technical · API
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
