import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const ADMIN_EMAIL = "iamsadiamunir@gmail.com";
const ADMIN_PATH = "/admin";
export const ADMIN_LOGIN_PARAM = "admin_login";
export const ADMIN_AUTH_ERROR_PARAM = "admin_error";
export const ADMIN_REDIRECT_STORAGE_KEY = "haq_admin_redirect";
const LOVABLE_PROJECT_ID = "271daa9e-a0d1-4284-8864-d8601052c602";
const OAUTH_MESSAGE_ORIGINS = ["https://oauth.lovable.app", "https://lovable.dev"];

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
  normalizeEmail(email) === ADMIN_EMAIL;

const isLocalBrowser = () =>
  typeof window !== "undefined" && ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

const createOAuthState = () => {
  const bytes = new Uint8Array(16);
  window.crypto?.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const signInWithLocalGooglePopup = () =>
  new Promise<{ access_token: string; refresh_token: string }>((resolve, reject) => {
    const state = createOAuthState();
    const redirectUrl = new URL(ADMIN_PATH, window.location.origin);
    redirectUrl.searchParams.set(ADMIN_LOGIN_PARAM, "1");
    const params = new URLSearchParams({
      project_id: LOVABLE_PROJECT_ID,
      provider: "google",
      redirect_uri: redirectUrl.toString(),
      response_mode: "web_message",
      state,
      login_hint: ADMIN_EMAIL,
      prompt: "select_account",
    });

    const popup = window.open(
      `/~oauth/initiate?${params.toString()}`,
      "admin-google-login",
      "width=560,height=720,menubar=no,toolbar=no,location=yes,status=no,scrollbars=yes,resizable=yes",
    );

    if (!popup) {
      reject(new Error("Popup was blocked. Please allow popups and try again."));
      return;
    }

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(closedCheck);
      window.clearTimeout(timeout);
      popup.close();
    };

    const fail = (message: string) => {
      cleanup();
      reject(new Error(message));
    };

    function onMessage(event: MessageEvent) {
      if (![...OAUTH_MESSAGE_ORIGINS, window.location.origin].includes(event.origin)) return;

      const payload = event.data as { type?: string; response?: Record<string, string | undefined> } | Record<string, string | undefined> | null;
      if (!payload || typeof payload !== "object") return;
      const response = "response" in payload ? payload.response ?? {} : payload;
      if ("type" in payload && payload.type && payload.type !== "authorization_response") return;

      if (response.state !== state) {
        fail("Google sign-in state did not match. Please try again.");
        return;
      }

      if (response.error) {
        fail(response.error_description ?? response.error);
        return;
      }

      if (!response.access_token || !response.refresh_token) {
        fail("No admin session was received from Google sign-in.");
        return;
      }

      cleanup();
      resolve({ access_token: response.access_token, refresh_token: response.refresh_token });
    }

    const closedCheck = window.setInterval(() => {
      if (popup.closed) fail("Google sign-in was cancelled.");
    }, 500);

    const timeout = window.setTimeout(() => {
      fail("Google sign-in timed out. Please try again.");
    }, 120000);

    window.addEventListener("message", onMessage);
  });

const rememberAdminRedirect = () => {
  try {
    window.localStorage.setItem(ADMIN_REDIRECT_STORAGE_KEY, ADMIN_PATH);
    window.sessionStorage.setItem(ADMIN_REDIRECT_STORAGE_KEY, ADMIN_PATH);
  } catch {
    // Storage can be unavailable in strict/private browsers; the URL marker still handles redirects.
  }
};

export const clearAdminRedirect = () => {
  try {
    window.localStorage.removeItem(ADMIN_REDIRECT_STORAGE_KEY);
    window.sessionStorage.removeItem(ADMIN_REDIRECT_STORAGE_KEY);
  } catch {
    // Ignore storage restrictions.
  }
};

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(() => readAdminAuthError());

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
    rememberAdminRedirect();

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
    clearAdminRedirect();

    return true;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsSubmitting(true);
    setAuthError(null);
    rememberAdminRedirect();

    const redirectUrl = new URL(isLocalBrowser() ? ADMIN_PATH : "/", window.location.origin);
    redirectUrl.searchParams.set(ADMIN_LOGIN_PARAM, "1");

    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: redirectUrl.toString(),
      extraParams: {
        project_id: LOVABLE_PROJECT_ID,
        login_hint: ADMIN_EMAIL,
        prompt: "select_account",
      },
    });

    setIsSubmitting(false);

    if (result.error) {
      clearAdminRedirect();
      setAuthError(`Google sign-in failed: ${result.error.message}`);
      return false;
    }

    if (result.redirected) {
      return true;
    }

    const { data } = await supabase.auth.getSession();
    setSession(data.session);

    if (!isAdminEmail(data.session?.user.email)) {
      clearAdminRedirect();
      setAuthError(`Only ${ADMIN_EMAIL} can access the admin panel.`);
      return false;
    }

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
