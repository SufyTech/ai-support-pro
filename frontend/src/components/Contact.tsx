import { motion } from "motion/react";
import { useState } from "react";
import {
  Mail,
  Calendar,
  Sparkles,
  CheckCircle2,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  viewportConfig,
} from "../lib/motionPresets";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const stats = [
    { icon: Building2, value: "Beta", label: "Now Live" },
    { icon: Users, value: "4+", label: "AI Agents" },
    { icon: TrendingUp, value: "92%", label: "Auto-Resolved" },
  ];

  const benefits = [
    "4 AI agents working together — Triage, Knowledge, Response, Escalation",
    "Auto-classifies and prioritizes every ticket instantly",
    "Real AI-generated replies using Groq LLM",
    "Open source — inspect every line of code",
  ];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-accent/5 to-surface/20" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left: Social Proof + Benefits */}
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Enterprise Ready
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 leading-tight">
              Ready to automate
              <br />
              <span className="text-gradient">your support?</span>
            </h2>

            <p className="text-lg text-text-muted mb-8">
              Try AI Support Pro and see how multi-agent AI can resolve tickets
              faster and reduce your support workload automatically.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits Checklist */}
            <motion.div variants={fadeInUp} className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-muted">{benefit}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: CTA Card */}
          <motion.div variants={fadeInUp}>
            <div className="bg-gradient-card backdrop-blur-sm border border-border-soft rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                Schedule a Demo
              </h3>
              <p className="text-text-muted mb-6">
                See AI Support Pro in action. Get a personalized walkthrough
                tailored to your team's needs.
              </p>

              {/* Demo Request Form */}
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full px-4 py-3 bg-surface/40 border border-border-soft rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_10px_40px_rgba(108,108,255,0.3)]"
                >
                  <Calendar className="w-5 h-5" />
                  {submitted ? "Request Sent!" : "Schedule Demo"}
                </button>
              </form>

              {/* Success Message */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <p className="text-sm text-green-400 text-center">
                    ✓ Thanks! We'll reach out within 24 hours.
                  </p>
                </motion.div>
              )}

              {/* Alternative Contact Methods */}
              <div className="pt-6 border-t border-border-soft">
                <p className="text-xs text-text-muted text-center mb-4 uppercase tracking-wider font-bold">
                  Or reach out directly
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:suzkhan135@gmail.com?subject=Demo%20Request%20-%20AI%20Support%20Pro"
                    className="flex-1 px-4 py-3 bg-surface/40 hover:bg-surface/60 border border-border-soft hover:border-accent/30 rounded-lg text-sm font-medium text-text-primary transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Sales
                  </a>
                  <a
                    href="https://cal.com/sufytech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-surface/40 hover:bg-surface/60 border border-border-soft hover:border-accent/30 rounded-lg text-sm font-medium text-text-primary transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Call
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border-soft">
                <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    Free Beta
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    Open Source
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    Real AI
                  </span>
                </div>
              </div>
            </div>

            {/* Response Time Badge */}
            <motion.div variants={fadeInUp} className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/40 border border-accent/20 rounded-full">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm text-text-muted">
                  Average response time:{" "}
                  <span className="text-accent font-bold">&lt; 1 hour</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
