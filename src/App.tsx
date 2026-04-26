import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ADMIN_AUTH_ERROR_PARAM,
  ADMIN_EMAIL,
  ADMIN_LOGIN_PARAM,
  ADMIN_REDIRECT_STORAGE_KEY,
  clearAdminRedirect,
} from "@/hooks/useAdminAuth";
import Index from "./pages/Index.tsx";
import Paintings from "./pages/Paintings.tsx";
import Artist from "./pages/Artist.tsx";
import Services from "./pages/Services.tsx";
import Contact from "./pages/Contact.tsx";
import Cart from "./pages/Cart.tsx";
import Blog from "./pages/Blog.tsx";
import Admin from "./pages/Admin.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ADMIN_PATH = "/admin";
const LOVABLE_OAUTH_ORIGIN = "https://oauth.lovable.app";
const LOVABLE_PROJECT_ID = "271daa9e-a0d1-4284-8864-d8601052c602";
const ADMIN_SESSION_CHECK_DELAY_MS = 250;
const MAX_ADMIN_SESSION_CHECKS = 20;

const OAuthBrokerRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const brokerPath = location.pathname.replace(/^\/\~oauth/, "") || "/initiate";
    const params = new URLSearchParams(location.search);
    params.set("project_id", LOVABLE_PROJECT_ID);
    window.location.replace(`${LOVABLE_OAUTH_ORIGIN}${brokerPath}?${params.toString()}`);
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6 text-center">
      <p className="font-body text-sm text-muted-foreground animate-pulse">Opening secure Google sign-in...</p>
    </div>
  );
};

const getAdminOAuthError = (search: string, hash: string) => {
  const params = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  return (
    params.get("error_description") ??
    params.get("error") ??
    hashParams.get("error_description") ??
    hashParams.get("error")
  );
};

const isAdminOAuthReturn = (search: string, hash: string) => {
  const params = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  if (
    params.has(ADMIN_LOGIN_PARAM) ||
    params.has("code") ||
    params.has("error") ||
    hashParams.has("access_token") ||
    hashParams.has("refresh_token") ||
    hashParams.has("error")
  ) {
    return true;
  }

  try {
    return (
      window.localStorage.getItem(ADMIN_REDIRECT_STORAGE_KEY) === ADMIN_PATH ||
      window.sessionStorage.getItem(ADMIN_REDIRECT_STORAGE_KEY) === ADMIN_PATH
    );
  } catch {
    return false;
  }
};

const AdminLoginRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isReturnPath = location.pathname === "/" || location.pathname === ADMIN_PATH;
    if (!isReturnPath || !isAdminOAuthReturn(location.search, location.hash)) return;

    const oauthError = getAdminOAuthError(location.search, location.hash);
    if (oauthError) {
      clearAdminRedirect();
      navigate(`${ADMIN_PATH}?${ADMIN_AUTH_ERROR_PARAM}=${encodeURIComponent(oauthError)}`, { replace: true });
      return;
    }

    let active = true;
    let checks = 0;
    let retryTimer: number | undefined;

    const sendAdminHome = (email?: string | null) => {
      if (!active || (email ?? "").trim().toLowerCase() !== ADMIN_EMAIL) return false;
      clearAdminRedirect();
      navigate(ADMIN_PATH, { replace: true });
      return true;
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      sendAdminHome(session?.user.email);
    });

    const checkSession = () => {
      checks += 1;
      void supabase.auth.getSession().then(({ data }) => {
        if (sendAdminHome(data.session?.user.email) || !active) return;

        if (checks < MAX_ADMIN_SESSION_CHECKS) {
          retryTimer = window.setTimeout(checkSession, ADMIN_SESSION_CHECK_DELAY_MS);
          return;
        }

        clearAdminRedirect();
        navigate(
          `${ADMIN_PATH}?${ADMIN_AUTH_ERROR_PARAM}=${encodeURIComponent(
            "Admin login did not complete. Please try Google sign-in again.",
          )}`,
          { replace: true },
        );
      });
    };

    checkSession();

    return () => {
      active = false;
      if (retryTimer) window.clearTimeout(retryTimer);
      listener.subscription.unsubscribe();
    };
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminLoginRedirect />
          <Routes>
            <Route path="/~oauth/*" element={<OAuthBrokerRedirect />} />
            <Route path="/" element={<Index />} />
            <Route path="/paintings" element={<Paintings />} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
