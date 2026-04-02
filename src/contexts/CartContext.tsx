import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Artwork } from "@/hooks/useArtworks";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  submitOrder: (customer: { name: string; email: string; phone: string; address: string }) => Promise<boolean>;
  isSubmitting: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addToCart = useCallback((artwork: Artwork) => {
    if (!artwork.available) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.artwork.id === artwork.id);
      if (existing) return prev;
      return [...prev, { artwork, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((artworkId: string) => {
    setItems((prev) => prev.filter((item) => item.artwork.id !== artworkId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.artwork.price, 0);

  const submitOrder = useCallback(async (customer: { name: string; email: string; phone: string; address: string }) => {
    if (items.length === 0) return false;
    setIsSubmitting(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_address: customer.address,
          total_price: totalPrice,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items (this triggers mark_artwork_sold)
      const orderItems = items.map((item) => ({
        order_id: order.id,
        artwork_id: item.artwork.id,
        price_at_purchase: item.artwork.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Refresh artworks to reflect sold status
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      clearCart();
      toast({ title: "Order placed successfully!", description: "Thank you for your purchase. We will contact you shortly." });
      return true;
    } catch (error) {
      console.error("Order error:", error);
      toast({ title: "Order failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [items, totalPrice, queryClient, clearCart, toast]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice, submitOrder, isSubmitting }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
