import { ArrowLeft, LogOut, Plus, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type AdminHeaderProps = {
  onAddArtwork: () => void;
  onSignOut: () => void;
  adminEmail?: string | null;
};

export const AdminHeader = ({ onAddArtwork, onSignOut, adminEmail }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
        >
          <ArrowLeft size={16} /> Back to Site
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl md:text-4xl text-foreground">Admin Dashboard</h1>
          <span className="inline-flex items-center gap-1 rounded-sm bg-primary/15 px-2 py-1 text-[10px] tracking-widest uppercase text-primary">
            <ShieldCheck size={12} /> Secure
          </span>
        </div>
        <p className="font-body text-sm text-muted-foreground mt-2">
          {adminEmail ? <>Signed in as <span className="text-foreground">{adminEmail}</span> · </> : null}
          Manage your collection, pricing, and availability.
        </p>
        <div className="brand-line w-16 mt-3" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onAddArtwork} className="gap-2">
          <Plus size={16} /> Add Artwork
        </Button>
        <Button variant="outline" onClick={onSignOut} className="gap-2">
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </div>
  );
};
