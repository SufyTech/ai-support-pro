import { useState } from "react";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Loader2,
  Github,
  ShieldCheck,
  GitPullRequest,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { fadeInUp, viewportConfig } from "../lib/motionPresets.ts";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // OAuth sign-in and email sign-in land on /dashboard
  const redirectTo = `${window.location.origin}/dashboard`;
  // Password recovery must land on the dedicated reset page instead —
  // it needs to process the recovery token, not just show the dashboard.
  const resetRedirectTo = `${window.location.origin}/reset-password`;

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

  const signInWithGithub = () =>
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?"');
      return;
    }
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: resetRedirectTo },
    );
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setResetSent(true);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      className="bg-gradient-card backdrop-blur-sm border border-border-soft rounded-2xl p-8 w-full max-w-sm mx-auto shadow-2xl"
    >
      {/* Brand mark */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <GitPullRequest className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-1">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm text-text-muted">
          {isSignUp
            ? "Start automating your PR reviews in minutes."
            : "Sign in to AI CodeReview Pro."}
        </p>
      </div>

      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2.5 bg-surface/50 text-text-primary border border-border-soft rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-surface/80 hover:border-border-strong transition-all"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <button
          onClick={signInWithGithub}
          className="w-full flex items-center justify-center gap-2.5 bg-surface/50 text-text-primary border border-border-soft rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-surface/80 hover:border-border-strong transition-all"
        >
          <Github className="w-4 h-4" />
          Continue with GitHub
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 border-t border-border-soft" />
        <span className="text-xs text-text-muted uppercase tracking-wider">
          Or continue with email
        </span>
        <div className="flex-1 border-t border-border-soft" />
      </div>

      {/* Email + password form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-text-secondary mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface/50 border border-border-soft rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-text-secondary"
            >
              Password
            </label>
            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-accent hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
              minLength={6}
              placeholder="••••••••"
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
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {resetSent && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-xs text-green-400">
              Password reset email sent — check your inbox.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSignUp ? "Sign up" : "Sign in"}
        </button>
      </form>

      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError(null);
        }}
        className="w-full text-xs text-text-muted hover:text-accent transition-colors mt-4"
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted mt-6 pt-6 border-t border-border-soft">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        Encrypted & secure
      </div>
    </motion.div>
  );
}
