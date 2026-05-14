import { CheckCircle2, Lock, Shield, FileCheck } from "lucide-react";
import { motion } from "motion/react";
import {
  fadeInUp,
  fadeInFromLeft,
  fadeInFromRight,
  staggerContainer,
  viewportConfig,
} from "../lib/motionPresets.ts";

export default function Security() {
  const securityFeatures = [
    "SOC 2 Type II Compliant infrastructure",
    "End-to-end data encryption in transit and at rest",
    "ISO 27001 Certified data centers (AWS/GCP)",
    "HIPAA & GDPR ready data residency options",
  ];

  const certifications = [
    { icon: Shield, label: "SOC 2", color: "#6c6cff" },
    { icon: Lock, label: "ISO 27001", color: "#22d3a0" },
    { icon: FileCheck, label: "GDPR", color: "#c1c1ff" },
  ];

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto" id="security">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="gradient-card border border-border-soft rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-10 sm:gap-12 md:gap-16 overflow-hidden relative shadow-2xl"
      >
        {/* Animated Background Lock */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.03, 0.08, 0.03],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 p-12 pointer-events-none text-accent/10 hidden md:block"
        >
          <Lock className="w-48 md:w-64 h-48 md:h-64" />
        </motion.div>

        {/* Left Content */}
        <motion.div
          variants={fadeInFromLeft}
          className="flex-1 text-left sm:text-left relative z-10 w-full"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-accent font-bold block mb-4 sm:mb-6">
            Security & Compliance
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 tracking-tight leading-tight">
            Enterprise-grade security
            <br /> by default.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-10 leading-relaxed max-w-lg">
            We understand that your data is your most valuable asset. AI Support
            Pro is built with a zero-trust architecture and military-grade
            encryption.
          </p>

          {/* Security Features List */}
          <motion.ul variants={staggerContainer} className="space-y-4 sm:space-y-5 mb-8 sm:mb-12">
            {securityFeatures.map((feature, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-text-primary font-medium group cursor-default"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0 group-hover:scale-110 transition-transform mt-0.5 sm:mt-0.5" />
                <span className="group-hover:text-accent transition-colors">
                  {feature}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Certification Badges */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-surface/50 border border-border-soft rounded-lg sm:rounded-xl hover:border-accent/50 transition-all cursor-default group"
              >
                <cert.icon
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
                  style={{ color: cert.color }}
                />
                <span className="text-[11px] sm:text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                  {cert.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Visual Card */}
        <motion.div
          variants={fadeInFromRight}
          className="flex-1 w-full flex justify-center relative z-10"
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-x-0 -bottom-8 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent blur-sm group-hover:via-accent transition-all duration-500" />

            {/* Main Security Card */}
            <motion.div
              whileHover={{ y: -10, rotateZ: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-56 h-72 sm:w-64 sm:h-80 bg-surface/40 backdrop-blur-xl border border-border-soft rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center gap-4 sm:gap-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(108,108,255,0.2)] transition-all duration-500"
            >
              {/* Lock Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 relative"
              >
                <Lock className="w-8 h-8 sm:w-10 sm:h-10" />

                {/* Pulse Animation */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-accent"
                />
              </motion.div>

              {/* Title */}
              <div className="text-center">
                <p className="text-xs sm:text-sm font-bold text-text-primary mb-1">
                  Protected By
                </p>
                <p className="text-[10px] sm:text-xs text-text-muted">Zero-Trust Vault</p>
              </div>

              {/* Encryption Badge */}
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-[10px] sm:text-xs font-mono font-bold text-accent">
                  AES-256 Encryption
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] sm:text-xs text-text-muted">
                  <span>Security Score</span>
                  <span className="text-accent font-bold">100%</span>
                </div>
                <div className="w-full h-2 bg-border-soft rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-accent to-success rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}