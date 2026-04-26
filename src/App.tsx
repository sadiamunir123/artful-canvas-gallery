import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, ADMIN_LOGIN_PARAM, ADMIN_REDIRECT_STORAGE_KEY, clearAdminRedirect } from "@/hooks/useAdminAuth";
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

const hasPendingAdminLogin = (search: string, hash: string) => {
  const params = new URLSearchParams(search);
  if (params.has(ADMIN_LOGIN_PARAM) || hash.includes("access_token") || hash.includes("refresh_token")) return true;

  try {
    return (
      window.localStorage.getItem(ADMIN_REDIRECT_STORAGE_KEY) === "/admin" ||
      window.sessionStorage.getItem(ADMIN_REDIRECT_STORAGE_KEY) === "/admin"
    );
  } catch {
    return false;
  }
};

const AdminLoginRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/" || !hasPendingAdminLogin(location.search, location.hash)) return;

    let active = true;
    const sendAdminHome = (email?: string | null) => {
      if (!active || (email ?? "").trim().toLowerCase() !== ADMIN_EMAIL) return;
      clearAdminRedirect();
      navigate("/admin", { replace: true });
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
