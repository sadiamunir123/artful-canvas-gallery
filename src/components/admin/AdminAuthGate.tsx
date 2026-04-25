import { useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { Eye, EyeOff, Lock, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ADMIN_EMAIL, useAdminAuth } from "@/hooks/useAdminAuth";

type AdminAuthGateProps = {
  onAuthenticated: (session: { user: User; signOut: () => Promise<void> }) => ReactNode;
};

export const AdminAuthGate = ({ onAuthenticated }: AdminAuthGateProps) => {
  const {
    user,
    isLoading,
    isSubmitting,
    isAdmin,
    authError,
    signIn,
    signInWithGoogle,
    requestPasswordReset,
    signOut,
  } = useAdminAuth();
  const [form, setForm] = useState({ email: ADMIN_EMAIL, password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signin" | "forgot">("signin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      await requestPasswordReset(form.email);
      return;
    }
    const success = await signIn(form.email, form.password);
    if (success && window.location.pathname !== "/admin") {
      window.history.replaceState(null, "", "/admin");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md border border-border bg-card p-8 text-center rounded-sm shadow-2xl">
        <Lock className="mx-auto mb-4 text-primary" size={36} />
        <p className="font-body text-sm text-muted-foreground animate-pulse">Verifying secure session...</p>
      </div>
    );
  }

  if (user && isAdmin) {
    return <>{onAuthenticated({ user, signOut })}</>;
  }

  if (user && !isAdmin) {
    return (
      <div className="w-full max-w-md border border-border bg-card p-8 space-y-5 rounded-sm shadow-2xl">
        <div className="text-center">
          <Lock className="mx-auto mb-4 text-destructive" size={36} />
          <h1 className="font-display text-3xl text-foreground mb-2">Access Denied</h1>
          <p className="font-body text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{user.email}</span>, but this account is not authorized.
          </p>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 border border-border bg-card p-8 rounded-sm shadow-2xl"
      autoComplete="on"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck size={28} />
        </div>
        <h1 className="font-display text-3xl text-foreground mb-2">
          {mode === "forgot" ? "Reset Password" : "Admin Access"}
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          {mode === "forgot"
            ? "We'll email a secure reset link to the admin address."
            : "Restricted area. Authorized admin only."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Admin Email
          </label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
            className="bg-secondary"
            autoComplete="email"
            required
          />
        </div>

        {mode === "signin" && (
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                className="bg-secondary pr-12"
                autoComplete="current-password"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {authError && (
        <p
          className={`font-body text-xs ${
            authError.toLowerCase().includes("sent") || authError.toLowerCase().includes("inactivity")
              ? "text-muted-foreground"
              : "text-destructive"
          }`}
        >
          {authError}
        </p>
      )}

      <div className="space-y-3">
        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
          <LogIn size={16} />
          {isSubmitting
            ? "Please wait..."
            : mode === "forgot"
            ? "Send reset link"
            : "Sign in securely"}
        </Button>

        {mode === "signin" && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
            onClick={() => void signInWithGoogle()}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        )}
      </div>

      <Separator />

      <button
        type="button"
        onClick={() => setMode(mode === "forgot" ? "signin" : "forgot")}
        className="w-full font-body text-sm text-primary hover:text-primary/80 transition-colors"
      >
        {mode === "forgot" ? "← Back to sign in" : "Forgot password?"}
      </button>

      <p className="text-center font-body text-[11px] tracking-widest uppercase text-muted-foreground/70">
        🔒 Secured session · Admin email only
      </p>
    </form>
  );
};
