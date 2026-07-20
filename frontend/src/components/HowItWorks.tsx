import { motion } from "motion/react";
import {
  fadeInUp,
  staggerContainer,
  viewportConfig,
} from "../lib/motionPresets.ts";

const steps = [
  {
    number: "01",
    title: "Connect Your Repo",
    description:
      "Connect AI CodeReview Pro alongside your existing dev tools today, with deeper CI/CD integrations planned as we progress through beta.",
  },
  {
    number: "02",
    title: "Train Your Agents",
    description:
      "Our AI scans your style guide and security checklist to learn your team's actual standards.",
  },
  {
    number: "03",
    title: "Go Live",
    description:
      "Agents begin triaging PRs and drafting review comments immediately, scaling with your volume.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-20 sm:py-24 md:py-32 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto"
      id="how-it-works"
    >
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="mb-16 sm:mb-20 md:mb-24 text-left md:flex items-end justify-between gap-12"
      >
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold block mb-4">
            The Process
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
            Seamless integration,
            <br /> instant results.
          </h2>
        </div>
        <p className="text-lg text-text-secondary max-w-sm mt-6 md:mt-0">
          We designed AI Code Review Bot to work with your current tools, not
          replace them.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-16 relative"
      >
        <div className="hidden md:block absolute top-[2.2rem] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border-soft to-transparent -z-10" />

        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={fadeInUp}
            className="relative group"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(108,108,255,0.1)",
                  "0 0 40px rgba(108,108,255,0.3)",
                  "0 0 20px rgba(108,108,255,0.1)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-2xl bg-void border border-border-soft flex items-center justify-center text-accent text-2xl font-black mb-8 shadow-xl relative z-10 group-hover:border-accent transition-colors duration-500"
            >
              {step.number}
            </motion.div>
            <h3 className="font-display text-2xl font-bold mb-4 text-text-primary group-hover:text-accent transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
