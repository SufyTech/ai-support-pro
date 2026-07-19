import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import {
  fadeInUp,
  staggerContainer,
  hoverLift,
  viewportConfig,
} from "../lib/motionPresets.ts";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams",
    price: "$99",
    features: [
      "Up to 1,000 PR reviews/month",
      "All 4 AI agents (Triage, Escalation, Knowledge, Response)",
      "Basic integrations",
      "Email support",
      "7-day free trial",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing engineering teams",
    price: "$299",
    features: [
      "Up to 10,000 PR reviews/month",
      "All 4 AI agents + priority review queue",
      "All integrations + API access",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Custom scale & compliance",
    price: "Custom",
    features: [
      "Unlimited PR reviews",
      "Custom agent training",
      "Dedicated infrastructure",
      "GDPR-conscious data handling",
      "Priority SLA options",
      "Dedicated success manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCTAClick = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan.name);
    setShowModal(true);

    // Auto-close modal after 3 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  return (
    <>
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto" id="pricing">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-24 text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold block mb-4">
            Pricing Plans
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Scale your reviews, not your costs.
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Predictable pricing for high-performance engineering teams.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeInUp}
              {...hoverLift}
              className={`relative p-10 rounded-3xl border transition-all duration-500 overflow-hidden group ${
                plan.popular
                  ? "bg-gradient-card border-accent shadow-[0_20px_50px_rgba(108,108,255,0.15)] lg:scale-105 z-10"
                  : "bg-surface/40 border-border hover:border-accent/30"
              }`}
            >
              {plan.popular && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-accent/5 pointer-events-none"
                />
              )}

              {plan.popular && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8 relative z-10">
                <h3 className="font-display text-2xl font-bold mb-2 text-text-primary group-hover:text-accent transition-colors">
                  {plan.name}
                </h3>
                <p className="text-sm text-text-muted font-medium">
                  {plan.description}
                </p>
              </div>

              <div className="mb-10 relative z-10">
                <span className="text-5xl font-black text-text-primary tracking-tighter">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-text-muted font-bold ml-2">/month</span>
                )}
              </div>

              <ul className="space-y-4 mb-12 relative z-10">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-text-secondary font-medium"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-accent" : "text-success"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCTAClick(plan)}
                className={`w-full py-4 rounded-xl font-bold text-sm relative z-10 transition-all cursor-pointer ${
                  plan.popular
                    ? "bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/20"
                    : "bg-surface-alt border border-border-soft text-text-primary hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50 flex items-center justify-center px-6"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-card border border-accent rounded-2xl p-8 max-w-md w-full shadow-[0_20px_60px_rgba(108,108,255,0.3)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-6 bg-accent/20 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </motion.div>

            {/* Title */}
            <h3 className="font-display text-2xl font-bold text-center text-text-primary mb-3">
              Plan Selected!
            </h3>

            {/* Message */}
            <p className="text-center text-text-secondary mb-6">
              You've selected the{" "}
              <span className="text-accent font-bold">{selectedPlan}</span>{" "}
              plan.
            </p>

            {/* Info Box */}
            <div className="bg-surface/50 border border-border-soft rounded-xl p-4 mb-6">
              <p className="text-sm text-text-muted text-center leading-relaxed">
                <span className="text-accent font-semibold">
                  Portfolio Demo:
                </span>{" "}
                In production, this would redirect to a secure checkout powered
                by Stripe.
              </p>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-accent text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              Got it!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
