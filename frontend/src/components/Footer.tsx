import { motion } from "motion/react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Heart,
} from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  viewportConfig,
} from "../lib/motionPresets.ts";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com",
      color: "#1DA1F2",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/sufiyan-khan-a86521301/",
      color: "#0A66C2",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/SufyTech",
      color: "#ffffff",
    },
  ];

  return (
    <footer className="w-full bg-void border-t border-border-soft pt-24 pb-12 overflow-hidden relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 relative z-10"
      >
        {/* Brand Section */}
        <motion.div variants={fadeInUp} className="col-span-2 md:col-span-1">
          <div className="font-display text-2xl font-bold text-text-primary mb-4">
            AI Support{" "}
            <span className="text-accent underline decoration-accent/30 underline-offset-4">
              Pro
            </span>
          </div>
          <p className="text-text-muted text-sm font-medium leading-relaxed max-w-xs mb-6">
            Your support team, supercharged. Engineered for precision and 24/7
            reliability.
          </p>

          {/* Newsletter signup */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 bg-surface/30 border border-border-soft rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:brightness-110 transition-all"
            >
              <Mail className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Get product updates & AI insights
          </p>
        </motion.div>

        {/* Product Links */}
        <motion.div variants={fadeInUp}>
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] mb-8">
            Product
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-medium text-text-muted">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Integrations", href: "#solutions" },
              { label: "API Docs", href: "#", external: true },
            ].map((item) => (
              <li key={item.label}>
                <motion.a
                  whileHover={{ x: 5 }}
                  href={item.href}
                  className="transition-colors inline-flex items-center gap-1 hover:text-accent group"
                >
                  {item.label}
                  {item.external && (
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Company Links */}
        <motion.div variants={fadeInUp}>
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] mb-8">
            Company
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-medium text-text-muted">
            {["About", "Blog", "Careers", "Customers"].map((item) => (
              <li key={item}>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="transition-colors inline-block hover:text-accent"
                >
                  {item}
                  {item === "Careers" && (
                    <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded-full">
                      We're hiring!
                    </span>
                  )}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Legal Links */}
        <motion.div variants={fadeInUp}>
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] mb-8">
            Legal
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-medium text-text-muted">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Security",
              "Cookie Policy",
            ].map((item) => (
              <li key={item}>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="transition-colors inline-block hover:text-accent"
                >
                  {item}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportConfig}
        className="max-w-7xl mx-auto px-6 md:px-12 pt-12 border-t border-border-soft flex flex-col md:flex-row justify-between items-center gap-6 relative z-10"
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.3em]">
            © {currentYear} AI Support Pro. All rights reserved.
          </p>
          <div className="hidden md:block w-1 h-1 rounded-full bg-border-soft" />
          <p className="text-[11px] text-text-muted flex items-center gap-1.5">
            Made with{" "}
            <Heart className="w-3 h-3 text-accent fill-accent animate-pulse" />{" "}
            by <span className="text-accent font-semibold">Sufiyan Khan</span>
          </p>
        </div>

        {/* Social Links with Icons */}
        <div className="flex gap-4">
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface/30 border border-border-soft flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent/50 transition-all group"
              style={
                {
                  "--hover-glow": `0 0 20px ${social.color}40`,
                } as React.CSSProperties
              }
            >
              <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportConfig}
        className="max-w-7xl mx-auto px-6 md:px-12 mt-8 flex justify-center relative z-10"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-surface/30 border border-border-soft rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-text-muted font-semibold">
            All systems operational
          </span>
        </div>
      </motion.div>
    </footer>
  );
}
