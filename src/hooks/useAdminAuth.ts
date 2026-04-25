import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const ADMIN_EMAIL = "iamsadiamunir@gmail.com";
const ADMIN_PATH = "/admin";

const normalizeEmail = (email: string | null | undefined): string => (email ?? "").trim().toLowerCase();

export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  return null;
};

const isAdminEmail = (email: string | null | undefined): boolean =>
  normalizeEmail(email) === ADMIN_EMAIL;

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const user = session?.user ?? null;
  const isAdmin = isAdminEmail(user?.email);

  // Single source of truth for auth state. Restore persisted sessions and then
  // keep the UI in sync without any role RPC calls or redirects.
  useEffect(() => {
    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setIsReady(true);
    });

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    if (!isAdminEmail(email)) {
      setIsSubmitting(false);
      setAuthError(`Only ${ADMIN_EMAIL} can access the admin panel.`);
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return false;
    }

    if (!isAdminEmail(data.user?.email)) {
      await supabase.auth.signOut();
      setAuthError(`Only ${ADMIN_EMAIL} can access the admin panel.`);
      return false;
    }

    setSession(data.session);
    window.history.replaceState(null, "", ADMIN_PATH);

    return true;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsSubmitting(true);
    setAuthError(null);

    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${ADMIN_PATH}`,
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

    window.history.replaceState(null, "", ADMIN_PATH);
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
    setSession(null);
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
