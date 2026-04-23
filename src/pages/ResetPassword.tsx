import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const ResetPassword = () => {
  const location = useLocation();
  const { updatePassword, authError, isSubmitting } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasRecoveryToken, setHasRecoveryToken] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const recoveryState = useMemo(() => {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    return hash.get("type") === "recovery" || hash.has("access_token");
  }, [location.hash]);

  useEffect(() => {
    setHasRecoveryToken(recoveryState);
  }, [recoveryState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 8) {
      setLocalError("Use at least 8 characters for the new password.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const ok = await updatePassword(password);
    if (ok) setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="pt-24 pb-16 px-6 md:px-12 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md border border-border bg-card p-8 space-y-6">
          <div className="text-center">
            <KeyRound className="mx-auto mb-4 text-primary" size={40} />
            <h1 className="font-display text-3xl text-foreground mb-2">Reset Password</h1>
            <p className="font-body text-sm text-muted-foreground">Choose a new password for the admin account.</p>
          </div>

          {!hasRecoveryToken ? (
            <div className="space-y-4 text-center">
              <p className="font-body text-sm text-muted-foreground">Open the password reset link from your email to continue.</p>
              <Link to="/admin" className="inline-flex items-center gap-2 font-body text-sm text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft size={16} /> Back to admin login
              </Link>
            </div>
          ) : success ? (
            <div className="space-y-4 text-center">
              <p className="font-body text-sm text-muted-foreground">Your password has been updated. You can now sign in with the new password.</p>
              <Link to="/admin" className="inline-flex items-center gap-2 font-body text-sm text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft size={16} /> Return to admin login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary pr-12"
                    minLength={8}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-primary transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">Confirm Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary"
                  minLength={8}
                  required
                />
              </div>

              {(localError || authError) && <p className="font-body text-xs text-destructive">{localError || authError}</p>}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Save new password"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;