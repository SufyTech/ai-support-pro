import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  MessageSquarePlus,
  BarChart3,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
  X,
} from "lucide-react";
import ReviewList from "../components/ReviewList.tsx";
import AIDispatcher from "../components/AIDispatcher.tsx";
import KnowledgeSearch from "../components/KnowledgeSearch.tsx";
import ObservabilityDashboard from "../components/ObservabilityDashboard.tsx";
import { useReviews } from "../hooks/useReviews.ts";
import { useReviewStats } from "../hooks/useReviewStats.ts";
import { Review } from "../types.ts";
import { supabase } from "../lib/supabase";

type View = "overview" | "new-review" | "analytics";

export default function DashboardPage() {
  const [view, setView] = useState<View>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { reviews, loading: reviewsLoading, setReviews } = useReviews();
  const {
    stats,
    loading: statsLoading,
    refresh: refreshStats,
  } = useReviewStats();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const handleReviewCreated = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    refreshStats();
  };

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    // onAuthStateChange in App.tsx handles the redirect once the session
    // clears — this just gives the animation a moment to read as intentional
    // rather than an abrupt cut.
    setTimeout(() => {
      setIsSigningOut(false);
      setIsSignOutOpen(false);
    }, 600);
  };

  const navItems = [
    { id: "overview" as View, label: "Overview", icon: LayoutDashboard },
    { id: "new-review" as View, label: "New Review", icon: MessageSquarePlus },
    { id: "analytics" as View, label: "Analytics", icon: BarChart3 },
  ];

  const activeLabel = navItems.find((n) => n.id === view)?.label ?? "Overview";
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex min-h-screen pt-0 bg-void">
      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 transition-all duration-300 ease-in-out overflow-hidden border-r border-border-soft bg-surface/30 backdrop-blur-md ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="w-64 h-full flex flex-col p-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-2 py-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-accent/20">
              A
            </div>
            <span className="text-sm font-bold text-text-primary tracking-tight">
              AI Code Review Bot
            </span>
          </div>

          {/* Nav */}
          <div className="px-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Workspace
            </span>
          </div>
          <nav className="space-y-1 flex-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = view === id;
              return (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:bg-surface/60 hover:text-text-primary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-accent"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* User footer */}
          <div className="border-t border-border-soft pt-3 mt-2">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1">
              <div className="w-7 h-7 rounded-full bg-surface border border-border-soft flex items-center justify-center text-xs font-semibold text-text-secondary shrink-0">
                {initial}
              </div>
              <span className="text-xs text-text-secondary truncate">
                {userEmail ?? "Signed in"}
              </span>
            </div>
            <button
              onClick={() => setIsSignOutOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top bar */}
        <div className="h-14 border-b border-border-soft flex items-center px-6 gap-3 bg-void/60 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-1.5 rounded-md text-text-secondary hover:bg-surface/50 hover:text-text-primary transition-colors"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-[18px] h-[18px]" />
            ) : (
              <PanelLeftOpen className="w-[18px] h-[18px]" />
            )}
          </button>
          <div className="text-sm text-text-secondary">
            Dashboard <span className="mx-1.5">/</span>
            <span className="text-text-primary font-medium">{activeLabel}</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8 max-w-[1500px] mx-auto w-full">
          <AnimatePresence mode="wait">
            {view === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl font-bold text-text-primary mb-6">
                  Overview
                </h1>
                <KnowledgeSearch />
                <div className="mt-8">
                  <ReviewList reviews={reviews} loading={reviewsLoading} />
                </div>
              </motion.div>
            )}

            {view === "new-review" && (
              <motion.div
                key="new-review"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl font-bold text-text-primary mb-6">
                  New Review
                </h1>
                <AIDispatcher onReviewCreated={handleReviewCreated} />
              </motion.div>
            )}

            {view === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-2xl font-bold text-text-primary mb-6">
                  Analytics
                </h1>
                <ObservabilityDashboard onClose={() => setView("overview")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sign-out confirmation */}
      <AnimatePresence>
        {isSignOutOpen && (
          <motion.div
            key="signout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(6,6,18,0.85)" }}
            onClick={() => !isSigningOut && setIsSignOutOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-card backdrop-blur-sm border border-border-soft rounded-2xl p-7 w-full max-w-sm shadow-2xl relative"
            >
              {!isSigningOut && (
                <button
                  onClick={() => setIsSignOutOpen(false)}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <AnimatePresence mode="wait">
                {isSigningOut ? (
                  <motion.div
                    key="signing-out"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-accent mb-4" />
                    <p className="text-sm font-medium text-text-primary">
                      Signing you out…
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary mb-1.5">
                      Sign out of your account?
                    </h2>
                    <p className="text-sm text-text-muted mb-6">
                      You'll need to sign back in to access your dashboard and
                      review history.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsSignOutOpen(false)}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-text-secondary border border-border-soft hover:bg-surface/50 hover:text-text-primary transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmSignOut}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
