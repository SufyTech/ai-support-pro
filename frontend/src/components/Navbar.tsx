import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Github } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false); // Close menu after clicking
    }
  };

  const navItems = [
    "Solutions",
    "Agents",
    "How It Works",
    "Security",
    "Pricing",
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 h-16 flex justify-between items-center px-6 md:px-12 border-b transition-all duration-300 ${
          isScrolled
            ? "border-border-soft bg-void/80 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Logo */}
        <div
          role="button"
          aria-label="AI Support Pro - Go to top"
          className="font-display text-xl md:text-2xl font-bold text-text-primary flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <span className="group-hover:text-accent transition-colors">
            AI Support{" "}
            <span className="text-accent underline decoration-accent/30 underline-offset-4">
              Pro
            </span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10">
          {navItems.map((item) => (
            <button
              key={item}
              aria-label={`Scroll to ${item}`}
              onClick={() =>
                scrollToId(item.toLowerCase().replace(/\s+/g, "-"))
              }
              className="text-sm text-text-secondary font-medium hover:text-accent hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/SufyTech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary font-medium hover:text-accent transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>

          <button
            aria-label="View live demo"
            onClick={() => scrollToId("contact")}
            className="bg-accent text-white rounded-full px-7 py-2.5 text-sm font-semibold hover:brightness-110 hover:shadow-[0_0_30px_rgba(108,108,255,0.3)] transition-all cursor-pointer"
          >
            View Live Demo
          </button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-lg bg-surface/50 border border-border-soft flex items-center justify-center text-text-primary hover:bg-surface transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-void/95 backdrop-blur-md z-40 md:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-full max-w-sm bg-void border-l border-border-soft z-40 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Navigation Links */}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-text-muted font-bold mb-4">
                    Navigation
                  </p>
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() =>
                        scrollToId(item.toLowerCase().replace(/\s+/g, "-"))
                      }
                      className="w-full text-left px-4 py-3 rounded-xl text-text-primary font-semibold hover:bg-surface/50 hover:text-accent transition-all border border-transparent hover:border-accent/30"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border-soft" />

                {/* GitHub Link */}
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  href="https://github.com/yourusername/ai-support-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary font-medium hover:bg-surface/50 hover:text-accent transition-all border border-border-soft"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </motion.a>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  onClick={() => scrollToId("contact")}
                  className="w-full bg-accent text-white rounded-xl px-6 py-4 font-bold hover:brightness-110 hover:shadow-[0_0_30px_rgba(108,108,255,0.3)] transition-all"
                >
                  View Live Demo
                </motion.button>

                {/* Footer Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6 border-t border-border-soft"
                >
                  <p className="text-xs text-text-muted text-center">
                    Built with React + TypeScript
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
