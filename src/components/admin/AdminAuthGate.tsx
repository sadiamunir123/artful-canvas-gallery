import { useState } from "react";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ADMIN_EMAIL, useAdminAuth } from "@/hooks/useAdminAuth";

type AdminAuthGateProps = {
  onAuthenticated: () => React.ReactNode;
};

export const AdminAuthGate = ({ onAuthenticated }: AdminAuthGateProps) => {
  const {
    user,
    isLoading,
    isSubmitting,
    isAdmin,
    authMode,
    setAuthMode,
    authError,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  } = useAdminAuth();
  const [form, setForm] = useState({ email: ADMIN_EMAIL, password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      await signIn(form.email, form.password);
      return;
    }
    await signUp(form.email, form.password);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md border border-border bg-card p-8 text-center">
        <Lock className="mx-auto mb-4 text-primary" size={36} />
        <p className="font-body text-sm text-muted-foreground animate-pulse">Checking admin access...</p>
      </div>
    );
  }

  if (user && isAdmin) {
    return <>{onAuthenticated()}</>;
  }

  if (user && !isAdmin) {
    return (
      <div className="w-full max-w-md border border-border bg-card p-8 space-y-5">
        <div className="text-center">
          <Lock className="mx-auto mb-4 text-primary" size={36} />
          <h1 className="font-display text-3xl text-foreground mb-2">Admin Access</h1>
          <p className="font-body text-sm text-muted-foreground">Signed in as {user.email}, but this account is not approved for admin access.</p>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 border border-border bg-card p-8">
      <div className="text-center">
        <Lock className="mx-auto mb-4 text-primary" size={40} />
        <h1 className="font-display text-3xl text-foreground mb-2">Admin Access</h1>
        <p className="font-body text-sm text-muted-foreground">Use {ADMIN_EMAIL} to {authMode === "login" ? "sign in" : "create the admin account"}.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">Admin Email</label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            className="bg-secondary"
            required
          />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">Password</label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
            className="bg-secondary"
            minLength={8}
            required
          />
        </div>
      </div>

      {authError && <p className="font-body text-xs text-destructive">{authError}</p>}

      <div className="space-y-3">
        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
          {authMode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
          {isSubmitting ? "Please wait..." : authMode === "login" ? "Sign in" : "Create admin account"}
        </Button>

        <Button type="button" variant="outline" className="w-full" disabled={isSubmitting} onClick={() => void signInWithGoogle()}>
          Continue with Google
        </Button>
      </div>

      <Separator />

      <button
        type="button"
        onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
        className="w-full font-body text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {authMode === "login" ? "Need to create the admin account? Sign up" : "Already verified? Sign in"}
      </button>
    </form>
  );
};