import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { fadeInUp, viewportConfig } from "../lib/motionPresets.ts";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));

    const errorDescription =
      url.searchParams.get("error_description") ||
      hashParams.get("error_description");
    if (errorDescription) {
      setError(errorDescription.replace(/\+/g, " "));
      return;
    }

    const code = url.searchParams.get("code");
    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error: exchangeError }) => {
          if (exchangeError) {
            setError(exchangeError.message);
          } else {
            setReady(true);
          }
        });
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    }
    setLoading(false);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      className="bg-gradient-card backdrop-blur-sm border border-border-soft rounded-2xl p-6 sm:p-8 w-full max-w-sm mx-4 sm:mx-auto shadow-2xl"
    >
      {done ? (
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-1">
            Password updated
          </h2>
          <p className="text-sm text-text-muted">
            You can now sign in with your new password. Redirecting…
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-1 text-center">
            Set a new password
          </h2>
          <p className="text-sm text-text-muted mb-6 text-center">
            Choose a password with at least 6 characters.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface/50 border border-border-soft rounded-lg px-4 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}
