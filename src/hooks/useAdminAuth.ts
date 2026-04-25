import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const ADMIN_EMAIL = "iamsadiamunir@gmail.com";

// Auto sign-out after 30 minutes of inactivity for security
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  return null;
};

const isAdminEmail = (email: string | null | undefined): boolean =>
  (email ?? "").trim().toLowerCase() === ADMIN_EMAIL;

// Best-effort: ensures the user_roles row exists for RLS-protected writes.
// Failure here does NOT block admin UI access — gate uses email check.
const supabaseRpc = supabase as typeof supabase & {
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
};

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const user = session?.user ?? null;
  const isAdmin = isAdminEmail(user?.email);

  // Single source of truth for session. Set up listener BEFORE getSession.
  useEffect(() => {
    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setIsReady(true);

      // Best-effort role sync — never block UI on this.
      if (nextSession?.user && isAdminEmail(nextSession.user.email)) {
        Promise.resolve(supabaseRpc.rpc("claim_admin_access")).catch(() => undefined);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setIsReady(true);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Idle auto sign-out for admin security
  const idleTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!session) return;

    const resetTimer = () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        void supabase.auth.signOut();
        setAuthError("You have been signed out due to inactivity.");
      }, IDLE_TIMEOUT_MS);
    };

    const events: (keyof WindowEventMap)[] = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [session]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    if (!isAdminEmail(email)) {
      setIsSubmitting(false);
      setAuthError(`Only ${ADMIN_EMAIL} can access the admin panel.`);
      return false;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsSubmitting(true);
    setAuthError(null);

    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin`,
      extraParams: {
        login_hint: ADMIN_EMAIL,
        prompt: "select_account",
      },
    });

    setIsSubmitting(false);

    if (result.error) {
      setAuthError(result.error.message);
      return false;
    }
    return true;
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    if (!isAdminEmail(email)) {
      setIsSubmitting(false);
      setAuthError(`Password reset is only available for ${ADMIN_EMAIL}.`);
      return false;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return false;
    }

    setAuthError("Password reset email sent. Check your inbox and spam folder.");
    return true;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    user,
    isLoading: !isReady,
    isSubmitting,
    isAdmin,
    authError,
    signIn,
    signInWithGoogle,
    requestPasswordReset,
    updatePassword,
    signOut,
  };
};
