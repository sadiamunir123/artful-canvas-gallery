import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAIL = "iamsadiamunir7788@gmail.com";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_PATH = "/admin";
export const ADMIN_AUTH_ERROR_PARAM = "admin_error";
const ADMIN_REDIRECT_STORAGE_KEY = "haq_admin_redirect";

const normalizeEmail = (email: string | null | undefined): string => (email ?? "").trim().toLowerCase();

const readAdminAuthError = (): string | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const message = params.get(ADMIN_AUTH_ERROR_PARAM) ?? params.get("error_description") ?? params.get("error");
  return message ? decodeURIComponent(message.replace(/\+/g, " ")) : null;
};

export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  return null;
};

const isAdminEmail = (email: string | null | undefined): boolean =>
  normalizeEmail(email) === normalizeEmail(ADMIN_EMAIL);

export const clearAdminRedirect = () => {
  try {
    window.localStorage.removeItem(ADMIN_REDIRECT_STORAGE_KEY);
    window.sessionStorage.removeItem(ADMIN_REDIRECT_STORAGE_KEY);
  } catch {
    // Ignore storage restrictions.
  }
};

// In-memory admin session flag
let hardcodedSessionActive = false;

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(() => readAdminAuthError());
  const [hardcodedAdmin, setHardcodedAdmin] = useState(hardcodedSessionActive);

  const user = hardcodedAdmin
    ? ({ email: ADMIN_EMAIL, id: "hardcoded-admin" } as any)
    : session?.user ?? null;

  const isAdmin = hardcodedAdmin || isAdminEmail(user?.email);

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

    // Hardcoded admin check — works without Supabase auth
    if (normalizeEmail(email) === normalizeEmail(ADMIN_EMAIL) && password === ADMIN_PASSWORD) {
      hardcodedSessionActive = true;
      setHardcodedAdmin(true);
      setIsSubmitting(false);
      window.history.replaceState(null, "", ADMIN_PATH);
      clearAdminRedirect();
      return true;
    }

    // Fallback: try Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });
    setIsSubmitting(false);

    if (error) {
      setAuthError("Invalid login credentials");
      return false;
    }

    if (!isAdminEmail(data.user?.email)) {
      await supabase.auth.signOut();
      setAuthError(`Only ${ADMIN_EMAIL} can access the admin panel.`);
      return false;
    }

    setSession(data.session);
    window.history.replaceState(null, "", ADMIN_PATH);
    clearAdminRedirect();
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
    hardcodedSessionActive = false;
    setHardcodedAdmin(false);
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
    requestPasswordReset,
    updatePassword,
    signOut,
  };
};
