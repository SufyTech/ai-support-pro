import {
  GitPullRequest,
  MessageSquareCode,
  ShieldAlert,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  fadeInUp,
  staggerContainer,
  hoverLift,
  viewportConfig,
} from "../lib/motionPresets.ts";

const solutions = [
  {
    title: "PR Risk Triage",
    description:
      "Every incoming PR is automatically classified by change type and assigned a risk level in seconds, before a human ever opens the diff.",
    icon: GitPullRequest,
    color: "#6c6cff",
    stat: "Instant risk scoring",
    features: ["Change-type detection", "Risk scoring", "Automatic routing"],
  },
  {
    title: "Inline Review Comments",
    description:
      "AI-written review comments, grounded in your team's style guide and security checklist, posted directly on the PR with a clear verdict.",
    icon: MessageSquareCode,
    color: "#22d3a0",
    stat: "Style-guide grounded",
    features: [
      "Approve / Request changes / Comment",
      "Context-aware",
      "No generic feedback",
    ],
  },
  {
    title: "Escalation Routing",
    description:
      "High-risk changes — auth, payments, migrations — are automatically flagged for mandatory human review before merge, so nothing risky slips through.",
    icon: ShieldAlert,
    color: "#c1c1ff",
    stat: "Zero-config escalation",
    features: [
      "Auth & payment detection",
      "Migration flagging",
      "Mandatory human gate",
    ],
  },
  {
    title: "Review Analytics",
    description:
      "Track approval rates, risk trends, and review turnaround across your whole PR history from a single dashboard.",
    icon: BarChart3,
    color: "#a78bfa",
    stat: "Live insights",
    features: ["Live dashboards", "Risk trends", "Export data"],
  },
];

export default function Solutions() {
  return (
    <section
      className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto"
      id="solutions"
    >
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="mb-16 sm:mb-20 md:mb-24 text-center"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold block mb-4">
          Complete Platform
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Everything your review process
          <br className="hidden md:block" /> needs, automated.
        </h2>
        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed px-2">
          A modular architecture designed to handle every stage of the code
          review lifecycle with AI-powered intelligence.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      >
        {solutions.map((solution, index) => (
          <motion.div
            key={solution.title}
            variants={fadeInUp}
            {...hoverLift}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="gradient-card border border-border rounded-3xl p-6 sm:p-8 md:p-10 hover:border-accent/50 transition-all duration-500 group shadow-lg hover:shadow-[0_20px_60px_rgba(108,108,255,0.2)] relative overflow-hidden"
          >
            {/* Gradient Background Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top left, ${solution.color}, transparent 70%)`,
              }}
            />

            {/* Number Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface/50 border border-border-soft flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
              <span className="text-xs sm:text-sm font-bold text-text-muted">
                {(index + 1).toString().padStart(2, "0")}
              </span>
            </div>

            {/* Icon with Animation */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 sm:mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-xl"
              style={
                {
                  "--hover-shadow": `0 20px 40px ${solution.color}40`,
                } as React.CSSProperties
              }
            >
              <solution.icon className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />

              {/* Pulse Ring */}
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                whileHover={{ scale: 1.6, opacity: [0, 0.4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border-2"
                style={{ borderColor: solution.color }}
              />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4 pr-8 sm:pr-0">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">
                  {solution.title}
                </h3>

                {/* Stat Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold text-accent">
                    {solution.stat}
                  </span>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed group-hover:text-text-primary/90 transition-colors">
                {solution.description}
              </p>

              {/* Feature List */}
              <div className="pt-4 border-t border-border-soft/50 space-y-2">
                {solution.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-text-muted group-hover:text-text-secondary transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Learn More Link */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm font-semibold text-accent opacity-0 group-hover:opacity-100 transition-all pt-2 cursor-pointer"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportConfig}
        transition={{ delay: 0.8 }}
        className="mt-12 sm:mt-16 text-center px-2"
      >
        <p className="text-sm text-text-muted mb-4">
          Designed to work alongside your existing dev tools, with integrations
          planned as we progress through beta.
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-text-muted">
            Core review features available in free beta
          </span>
        </div>
      </motion.div>
    </section>
  );
}
