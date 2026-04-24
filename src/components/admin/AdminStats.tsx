import { Package, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import type { Artwork } from "@/hooks/useArtworks";

type AdminStatsProps = { artworks: Artwork[] };

export const AdminStats = ({ artworks }: AdminStatsProps) => {
  const total = artworks.length;
  const available = artworks.filter((a) => a.available).length;
  const sold = total - available;
  const inventoryValue = artworks
    .filter((a) => a.available)
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const stats = [
    { label: "Total Artworks", value: total, icon: Package, color: "text-foreground" },
    { label: "Available", value: available, icon: CheckCircle2, color: "text-primary" },
    { label: "Sold", value: sold, icon: XCircle, color: "text-destructive" },
    {
      label: "Inventory Value",
      value: `Rs ${inventoryValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="border border-border bg-card p-5 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
              {label}
            </p>
            <Icon size={16} className={color} />
          </div>
          <p className={`font-display text-2xl ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
};
