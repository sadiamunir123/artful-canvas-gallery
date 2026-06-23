import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_AUTH_ERROR_PARAM = "admin_error";
const ADMIN_PATH = "/admin";
const ADMIN_REDIRECT_STORAGE_KEY = "haq_admin_redirect";

const normalizeEmail = (email: string | null | undefined): string =>
  (email ?? "").trim().toLowerCase();

const readAdminAuthError = (): string | null => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const message =
    params.get(ADMIN_AUTH_ERROR_PARAM) ??
    params.get("error_description") ??
    params.get("error");
  return message ? decodeURIComponent(message.replace(/\+/g, " ")) : null;
};

export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  return null;
};

export const clearAdminRedirect = () => {
  try {
    window.localStorage.removeItem(ADMIN_REDIRECT_STORAGE_KEY);
    window.sessionStorage.removeItem(ADMIN_REDIRECT_STORAGE_KEY);
  } catch {
    // Ignore storage restrictions.
  }
};

const checkIsAdmin = async (userId: string | undefined | null): Promise<boolean> => {
  if (!userId) return false;
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("Failed to verify admin role", error);
    return false;
  }
  return !!data;
};

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(() => readAdminAuthError());
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);

  const user: User | null = session?.user ?? null;

  useEffect(() => {
    let active = true;

    const applySession = async (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      const admin = await checkIsAdmin(nextSession?.user?.id);
      if (!active) return;
      setIsAdmin(admin);
      setRoleChecked(true);
      setIsReady(true);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Defer Supabase calls to avoid deadlocks inside the auth callback.
      setTimeout(() => {
        void applySession(nextSession);
      }, 0);
    });

    void supabase.auth.getSession().then(({ data }) => {
      void applySession(data.session);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      setIsSubmitting(false);
      setAuthError("Invalid email or password.");
      return false;
    }

    const admin = await checkIsAdmin(data.user?.id);
    setIsSubmitting(false);

    if (!admin) {
      await supabase.auth.signOut();
      setAuthError("This account is not authorized as admin.");
      return false;
    }

    setSession(data.session);
    setIsAdmin(true);
    setRoleChecked(true);
    window.history.replaceState(null, "", ADMIN_PATH);
    clearAdminRedirect();
    return true;
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return false;
    }

    setAuthError("If that email is an admin, a reset link has been sent. Check your inbox and spam folder.");
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
    setIsAdmin(false);
  }, []);

  return {
    session,
    user,
    isLoading: !isReady || !roleChecked,
    isSubmitting,
    isAdmin,
    authError,
    signIn,
    requestPasswordReset,
    updatePassword,
    signOut,
  };
};
