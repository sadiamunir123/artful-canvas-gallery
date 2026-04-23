import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const ADMIN_EMAIL = "iamsadiamunir@gmail.com";

type AuthMode = "login" | "signup";

const supabaseRpc = supabase as typeof supabase & {
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState<string | null>(null);

  const syncAdminState = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);

    if (!nextSession?.user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const { error: claimError } = await supabaseRpc.rpc("claim_admin_access");

    if (claimError) {
      setAuthError(claimError.message);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabaseRpc.rpc("is_current_user_admin");

    if (error) {
      setAuthError(error.message);
      setIsAdmin(false);
    } else {
      setIsAdmin(Boolean(data));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    const handleSession = async (nextSession: Session | null) => {
      if (!active) return;
      await syncAdminState(nextSession);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void handleSession(nextSession);
    });

    void supabase.auth.getSession().then(({ data }) => {
      void handleSession(data.session);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [syncAdminState]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setIsSubmitting(false);
      setAuthError(`Only ${ADMIN_EMAIL} can access the admin panel.`);
      return false;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return false;
    }

    return true;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setAuthError(null);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setIsSubmitting(false);
      setAuthError(`Only ${ADMIN_EMAIL} can be registered as the admin account.`);
      return false;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setAuthError(error.message);
      return false;
    }

    if (!data.session) {
      setAuthError("Check your email to verify the admin account, then sign in.");
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

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setIsSubmitting(false);
      setAuthError(`Password reset is only available for ${ADMIN_EMAIL}.`);
      return false;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
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
    user: session?.user ?? null,
    isLoading,
    isSubmitting,
    isAdmin,
    authMode,
    setAuthMode,
    authError,
    signIn,
    signUp,
    signInWithGoogle,
    requestPasswordReset,
    updatePassword,
    signOut,
  };
};