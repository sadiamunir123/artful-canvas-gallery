import { useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { Eye, EyeOff, Lock, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAdminAuth } from "@/hooks/useAdminAuth";

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
    await signIn(form.email, form.password);
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
