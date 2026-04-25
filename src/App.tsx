import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
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

const ADMIN_AUTH_REDIRECT_KEY = "haqarts.admin.redirect";

const restoreAdminOAuthRoute = () => {
  if (typeof window === "undefined") return;

  const pendingPath =
    window.localStorage.getItem(ADMIN_AUTH_REDIRECT_KEY) ??
    window.sessionStorage.getItem(ADMIN_AUTH_REDIRECT_KEY);

  const isOAuthReturn =
    window.location.pathname === "/" ||
    window.location.pathname.startsWith("/~oauth") ||
    window.location.search.includes("code=") ||
    window.location.hash.includes("access_token=");

  if (pendingPath === "/admin" && isOAuthReturn) {
    window.localStorage.removeItem(ADMIN_AUTH_REDIRECT_KEY);
    window.sessionStorage.removeItem(ADMIN_AUTH_REDIRECT_KEY);
    window.history.replaceState(null, "", "/admin");
  }
};

restoreAdminOAuthRoute();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
