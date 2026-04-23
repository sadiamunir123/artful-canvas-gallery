import { useState } from "react";
import { useArtworks, type Artwork } from "@/hooks/useArtworks";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Save, X } from "lucide-react";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const emptyForm = {
  title: "",
  price: "",
  description: "",
  medium: "",
  size: "",
  year: "",
  image_url: "",
  category: "",
  available: true,
};

const Admin = () => {
  const { data: artworks = [], isLoading } = useArtworks();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { signOut } = useAdminAuth();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleToggleAvailability = async (artwork: Artwork) => {
    const { error } = await supabase
      .from("artworks")
      .update({ available: !artwork.available })
      .eq("id", artwork.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast({ title: artwork.available ? "Marked as Sold" : "Marked as Available" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast({ title: "Artwork deleted" });
    }
  };

  const startEdit = (artwork: Artwork) => {
    setEditingId(artwork.id);
    setForm({
      title: artwork.title,
      price: String(artwork.price),
      description: artwork.description,
      medium: artwork.medium,
      size: artwork.size,
      year: artwork.year,
      image_url: "",
      category: artwork.category,
      available: artwork.available,
    });
    setShowAddForm(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("artworks")
      .update({
        title: form.title,
        price: parseInt(form.price) || 0,
        description: form.description,
        medium: form.medium,
        size: form.size,
        year: form.year,
        category: form.category,
        available: form.available,
      })
      .eq("id", editingId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast({ title: "Artwork updated" });
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("artworks").insert({
      title: form.title,
      price: parseInt(form.price) || 0,
      description: form.description,
      medium: form.medium,
      size: form.size,
      year: form.year,
      image_url: form.image_url,
      category: form.category,
      available: form.available,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast({ title: "Artwork added!" });
      setForm(emptyForm);
      setShowAddForm(false);
    }
  };

  const formFields = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { key: "title", label: "Title", type: "text" },
        { key: "price", label: "Price (Rs)", type: "number" },
        { key: "medium", label: "Medium", type: "text" },
        { key: "size", label: "Size", type: "text" },
        { key: "year", label: "Year", type: "text" },
        { key: "category", label: "Category", type: "text" },
      ].map(({ key, label, type }) => (
        <div key={key}>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-1">{label}</label>
          <input
            type={type}
            value={form[key as keyof typeof form] as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full bg-secondary border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            required={key === "title" || key === "price"}
          />
        </div>
      ))}
      {showAddForm && (
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-1">Image Key</label>
          <input
            type="text"
            value={form.image_url}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
            className="w-full bg-secondary border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g. artwork-purple-fabric"
          />
        </div>
      )}
      <div className="md:col-span-2">
        <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full bg-secondary border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="font-body text-xs tracking-widest uppercase text-muted-foreground">Available</label>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
          className="text-primary"
        >
          {form.available ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-muted-foreground" />}
        </button>
      </div>
    </div>
  );

  const adminContent = () => (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <AdminHeader
            onAddArtwork={() => { setShowAddForm(true); setEditingId(null); setForm(emptyForm); }}
            onSignOut={() => void signOut()}
          />

          {/* Add form */}
          {showAddForm && (
            <div className="mb-8 p-6 border border-primary/30 bg-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-xl text-foreground">Add New Artwork</h2>
                <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <form onSubmit={handleAdd}>
                {formFields}
                <button type="submit" className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
                  <Save size={16} /> Save Artwork
                </button>
              </form>
            </div>
          )}

          {/* Artworks list */}
          {isLoading ? (
            <p className="font-body text-muted-foreground animate-pulse">Loading...</p>
          ) : (
            <div className="space-y-4">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-border bg-card">
                  <img src={artwork.image} alt={artwork.title} className="w-20 h-24 object-cover flex-shrink-0" />
                  
                  {editingId === artwork.id ? (
                    <div className="flex-1">
                      {formFields}
                      <div className="flex gap-3 mt-4">
                        <button onClick={handleSaveEdit} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors">
                          <Save size={14} /> Save
                        </button>
                        <button onClick={() => { setEditingId(null); setForm(emptyForm); }} className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-body text-xs tracking-widest uppercase hover:border-primary transition-colors">
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg text-foreground">{artwork.title}</h3>
                        <p className="font-body text-sm text-muted-foreground">{artwork.medium} — {artwork.size} — {artwork.year}</p>
                        <p className="font-body text-sm text-primary mt-1">Rs {artwork.price.toLocaleString()}</p>
                        <span className={`inline-block mt-1 font-body text-xs tracking-widest uppercase ${artwork.available ? "text-green-400" : "text-destructive"}`}>
                          {artwork.available ? "Available" : "Sold"}
                        </span>
                      </div>
                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(artwork)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleToggleAvailability(artwork)} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Toggle availability">
                          {artwork.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button onClick={() => handleDelete(artwork.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="pt-24 pb-16 px-6 md:px-12 flex items-center justify-center min-h-[80vh]">
        <AdminAuthGate onAuthenticated={adminContent} />
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
