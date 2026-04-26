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
    const sendAdminHome = (email?: string | null) => {
      if (!active || (email ?? "").trim().toLowerCase() !== ADMIN_EMAIL) return;
      clearAdminRedirect();
      navigate(ADMIN_PATH, { replace: true });
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      sendAdminHome(session?.user.email);
    });

    void supabase.auth.getSession().then(({ data }) => {
      sendAdminHome(data.session?.user.email);
    });

    return () => {
      active = false;
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
