import { motion } from "motion/react";
import { Review } from "../types";
import {
  fadeInUp,
  staggerContainer,
  viewportConfig,
} from "../lib/motionPresets";
import {
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  GitPullRequest,
} from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  const getRiskConfig = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "high":
      case "critical":
        return {
          color: "text-red-400 bg-red-500/10 border-red-500/30",
          icon: AlertCircle,
          glow: "shadow-red-500/20",
        };
      case "medium":
        return {
          color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
          icon: Clock,
          glow: "shadow-yellow-500/20",
        };
      case "low":
        return {
          color: "text-green-400 bg-green-500/10 border-green-500/30",
          icon: CheckCircle2,
          glow: "shadow-green-500/20",
        };
      default:
        return {
          color: "text-gray-400 bg-gray-500/10 border-gray-500/30",
          icon: MessageSquare,
          glow: "shadow-gray-500/20",
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "resolved":
        return {
          color: "text-green-400 bg-green-500/10 border-green-500/30",
          icon: "✅",
        };
      case "processing":
        return {
          color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
          icon: "⚡",
        };
      case "escalated":
        return {
          color: "text-red-400 bg-red-500/10 border-red-500/30",
          icon: "🚨",
        };
      default:
        return {
          color: "text-gray-400 bg-gray-500/10 border-gray-500/30",
          icon: "📋",
        };
    }
  };

  if (loading) {
    return (
      <section
        id="review-list"
        className="py-16 sm:py-20 md:py-24 bg-surface/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-center mb-12">
            Live Review Stream
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-40 bg-surface/20 rounded-2xl border border-border-soft overflow-hidden relative"
              >
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section
        id="review-list"
        className="py-16 sm:py-20 md:py-24 bg-surface/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16 px-6 sm:px-8 bg-surface/20 border border-border-soft rounded-3xl"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-4">
              Ready for Action
            </h2>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              No reviews yet. Submit a PR above to see our AI agents analyze,
              triage risk, and respond in real-time!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="review-list" className="py-16 sm:py-20 md:py-24 bg-surface/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black">
              Live Review Stream
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {reviews.length} Active
              </span>
            </div>
          </div>
          <p className="text-text-muted">
            Watch our AI agents review pull requests in real-time
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="space-y-4"
        >
          {reviews.map((review, index) => {
            const riskConfig = getRiskConfig((review as any).risk_level);
            const statusConfig = getStatusConfig(review.status);
            const RiskIcon = riskConfig.icon;

            return (
              <motion.div
                key={review.id}
                variants={fadeInUp}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  ...(index === 0 && {
                    boxShadow: [
                      "0 0 0 0 rgba(108, 108, 255, 0)",
                      "0 0 20px 10px rgba(108, 108, 255, 0.3)",
                      "0 0 0 0 rgba(108, 108, 255, 0)",
                    ],
                  }),
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  boxShadow: { duration: 2, repeat: index === 0 ? 2 : 0 },
                }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-gradient-card backdrop-blur-sm border border-border-soft rounded-2xl p-4 sm:p-6 hover:border-accent/30 transition-all group shadow-lg hover:shadow-[0_10px_40px_rgba(108,108,255,0.15)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 left-4 px-2 py-1 bg-accent text-white text-xs font-bold rounded uppercase tracking-wider z-20"
                  >
                    New
                  </motion.div>
                )}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative z-10 pt-6 md:pt-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <h3 className="font-display font-bold text-lg sm:text-xl text-text-primary group-hover:text-accent transition-colors break-words">
                        {(review as any).pr_title}
                      </h3>

                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${riskConfig.color} ${riskConfig.glow} shadow-lg`}
                      >
                        <RiskIcon className="w-3.5 h-3.5" />
                        {(review as any).risk_level}
                      </span>

                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusConfig.color} shadow-lg`}
                      >
                        <span className="mr-1">{statusConfig.icon}</span>
                        {review.status}
                      </span>
                    </div>

                    {(review as any).code_diff && (
                      <pre className="text-text-secondary text-xs mb-4 leading-relaxed bg-surface/30 rounded-lg p-3 overflow-x-auto font-mono">
                        {(review as any).code_diff}
                      </pre>
                    )}

                    {(review as any).change_type && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-bold rounded-lg mb-4 border border-accent/20">
                        <GitPullRequest className="w-3.5 h-3.5" />
                        {(review as any).change_type}
                      </div>
                    )}

                    {(review as any).reviewComment && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 p-4 sm:p-5 bg-surface/40 rounded-xl border border-accent/20 relative overflow-hidden group/reply"
                      >
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none"
                        />

                        <div className="flex items-center gap-2 mb-3 relative z-10">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <div className="text-xs font-bold text-accent uppercase tracking-wider">
                            AI Review Comment
                          </div>
                        </div>
                        <p className="text-text-primary text-sm leading-relaxed relative z-10 group-hover/reply:text-text-primary transition-colors">
                          {(review as any).reviewComment}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-muted whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(review.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface/50 border border-border-soft flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
                  <span className="text-xs font-bold text-text-muted">
                    #{index + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
