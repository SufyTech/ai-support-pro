/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import LandingPage from "./LandingPage.tsx";
import DashboardPage from "./DashboardPage.tsx";
import Login from "../components/Login.tsx";
import ResetPassword from "./ResetPassword.tsx";
import { supabase } from "../lib/supabase.ts";
import { useReviews } from "../hooks/useReviews.ts";
import { Review } from "../types.ts";
export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isResetPassword = location.pathname.startsWith("/reset-password");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const { reviews, loading: reviewsLoading, setReviews } = useReviews();
  const handleReviewCreated = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        // While the user is on /reset-password, never auto-redirect them
        // away — no matter which auth event fires. A page refresh re-loads
        // the saved recovery session and fires INITIAL_SESSION (not
        // PASSWORD_RECOVERY), which used to slip through this check and
        // bounce the user to /dashboard mid-reset. ResetPassword.tsx is
        // responsible for navigating away once the password update
        // actually succeeds.
        if (isResetPassword) {
          return;
        }

        if (newSession) {
          setIsLoginOpen(false);
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      },
    );
    return () => listener.subscription.unsubscribe();
  }, [navigate, isResetPassword]);

  return (
    <div className="relative min-h-screen font-sans selection:bg-accent/30 selection:text-white">
      <div className="fixed inset-0 z-[-2] noise-overlay" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_500px_at_50%_200px,#1b1b3a,transparent)]" />
      <div
        className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #6c6cff 1px, transparent 1px), linear-gradient(to bottom, #6c6cff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {!isDashboard && !isResetPassword && (
        <Navbar
          onLoginClick={() => setIsLoginOpen(true)}
          isLoggedIn={!!session}
        />
      )}

      <AnimatePresence>
        {isLoginOpen && !session && (
          <motion.div
            key="login-overlay"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(6,6,18,0.9)" }}
          >
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-6 right-6 text-text-secondary hover:text-white"
            >
              Close
            </button>
            <Login />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                handleReviewCreated={handleReviewCreated}
                onGetStarted={() => setIsLoginOpen(true)}
              />
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/reset-password"
            element={
              <div className="min-h-screen flex items-center justify-center px-4">
                <ResetPassword />
              </div>
            }
          />
        </Routes>
      </main>

      {!isDashboard && !isResetPassword && <Footer />}
    </div>
  );
}
