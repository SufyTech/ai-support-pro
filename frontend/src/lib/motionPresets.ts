import { Variants, Transition } from "motion/react";

export const transition: Transition = {
  duration: 0.6,
  ease: "easeOut",
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition
  }
};

export const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition
  }
};

export const fadeInFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const hoverLift = {
  whileHover: { 
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  whileTap: { scale: 0.98 }
};

export const viewportConfig = {
  once: true,
  amount: 0.25
};
