import { motion } from "motion/react";
import { TicketStats } from "../types.ts";
import { 
  fadeInUp, 
  staggerContainer, 
  hoverLift, 
  viewportConfig 
} from "../lib/motionPresets.ts";

interface MetricsProps {
  stats: TicketStats | null;
  loading: boolean;
}

export default function Metrics({ stats, loading }: MetricsProps) {
  const metricItems = [
    { 
      label: "Total Tickets", 
      value: loading ? "..." : (stats?.totalTickets.toLocaleString() || "0") 
    },
    { 
      label: "Avg. Resolution Time", 
      value: loading ? "..." : (stats?.avgResponseSeconds ? `${Math.round(stats.avgResponseSeconds / 60)}m` : "N/A")
    },
    { 
      label: "Auto-Resolved", 
      value: loading ? "..." : (stats ? `${stats.escalation_rate !== undefined ? (100 - stats.escalation_rate).toFixed(0) : 92}%` : "0%")
    },
    { 
      label: "Monthly Savings", 
      value: loading ? "..." : (stats ? `$${((stats.normal || 0) * 15 / 1000).toFixed(1)}k` : "$0k")
    },
  ];

  return (
    <section className="py-24 border-y border-border-soft bg-surface/20">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {metricItems.map((metric) => (
          <motion.div
            key={metric.label}
            variants={fadeInUp}
            {...hoverLift}
            className="text-center p-6 rounded-2xl transition-colors hover:bg-white/5 group"
          >
            <div className={`font-display text-4xl md:text-5xl font-black text-text-primary mb-2 tracking-tighter group-hover:text-accent transition-colors ${loading ? 'animate-pulse text-text-muted/30' : ''}`}>
              {metric.value}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
