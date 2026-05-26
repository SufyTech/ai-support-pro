import { Shield, Target, MessageCircle, BookOpen, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  fadeInUp,
  staggerContainer,
  hoverLift,
  viewportConfig,
} from "../lib/motionPresets.ts";

const agents = [
  {
    title: "Classification Agent",
    description:
      "Instantly identifies intent and sentiment of incoming messages to route them correctly.",
    icon: Shield,
    color: "#6c6cff",
    stat: "High-accuracy intent detection", // was "99.2% accuracy"
  },
  {
    title: "Triage Agent",
    description:
      "Prioritizes tickets based on urgency and customer tiering to ensure SLA compliance.",
    icon: Target,
    color: "#22d3a0",
    stat: "Fast priority routing", // was "< 2s response"
  },
  {
    title: "Reply Agent",
    description:
      "Drafts personalized responses based on previous interactions and company tone.",
    icon: MessageCircle,
    color: "#c1c1ff",
    stat: "Human-like AI replies", // was "95% satisfaction"
  },
  {
    title: "Knowledge Agent",
    description:
      "Syncs with your documentation to provide accurate, grounded information to customers.",
    icon: BookOpen,
    color: "#a78bfa",
    stat: "Docs-aware answers", // was "10K+ docs indexed"
  },
];

export default function Agents() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto" id="agents">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="mb-24 text-center"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold block mb-4">
          Multi-Agent System
        </span>
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Specialized agents for
          <br className="hidden md:block" /> specialized tasks.
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Powered by a custom multi-agent orchestration layer, our AI agents
          collaborate to handle every aspect of customer support.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {agents.map((agent, index) => (
          <motion.div
            key={agent.title}
            variants={fadeInUp}
            {...hoverLift}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-surface/30 border border-border rounded-2xl p-8 hover:bg-surface/50 hover:border-accent/50 transition-all duration-300 group shadow-lg hover:shadow-[0_20px_40px_rgba(108,108,255,0.15)] relative overflow-hidden"
          >
            {/* Gradient Background Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top right, ${agent.color}, transparent 70%)`,
              }}
            />

            {/* Icon Container */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300 relative z-10 group-hover:shadow-lg"
              style={
                {
                  "--hover-shadow": `0 10px 30px ${agent.color}40`,
                } as React.CSSProperties
              }
            >
              <agent.icon className="w-7 h-7" />

              {/* Pulse Effect */}
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                whileHover={{ scale: 1.8, opacity: [0, 0.3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-xl border-2"
                style={{ borderColor: agent.color }}
              />
            </motion.div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="font-display text-xl font-bold mb-3 text-text-primary group-hover:text-accent transition-colors">
                {agent.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 group-hover:text-text-primary/80 transition-colors">
                {agent.description}
              </p>

              {/* Stat Badge */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-soft/50">
                <Zap className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span
                  className="text-xs font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: agent.color }}
                >
                  {agent.stat}
                </span>
              </div>
            </div>

            {/* Number Badge */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface/50 border border-border-soft flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
              <span className="text-xs font-bold text-text-muted">
                {(index + 1).toString().padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportConfig}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-text-muted mb-4">
          Powered by <span className="text-accent font-semibold">Groq LLM</span>{" "}
          and a custom multi-agent architecture.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>All agents orchestrated in real-time during beta</span>
        </div>
      </motion.div>
    </section>
  );
}
