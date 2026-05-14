import { motion, AnimatePresence } from "motion/react";
import { X, Play, Maximize2 } from "lucide-react";
import { transition } from "../lib/motionPresets.ts";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl,
}: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            role="button"
            aria-label="Close demo video"
            onClick={onClose}
            className="absolute inset-0 bg-void/95 cursor-pointer"
          />

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={transition}
            aria-label="Close video player"
            onClick={onClose}
            className="absolute top-6 right-6 md:top-12 md:right-12 w-12 h-12 rounded-full bg-surface/50 border border-border-soft flex items-center justify-center text-text-muted hover:text-white hover:bg-accent hover:border-accent transition-all z-10 backdrop-blur-sm shadow-lg"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-6xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 flex items-center justify-between px-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                  <Play className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    AI Support Pro Demo
                  </h3>
                  <p className="text-xs text-text-muted">
                    Watch our AI agents in action
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface/50 border border-border-soft rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all backdrop-blur-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Fullscreen
              </motion.button>
            </motion.div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(108,108,255,0.4)] border border-accent/20">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent pointer-events-none" />

              <iframe
                src={videoUrl}
                title="AI Support Pro Demo Video"
                className="w-full h-full relative z-10"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Bottom Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center justify-center gap-6 text-xs text-text-muted"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live Demo</span>
              </div>
              <span>•</span>
              <span>Press ESC to close</span>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
