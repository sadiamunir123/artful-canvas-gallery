import { ArrowLeft, LogOut, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type AdminHeaderProps = {
  onAddArtwork: () => void;
  onSignOut: () => void;
};

export const AdminHeader = ({ onAddArtwork, onSignOut }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
          <ArrowLeft size={16} /> Back to Site
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-foreground">Admin Panel</h1>
        <p className="font-body text-sm text-muted-foreground mt-2">Secure artwork management, pricing, and availability control.</p>
        <div className="brand-line w-16 mt-3" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onAddArtwork} className="gap-2">
          <Plus size={16} /> Add Artwork
        </Button>
        <Button variant="outline" onClick={onSignOut} className="gap-2">
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </div>
  );
};