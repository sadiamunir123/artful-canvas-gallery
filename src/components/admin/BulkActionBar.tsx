import { useState } from "react";
import { CheckCircle2, XCircle, Tag, X, Loader2, Percent } from "lucide-react";

type BulkActionBarProps = {
  selectedCount: number;
  onClear: () => void;
  onMarkAvailable: () => Promise<void> | void;
  onMarkSold: () => Promise<void> | void;
  onApplyPrice: (mode: "set" | "increase" | "decrease", value: number) => Promise<void> | void;
};

type PriceMode = "set" | "increase" | "decrease";

export const BulkActionBar = ({
  selectedCount,
  onClear,
  onMarkAvailable,
  onMarkSold,
  onApplyPrice,
}: BulkActionBarProps) => {
  const [priceMode, setPriceMode] = useState<PriceMode>("set");
  const [priceValue, setPriceValue] = useState("");
  const [busy, setBusy] = useState<null | "available" | "sold" | "price">(null);

  if (selectedCount === 0) return null;

  const run = async (kind: "available" | "sold" | "price", fn: () => Promise<void> | void) => {
    setBusy(kind);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const handleApplyPrice = async () => {
    const num = parseFloat(priceValue);
    if (!Number.isFinite(num) || num < 0) return;
    await run("price", () => onApplyPrice(priceMode, num));
    setPriceValue("");
  };

  const PRICE_MODES: { value: PriceMode; label: string }[] = [
    { value: "set", label: "Set to" },
    { value: "increase", label: "+ Rs" },
    { value: "decrease", label: "− Rs" },
  ];

  return (
    <div className="sticky top-20 z-20 mb-6 border border-primary/40 bg-card/95 backdrop-blur p-4 shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-sm bg-primary text-primary-foreground font-display text-sm tabular-nums">
            {selectedCount}
          </span>
          <span className="font-body text-sm text-foreground">
            {selectedCount === 1 ? "artwork selected" : "artworks selected"}
          </span>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={12} /> Clear
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => run("available", onMarkAvailable)}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 px-3 py-2 border border-primary/40 text-primary font-body text-xs tracking-widest uppercase hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            {busy === "available" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Mark Available
          </button>
          <button
            onClick={() => run("sold", onMarkSold)}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 px-3 py-2 border border-destructive/40 text-destructive font-body text-xs tracking-widest uppercase hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            {busy === "sold" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
            Mark Sold
          </button>

          <div className="flex items-center gap-1 border border-border bg-secondary/40 pl-1">
            <Tag size={14} className="text-muted-foreground ml-1" />
            <select
              value={priceMode}
              onChange={(e) => setPriceMode(e.target.value as PriceMode)}
              className="bg-transparent font-body text-xs uppercase tracking-widest text-foreground py-2 pr-1 focus:outline-none"
            >
              {PRICE_MODES.map((m) => (
                <option key={m.value} value={m.value} className="bg-card">
                  {m.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              placeholder={priceMode === "set" ? "PKR amount" : "PKR delta"}
              className="w-28 bg-transparent border-l border-border px-2 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <button
              onClick={handleApplyPrice}
              disabled={busy !== null || priceValue.trim() === ""}
              className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {busy === "price" ? <Loader2 size={14} className="animate-spin" /> : <Percent size={14} />}
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
